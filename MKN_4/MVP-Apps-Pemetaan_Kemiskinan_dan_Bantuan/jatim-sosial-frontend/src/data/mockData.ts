import type { TimelineEvent } from '../components/ui/TimelineModal';

export type Tahap = 'analisis' | 'validasi' | 'aktif' | 'evaluasi' | 'selesai';

export interface AnalisisOutput {
  id_keluarga: string; // Foreign key ke dataKeluarga.ts
  idLabel: string;
  tanggal: string;
  tahap: Tahap;
  aiReasoning?: string;
  rekomendasiBantuan?: string[];
  bantuan?: string[];
  desilSebelum?: number;
  desilSesudah?: number;
  skorKesejahteraan: number;
  timeline?: TimelineEvent[];
}

export const timelineAktif: TimelineEvent[] = [
  { status: 'Disetujui', timestamp: '10 Feb 2024, 08:30', isComplete: true },
  { status: 'Diproses', timestamp: '18 Feb 2024, 11:20', isComplete: true, notes: 'Sedang diverifikasi oleh dinas terkait.' },
  { status: 'Disalurkan', timestamp: '', isComplete: false },
  { status: 'Selesai', timestamp: '', isComplete: false },
];

export const timelineSelesai: TimelineEvent[] = [
  { status: 'Disetujui', timestamp: '01 Nov 2023, 09:00', isComplete: true },
  { status: 'Diproses', timestamp: '05 Nov 2023, 14:30', isComplete: true },
  { status: 'Disalurkan', timestamp: '12 Nov 2023, 10:15', isComplete: true },
  { status: 'Selesai', timestamp: '15 Nov 2023, 16:00', isComplete: true },
];

export const mockData: AnalisisOutput[] = [
  // Tahap Analisis
  { id_keluarga: 'FAM-001', idLabel: '#AN-20231001', tanggal: '12 Okt 2023', tahap: 'analisis', skorKesejahteraan: 0.145, rekomendasiBantuan: ['PKH', 'BPNT', 'BLT BBM', 'PBI JK'], aiReasoning: 'Berdasarkan data kependudukan, keluarga memiliki 3 balita dan kepala keluarga kehilangan pekerjaan utama. Pendapatan di bawah garis kemiskinan ekstrem.' },
  { id_keluarga: 'FAM-002', idLabel: '#AN-20231002', tanggal: '14 Okt 2023', tahap: 'analisis', skorKesejahteraan: 0.421, rekomendasiBantuan: ['BPNT', 'Prakerja'], aiReasoning: 'Keluarga ibu tunggal dengan pendapatan tidak tetap. Kepemilikan aset hanya berupa kendaraan bermotor roda dua tahun tua. Rentan terhadap guncangan ekonomi.' },
  { id_keluarga: 'FAM-003', idLabel: '#AN-20231003', tanggal: '15 Okt 2023', tahap: 'analisis', skorKesejahteraan: 0.913, rekomendasiBantuan: [], aiReasoning: 'Sistem mendeteksi bahwa kepala keluarga memiliki riwayat pajak sebagai pengusaha menengah dan kepemilikan mobil pribadi. Keluarga ini diklasifikasikan tidak layak menerima bantuan sosial.' },

  // Tahap Validasi
  { id_keluarga: 'FAM-004', idLabel: '#KS-09412', tanggal: '12 Okt 2023', tahap: 'validasi', rekomendasiBantuan: ['PKH', 'BPNT', 'BLT BBM', 'Rutilahu'], bantuan: ['PKH', 'BPNT', 'BLT BBM'], skorKesejahteraan: 0.120, aiReasoning: 'Kondisi rumah sangat tidak layak huni (berlantai tanah, dinding bambu lapuk). Terdapat anggota keluarga lansia dan penyandang disabilitas yang memerlukan dukungan nutrisi khusus.' },
  { id_keluarga: 'FAM-005', idLabel: '#KS-09413', tanggal: '13 Okt 2023', tahap: 'validasi', rekomendasiBantuan: ['BPNT', 'BLT DD', 'PBI JK'], bantuan: ['BPNT', 'PBI JK'], skorKesejahteraan: 0.245, aiReasoning: 'Pekerjaan utama buruh tani musiman dengan penghasilan fluktuatif. Terdapat riwayat tunggakan BPJS Kesehatan selama 2 tahun terakhir, mengindikasikan ketidakmampuan bayar iuran mandiri.' },
  { id_keluarga: 'FAM-006', idLabel: '#KS-09415', tanggal: '14 Okt 2023', tahap: 'validasi', rekomendasiBantuan: ['BST', 'PKH', 'KIP'], bantuan: ['BST', 'PKH'], skorKesejahteraan: 0.352, aiReasoning: 'Keluarga memiliki 2 anak usia sekolah menengah yang terancam putus sekolah. Pendapatan rumah tangga menurun signifikan setelah kepala keluarga terkena PHK massal tahun lalu.' },

  // Tahap Aktif
  { id_keluarga: 'FAM-007', idLabel: '#BTN-PKH-8821', tanggal: '10 Feb 2024', tahap: 'aktif', rekomendasiBantuan: ['PKH', 'BPNT', 'BLT BBM', 'Rutilahu'], bantuan: ['PKH', 'BPNT'], timeline: timelineAktif, skorKesejahteraan: 0.182, aiReasoning: 'Kondisi sanitasi rumah buruk dan balita mengalami gejala stunting. Rekomendasi prioritas adalah perbaikan asupan gizi melalui PKH dan BPNT.' },
  { id_keluarga: 'FAM-008', idLabel: '#BTN-BPT-8822', tanggal: '15 Jan 2024', tahap: 'aktif', rekomendasiBantuan: ['BPNT', 'BLT BBM', 'Prakerja'], bantuan: ['BPNT', 'BLT BBM'], timeline: timelineSelesai, skorKesejahteraan: 0.298, aiReasoning: 'Terdapat penurunan daya beli yang drastis akibat lonjakan harga bahan pokok. Analisis transaksi menunjukkan proporsi konsumsi makanan mengambil >75% total pengeluaran rumah tangga.' },
  { id_keluarga: 'FAM-009', idLabel: '#BTN-BLT-8823', tanggal: '20 Feb 2024', tahap: 'aktif', rekomendasiBantuan: ['BLT BBM', 'PBI JK'], bantuan: ['BLT BBM'], timeline: timelineAktif, skorKesejahteraan: 0.384, aiReasoning: 'Keluarga memiliki usaha mikro informal yang sangat terdampak inflasi BBM. Bantuan langsung tunai diperlukan untuk menyangga operasional usaha dan kebutuhan dasar.' },

  // Tahap Evaluasi
  { id_keluarga: 'FAM-010', idLabel: '#EV-40101', tanggal: '01 Mar 2024', tahap: 'evaluasi', rekomendasiBantuan: ['PKH', 'KUBE'], bantuan: ['PKH'], desilSebelum: 1, desilSesudah: 3, skorKesejahteraan: 0.321, aiReasoning: 'Setelah 1 tahun menerima PKH, terdapat peningkatan skor kesejahteraan berkat tambahan pendapatan dari anak tertua yang lulus sekolah. Evaluasi sistem menyarankan penurunan intensitas bantuan tunai.' },
  { id_keluarga: 'FAM-011', idLabel: '#EV-40102', tanggal: '05 Mar 2024', tahap: 'evaluasi', rekomendasiBantuan: ['BPNT', 'Prakerja'], bantuan: ['BPNT', 'Prakerja'], desilSebelum: 2, desilSesudah: 5, skorKesejahteraan: 0.554, aiReasoning: 'Partisipasi dalam program Prakerja telah membuahkan hasil dengan diterimanya kepala keluarga bekerja secara penuh waktu. Keluarga ini diproyeksikan akan segera keluar dari kelompok rentan.' },
  { id_keluarga: 'FAM-012', idLabel: '#EV-40103', tanggal: '10 Mar 2024', tahap: 'evaluasi', rekomendasiBantuan: ['BST', 'PBI JK'], bantuan: ['BST'], desilSebelum: 3, desilSesudah: 3, skorKesejahteraan: 0.367, aiReasoning: 'Meskipun mendapat bantuan, kondisi belum menunjukkan perubahan signifikan karena ada penyakit kronis pada kepala keluarga. Diperlukan intervensi bantuan kesehatan lanjutan.' },

  // Tahap Selesai
  { id_keluarga: 'FAM-013', idLabel: '#SL-70101', tanggal: '20 Mar 2024', tahap: 'selesai', rekomendasiBantuan: ['BLT BBM', 'PKH'], bantuan: ['BLT BBM'], skorKesejahteraan: 0.489, aiReasoning: 'Data terbaru dari capil dan dinas pajak menunjukkan pendapatan per kapita keluarga secara konsisten berada di atas Upah Minimum Kota selama 6 bulan terakhir. Keluarga dinyatakan lulus dari program kemiskinan.' },
];
