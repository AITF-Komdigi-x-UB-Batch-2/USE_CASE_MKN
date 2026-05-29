import os
import torch
import wandb
import json
from huggingface_hub import login, HfApi
from datasets import load_dataset
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from tqdm import tqdm
import evaluate
from unsloth import FastLanguageModel
from unsloth import is_bfloat16_supported
from trl import SFTTrainer
from transformers import TrainingArguments

# =====================================================================
# 1. KONFIGURASI OTENTIKASI & VARIABEL UTAMA
# =====================================================================
HF_TOKEN = "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"
WANDB_API_KEY = "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"

login(token=HF_TOKEN)
wandb.login(key=WANDB_API_KEY)

wandb.init(
    project="Qwen3-8b-CPT&SFT_V1",
    name="Qwen3-8B-v1 (Unsloth + Eval)",
    notes="SFT Qwen3-8B CPT with Unsloth & ROUGE/BLEU Evaluation"
)

MAX_SEQ_LENGTH = 4096
model_id = "alvinrifky/Qwen3-8B-AITF-CPT-v2"
hf_repo_tujuan = "aitf-ub-2026/Qwen3-8b-CPT-SFT-V1"

# =====================================================================
# 2. LOAD MODEL & TOKENIZER VIA UNSLOTH 
# =====================================================================
print(f"[-] Mengunduh model & tokenizer dari: {model_id}")
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = model_id,
    max_seq_length = MAX_SEQ_LENGTH,
    dtype = None, 
    load_in_4bit = True,
    trust_remote_code = True,
)

if tokenizer.chat_template is None:
    tokenizer.chat_template = "{% for message in messages %}{{'<|im_start|>' + message['role'] + '\n' + message['content'] + '<|im_end|>' + '\n'}}{% endfor %}{% if add_generation_prompt %}{{ '<|im_start|>assistant\n' }}{% endif %}"

# =====================================================================
# 3. KONFIGURASI LoRA 
# =====================================================================
model = FastLanguageModel.get_peft_model(
    model,
    r = 16,
    target_modules = ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha = 32,
    lora_dropout = 0, 
    bias = "none",
    use_gradient_checkpointing = "unsloth", 
    random_state = 3407,
)

# =====================================================================
# 4. PREPARASI DATASET 
# =====================================================================
print("[-] Memuat dataset train dan validation...")
raw_datasets = load_dataset("json", data_files={
    "train": "data/processed/train_pkh.jsonl",
    "validation": "data/processed/val_pkh.jsonl"
})

def formatting_prompts_func(examples):
    texts = []
    for messages in examples["messages"]:
        text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=False)
        texts.append(text)
    return {"text": texts}

processed_datasets = raw_datasets.map(
    formatting_prompts_func,
    batched = True,
    remove_columns = raw_datasets["train"].column_names, 
)

# =====================================================================
# 5. INISIALISASI SFT TRAINER
# =====================================================================
trainer = SFTTrainer(
    model = model,
    tokenizer = tokenizer,
    train_dataset = processed_datasets["train"],
    eval_dataset = processed_datasets["validation"],
    dataset_text_field = "text",
    max_seq_length = MAX_SEQ_LENGTH,
    dataset_num_proc = 8, 
    packing = True,   
    args = TrainingArguments(
        output_dir = "outputs_qwen3_v1",
        per_device_train_batch_size = 8,  
        gradient_accumulation_steps = 4,  
        warmup_ratio = 0.05,
        num_train_epochs = 3,
        learning_rate = 2e-4,
        fp16 = False, 
        bf16 = True,  
        logging_steps = 5,
        optim = "adamw_8bit",
        weight_decay = 0.01,
        lr_scheduler_type = "cosine",
        eval_strategy = "steps",
        eval_steps = 25,
        save_strategy = "steps",
        save_steps = 100,
        save_total_limit = 1,
        dataloader_num_workers = 4, 
        report_to = "wandb",
        run_name = "qwen3-8b-v1-unsloth-A100"
    ),
)

# =====================================================================
# 6. MULAI TRAINING
# =====================================================================
print("[🚀] Memulai Proses SFT dengan Unsloth...")
trainer_stats = trainer.train()

# =====================================================================
# 7. GENERATE CHART 
# =====================================================================
log_history = trainer.state.log_history
train_steps, train_losses, eval_steps, eval_losses = [], [], [], []

for log in log_history:
    step = log.get("step")
    if "loss" in log:
        train_steps.append(step)
        train_losses.append(log["loss"])
    if "eval_loss" in log:
        eval_steps.append(step)
        eval_losses.append(log["eval_loss"])

plt.figure(figsize=(10, 6))
if train_steps:
    plt.plot(train_steps, train_losses, label="Training Loss", color="#1f77b4", linewidth=2)
if eval_steps:
    plt.plot(eval_steps, eval_losses, label="Validation Loss", color="#d62728", marker="o", linestyle="--", linewidth=2)

plt.title("Qwen3-8B SFT: Grafik Performa Unsloth", fontsize=14, fontweight='bold', pad=15)
plt.xlabel("Steps", fontsize=11, labelpad=10)
plt.ylabel("Loss", fontsize=11, labelpad=10)
plt.grid(True, linestyle=":", alpha=0.6)
plt.legend(loc="upper right")

os.makedirs("outputs_qwen3_v1", exist_ok=True)
chart_path = "outputs_qwen3_v1/loss_performance_chart.png"
plt.savefig(chart_path, dpi=300, bbox_inches="tight")
plt.close()
print(f"\n[SUKSES] Grafik garis performa model berhasil digenerate!")

# =====================================================================
# 8. EVALUASI ROUGE & BLEU PADA DATASET EVAL (BATCHED INFERENCE)
# =====================================================================
print("\n[📊] Memulai Evaluasi ROUGE & BLEU pada eval_pkh.jsonl...")

FastLanguageModel.for_inference(model)

rouge_metric = evaluate.load("rouge")
bleu_metric = evaluate.load("sacrebleu")

eval_dataset_raw = load_dataset("json", data_files={"eval": "data/processed/eval_pkh.jsonl"})["eval"]

predictions = []
references = []

tokenizer.padding_side = "left" 
tokenizer.pad_token = tokenizer.eos_token if tokenizer.pad_token is None else tokenizer.pad_token
eval_batch_size = 8

for i in tqdm(range(0, len(eval_dataset_raw), eval_batch_size), desc="Generating Responses (Batched)"):
    batch = eval_dataset_raw[i : i + eval_batch_size]
    
    prompts = []
    for messages in batch["messages"]:
        prompt_msgs = [msg for msg in messages if msg["role"] != "assistant"]
        ref_msg = next((msg["content"] for msg in messages if msg["role"] == "assistant"), "")
        references.append(ref_msg.strip())

        formatted_prompt = tokenizer.apply_chat_template(prompt_msgs, tokenize=False, add_generation_prompt=True)
        prompts.append(formatted_prompt)
    
    inputs = tokenizer(prompts, return_tensors="pt", padding=True, truncation=True, max_length=MAX_SEQ_LENGTH).to("cuda")
    
    outputs = model.generate(
        **inputs, 
        max_new_tokens=2048, 
        use_cache=True, 
        pad_token_id=tokenizer.eos_token_id
    )
    
    # Decode spesifik hanya pada bagian teks yang di-generate (memotong prompt awal)
    input_length = inputs.input_ids.shape[1]
    generated_texts = tokenizer.batch_decode(outputs[:, input_length:], skip_special_tokens=True)
    
    predictions.extend([text.strip() for text in generated_texts])

# Hitung metrik
rouge_results = rouge_metric.compute(predictions=predictions, references=references)
bleu_results = bleu_metric.compute(predictions=predictions, references=[[ref] for ref in references])

print("\n--- HASIL EVALUASI ---")
print(f"ROUGE: {rouge_results}")
print(f"BLEU: {bleu_results}")

wandb.log({"rouge": rouge_results, "bleu": bleu_results})
with open("outputs_qwen3_v1/evaluation_metrics.json", "w") as f:
    json.dump({"rouge": rouge_results, "bleu": bleu_results}, f, indent=4)

wandb.finish()

# =====================================================================
# 9. SAFE MERGE & UPLOAD VIA UNSLOTH + UPLOAD FILE TAMBAHAN
# =====================================================================
print("\n[🚀] Memulai proses penggabungan (merge) dan unggah model utuh ke Hugging Face...")

model.push_to_hub_merged(
    hf_repo_tujuan,
    tokenizer,
    save_method = "merged_16bit", 
    token = HF_TOKEN
)

print("Mengunggah file grafik dan metrik evaluasi ke Hugging Face...")
api = HfApi()

# Upload Chart
api.upload_file(
    path_or_fileobj=chart_path, 
    path_in_repo="loss_performance_chart.png", 
    repo_id=hf_repo_tujuan,
    repo_type="model",
    token=HF_TOKEN
)

# Upload Metrik Evaluasi
api.upload_file(
    path_or_fileobj="outputs_qwen3_v1/evaluation_metrics.json", 
    path_in_repo="evaluation_metrics.json", 
    repo_id=hf_repo_tujuan,
    repo_type="model",
    token=HF_TOKEN
)

print("Berhasil! Sistem latihan bersih, kokoh, dievaluasi dengan baik, dan semua file terunggah sempurna.")