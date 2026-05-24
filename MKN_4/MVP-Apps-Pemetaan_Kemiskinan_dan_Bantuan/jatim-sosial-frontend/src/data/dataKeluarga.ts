export interface KeluargaData {
  id_keluarga: string;
  
  // 1. Informasi Wilayah
  kode_provinsi: string;
  nama_provinsi: string;
  kode_kabupaten_kota: string;
  nama_kabupaten_kota: string;
  kode_kecamatan: string;
  nama_kecamatan: string;
  kode_kelurahan_desa: string;
  nama_kelurahan_desa: string;

  // 2. Data Keluarga
  alamat_domisili: string;
  nomor_kk: string;
  nik_kepala_keluarga: string;
  jumlah_anggota_keluarga: number;
  nama_kepala_keluarga: string;
  desil_kesejahteraan: number;

  // 3. Bantuan & Identitas Tambahan
  penerima_bantuan_iuran_nasional: string;
  penerima_bantuan_iuran_pemda: string;
  id_pelanggan_pln: string;

  // 4. Kondisi Rumah
  status_kepemilikan_rumah: string;
  jenis_lantai: string;
  luas_lantai: number;
  jenis_dinding: string;
  jenis_atap: string;

  // 5. Utilitas Rumah
  sumber_air_minum: string;
  sumber_penerangan: string;
  daya_listrik: string;
  bahan_bakar_memasak: string;

  // 6. Sanitasi
  fasilitas_bab: string;
  jenis_kloset: string;
  pembuangan_akhir_tinja: string;

  // 7. Kepemilikan Aset (Flag Umum)
  flag_kepemilikan_aset: number;

  // 8. Aset Bergerak
  tabung_gas: number;
  kulkas: number;
  ac: number;
  water_heater: number;
  telepon_rumah: number;
  tv: number;
  emas: number;
  komputer_laptop_tablet: number;
  sepeda_motor: number;
  sepeda: number;
  mobil: number;
  perahu: number;
  kapal_motor: number;
  smartphone: number;

  // 9. Aset Tidak Bergerak
  lahan_lain: number;
  rumah_lain: number;

  // 10. Kepemilikan Ternak
  jumlah_sapi: number;
  jumlah_kerbau: number;
  jumlah_kuda: number;
  jumlah_babi: number;
  jumlah_kambing_domba: number;
}

export const rawKeluargaData: KeluargaData[] = [
  {
    id_keluarga: 'FAM-001',
    kode_provinsi: '35', nama_provinsi: 'Jawa Timur',
    kode_kabupaten_kota: '73', nama_kabupaten_kota: 'Malang',
    kode_kecamatan: '01', nama_kecamatan: 'Blimbing',
    kode_kelurahan_desa: '001', nama_kelurahan_desa: 'Purwodadi',
    alamat_domisili: 'Jl. Genteng Besar No. 12',
    nomor_kk: '3578012300000001', nik_kepala_keluarga: '3578012300094001',
    jumlah_anggota_keluarga: 5, nama_kepala_keluarga: 'Budi Santoso', desil_kesejahteraan: 1,
    penerima_bantuan_iuran_nasional: 'YA', penerima_bantuan_iuran_pemda: 'TIDAK', id_pelanggan_pln: '51234567801',
    status_kepemilikan_rumah: 'Sewa/Kontrak', jenis_lantai: 'Semen', luas_lantai: 15, jenis_dinding: 'Triplek/Papan', jenis_atap: 'Asbes',
    sumber_air_minum: 'Sumur', sumber_penerangan: 'Listrik PLN', daya_listrik: '450 VA', bahan_bakar_memasak: 'Kayu Bakar',
    fasilitas_bab: 'MCK Umum', jenis_kloset: 'Leher Angsa', pembuangan_akhir_tinja: 'Tangki Septik',
    flag_kepemilikan_aset: 0, tabung_gas: 0, kulkas: 0, ac: 0, water_heater: 0, telepon_rumah: 0, tv: 0, emas: 0, komputer_laptop_tablet: 0, sepeda_motor: 0, sepeda: 0, mobil: 0, perahu: 0, kapal_motor: 0, smartphone: 0,
    lahan_lain: 0, rumah_lain: 0, jumlah_sapi: 0, jumlah_kerbau: 0, jumlah_kuda: 0, jumlah_babi: 0, jumlah_kambing_domba: 0
  },
  {
    id_keluarga: 'FAM-002',
    kode_provinsi: '35', nama_provinsi: 'Jawa Timur',
    kode_kabupaten_kota: '73', nama_kabupaten_kota: 'Malang',
    kode_kecamatan: '06', nama_kecamatan: 'Klojen',
    kode_kelurahan_desa: '041', nama_kelurahan_desa: 'Rampal Celaket',
    alamat_domisili: 'Kav. Gedangan Asri Blok C',
    nomor_kk: '3515052300000002', nik_kepala_keluarga: '3578012300094005',
    jumlah_anggota_keluarga: 3, nama_kepala_keluarga: 'Siti Aminah', desil_kesejahteraan: 4,
    penerima_bantuan_iuran_nasional: 'TIDAK', penerima_bantuan_iuran_pemda: 'TIDAK', id_pelanggan_pln: '51234567802',
    status_kepemilikan_rumah: 'Bebas Sewa (Milik Orang Tua)', jenis_lantai: 'Keramik', luas_lantai: 36, jenis_dinding: 'Tembok', jenis_atap: 'Genteng',
    sumber_air_minum: 'PDAM', sumber_penerangan: 'Listrik PLN', daya_listrik: '900 VA', bahan_bakar_memasak: 'Gas LPG 3kg',
    fasilitas_bab: 'Milik Sendiri', jenis_kloset: 'Leher Angsa', pembuangan_akhir_tinja: 'Tangki Septik',
    flag_kepemilikan_aset: 1, tabung_gas: 1, kulkas: 0, ac: 0, water_heater: 0, telepon_rumah: 0, tv: 1, emas: 0, komputer_laptop_tablet: 0, sepeda_motor: 1, sepeda: 0, mobil: 0, perahu: 0, kapal_motor: 0, smartphone: 1,
    lahan_lain: 0, rumah_lain: 0, jumlah_sapi: 0, jumlah_kerbau: 0, jumlah_kuda: 0, jumlah_babi: 0, jumlah_kambing_domba: 0
  },
  {
    id_keluarga: 'FAM-003',
    kode_provinsi: '35', nama_provinsi: 'Jawa Timur',
    kode_kabupaten_kota: '73', nama_kabupaten_kota: 'Malang',
    kode_kecamatan: '03', nama_kecamatan: 'Kedungkandang',
    kode_kelurahan_desa: '020', nama_kelurahan_desa: 'Sawojajar',
    alamat_domisili: 'Jl. Raya Wonokromo No. 99',
    nomor_kk: '3578022300000003', nik_kepala_keluarga: '3578012300094009',
    jumlah_anggota_keluarga: 4, nama_kepala_keluarga: 'Agus Riyadi', desil_kesejahteraan: 9,
    penerima_bantuan_iuran_nasional: 'TIDAK', penerima_bantuan_iuran_pemda: 'TIDAK', id_pelanggan_pln: '51234567803',
    status_kepemilikan_rumah: 'Milik Sendiri', jenis_lantai: 'Granit', luas_lantai: 120, jenis_dinding: 'Tembok', jenis_atap: 'Genteng',
    sumber_air_minum: 'PDAM', sumber_penerangan: 'Listrik PLN', daya_listrik: '2200 VA', bahan_bakar_memasak: 'Gas LPG 12kg',
    fasilitas_bab: 'Milik Sendiri', jenis_kloset: 'Leher Angsa', pembuangan_akhir_tinja: 'Tangki Septik',
    flag_kepemilikan_aset: 1, tabung_gas: 1, kulkas: 1, ac: 2, water_heater: 0, telepon_rumah: 0, tv: 2, emas: 1, komputer_laptop_tablet: 1, sepeda_motor: 2, sepeda: 0, mobil: 1, perahu: 0, kapal_motor: 0, smartphone: 3,
    lahan_lain: 0, rumah_lain: 0, jumlah_sapi: 0, jumlah_kerbau: 0, jumlah_kuda: 0, jumlah_babi: 0, jumlah_kambing_domba: 0
  },
  {
    id_keluarga: 'FAM-004',
    kode_provinsi: '35', nama_provinsi: 'Jawa Timur',
    kode_kabupaten_kota: '73', nama_kabupaten_kota: 'Malang',
    kode_kecamatan: '01', nama_kecamatan: 'Blimbing',
    kode_kelurahan_desa: '002', nama_kelurahan_desa: 'Polowijen',
    alamat_domisili: 'Bantaran Sungai Sawahan',
    nomor_kk: '3578032300000004', nik_kepala_keluarga: '3578056001000012',
    jumlah_anggota_keluarga: 4, nama_kepala_keluarga: 'Dewi Lestari', desil_kesejahteraan: 1,
    penerima_bantuan_iuran_nasional: 'YA', penerima_bantuan_iuran_pemda: 'TIDAK', id_pelanggan_pln: '',
    status_kepemilikan_rumah: 'Menumpang', jenis_lantai: 'Tanah', luas_lantai: 12, jenis_dinding: 'Bambu/Anyaman', jenis_atap: 'Seng Bekas',
    sumber_air_minum: 'Sungai', sumber_penerangan: 'Lampu Minyak', daya_listrik: 'Tidak Ada', bahan_bakar_memasak: 'Kayu Bakar',
    fasilitas_bab: 'Sungai', jenis_kloset: 'Tidak Ada', pembuangan_akhir_tinja: 'Langsung Sungai',
    flag_kepemilikan_aset: 0, tabung_gas: 0, kulkas: 0, ac: 0, water_heater: 0, telepon_rumah: 0, tv: 0, emas: 0, komputer_laptop_tablet: 0, sepeda_motor: 0, sepeda: 0, mobil: 0, perahu: 0, kapal_motor: 0, smartphone: 0,
    lahan_lain: 0, rumah_lain: 0, jumlah_sapi: 0, jumlah_kerbau: 0, jumlah_kuda: 0, jumlah_babi: 0, jumlah_kambing_domba: 0
  },
  {
    id_keluarga: 'FAM-005',
    kode_provinsi: '35', nama_provinsi: 'Jawa Timur',
    kode_kabupaten_kota: '73', nama_kabupaten_kota: 'Malang',
    kode_kecamatan: '04', nama_kecamatan: 'Lowokwaru',
    kode_kelurahan_desa: '026', nama_kelurahan_desa: 'Dinoyo',
    alamat_domisili: 'Desa Kebomas RT 02 RW 01',
    nomor_kk: '3516072300000005', nik_kepala_keluarga: '3515041101900015',
    jumlah_anggota_keluarga: 5, nama_kepala_keluarga: 'Agus Setiawan', desil_kesejahteraan: 2,
    penerima_bantuan_iuran_nasional: 'TIDAK', penerima_bantuan_iuran_pemda: 'YA', id_pelanggan_pln: '51234567805',
    status_kepemilikan_rumah: 'Sewa/Kontrak', jenis_lantai: 'Semen', luas_lantai: 20, jenis_dinding: 'Bata Merah Tidak Diplester', jenis_atap: 'Genteng Tanah Liat',
    sumber_air_minum: 'Sumur Terlindung', sumber_penerangan: 'Listrik PLN', daya_listrik: '450 VA', bahan_bakar_memasak: 'Gas LPG 3kg',
    fasilitas_bab: 'MCK Umum', jenis_kloset: 'Leher Angsa', pembuangan_akhir_tinja: 'Tangki Septik',
    flag_kepemilikan_aset: 1, tabung_gas: 1, kulkas: 0, ac: 0, water_heater: 0, telepon_rumah: 0, tv: 1, emas: 0, komputer_laptop_tablet: 0, sepeda_motor: 0, sepeda: 1, mobil: 0, perahu: 0, kapal_motor: 0, smartphone: 1,
    lahan_lain: 0, rumah_lain: 0, jumlah_sapi: 0, jumlah_kerbau: 0, jumlah_kuda: 0, jumlah_babi: 0, jumlah_kambing_domba: 0
  },
  {
    id_keluarga: 'FAM-006',
    kode_provinsi: '35', nama_provinsi: 'Jawa Timur',
    kode_kabupaten_kota: '73', nama_kabupaten_kota: 'Malang',
    kode_kecamatan: '05', nama_kecamatan: 'Sukun',
    kode_kelurahan_desa: '030', nama_kelurahan_desa: 'Bandungrejosari',
    alamat_domisili: 'Perumahan Padat Karya Blok A',
    nomor_kk: '3515082300000006', nik_kepala_keluarga: '3578022201890018',
    jumlah_anggota_keluarga: 4, nama_kepala_keluarga: 'Rina Wulandari', desil_kesejahteraan: 3,
    penerima_bantuan_iuran_nasional: 'TIDAK', penerima_bantuan_iuran_pemda: 'TIDAK', id_pelanggan_pln: '51234567806',
    status_kepemilikan_rumah: 'Milik Sendiri', jenis_lantai: 'Keramik', luas_lantai: 30, jenis_dinding: 'Tembok', jenis_atap: 'Asbes',
    sumber_air_minum: 'PDAM', sumber_penerangan: 'Listrik PLN', daya_listrik: '900 VA', bahan_bakar_memasak: 'Gas LPG 3kg',
    fasilitas_bab: 'Milik Sendiri', jenis_kloset: 'Leher Angsa', pembuangan_akhir_tinja: 'Tangki Septik',
    flag_kepemilikan_aset: 1, tabung_gas: 1, kulkas: 1, ac: 0, water_heater: 0, telepon_rumah: 0, tv: 1, emas: 0, komputer_laptop_tablet: 0, sepeda_motor: 1, sepeda: 0, mobil: 0, perahu: 0, kapal_motor: 0, smartphone: 2,
    lahan_lain: 0, rumah_lain: 0, jumlah_sapi: 0, jumlah_kerbau: 0, jumlah_kuda: 0, jumlah_babi: 0, jumlah_kambing_domba: 0
  },
  {
    id_keluarga: 'FAM-007',
    kode_provinsi: '35', nama_provinsi: 'Jawa Timur',
    kode_kabupaten_kota: '73', nama_kabupaten_kota: 'Malang',
    kode_kecamatan: '03', nama_kecamatan: 'Kedungkandang',
    kode_kelurahan_desa: '021', nama_kelurahan_desa: 'Buring',
    alamat_domisili: 'Desa Kedanyang',
    nomor_kk: '3516072300000007', nik_kepala_keluarga: '3578034502780020',
    jumlah_anggota_keluarga: 6, nama_kepala_keluarga: 'M. Nurul Huda', desil_kesejahteraan: 1,
    penerima_bantuan_iuran_nasional: 'YA', penerima_bantuan_iuran_pemda: 'TIDAK', id_pelanggan_pln: '51234567807',
    status_kepemilikan_rumah: 'Bebas Sewa (Warisan)', jenis_lantai: 'Tanah/Semen Kasar', luas_lantai: 25, jenis_dinding: 'Bambu/Bata Bolong', jenis_atap: 'Asbes',
    sumber_air_minum: 'Sumur Tidak Terlindung', sumber_penerangan: 'Listrik PLN Menumpang', daya_listrik: '450 VA', bahan_bakar_memasak: 'Kayu Bakar',
    fasilitas_bab: 'Sungai/Kebun', jenis_kloset: 'Tidak Ada', pembuangan_akhir_tinja: 'Lainnya',
    flag_kepemilikan_aset: 1, tabung_gas: 0, kulkas: 0, ac: 0, water_heater: 0, telepon_rumah: 0, tv: 0, emas: 0, komputer_laptop_tablet: 0, sepeda_motor: 0, sepeda: 1, mobil: 0, perahu: 0, kapal_motor: 0, smartphone: 0,
    lahan_lain: 0, rumah_lain: 0, jumlah_sapi: 0, jumlah_kerbau: 0, jumlah_kuda: 0, jumlah_babi: 0, jumlah_kambing_domba: 0
  },
  {
    id_keluarga: 'FAM-008',
    kode_provinsi: '35', nama_provinsi: 'Jawa Timur',
    kode_kabupaten_kota: '73', nama_kabupaten_kota: 'Malang',
    kode_kecamatan: '04', nama_kecamatan: 'Lowokwaru',
    kode_kelurahan_desa: '025', nama_kelurahan_desa: 'Tlogomas',
    alamat_domisili: 'Kawasan Bantaran Tlogomas',
    nomor_kk: '3573042300000008', nik_kepala_keluarga: '3578045603670023',
    jumlah_anggota_keluarga: 3, nama_kepala_keluarga: 'Lilik Handayani', desil_kesejahteraan: 2,
    penerima_bantuan_iuran_nasional: 'TIDAK', penerima_bantuan_iuran_pemda: 'YA', id_pelanggan_pln: '51234567808',
    status_kepemilikan_rumah: 'Sewa/Kontrak', jenis_lantai: 'Plesteran Semen', luas_lantai: 18, jenis_dinding: 'Tembok Setengah/Bambu', jenis_atap: 'Seng',
    sumber_air_minum: 'PDAM Publik', sumber_penerangan: 'Listrik PLN', daya_listrik: '450 VA', bahan_bakar_memasak: 'Gas LPG 3kg',
    fasilitas_bab: 'MCK Umum', jenis_kloset: 'Jongkok', pembuangan_akhir_tinja: 'Kolam/Sungai',
    flag_kepemilikan_aset: 1, tabung_gas: 1, kulkas: 0, ac: 0, water_heater: 0, telepon_rumah: 0, tv: 1, emas: 0, komputer_laptop_tablet: 0, sepeda_motor: 0, sepeda: 0, mobil: 0, perahu: 0, kapal_motor: 0, smartphone: 1,
    lahan_lain: 0, rumah_lain: 0, jumlah_sapi: 0, jumlah_kerbau: 0, jumlah_kuda: 0, jumlah_babi: 0, jumlah_kambing_domba: 0
  },
  {
    id_keluarga: 'FAM-009',
    kode_provinsi: '35', nama_provinsi: 'Jawa Timur',
    kode_kabupaten_kota: '73', nama_kabupaten_kota: 'Malang',
    kode_kecamatan: '01', nama_kecamatan: 'Blimbing',
    kode_kelurahan_desa: '003', nama_kelurahan_desa: 'Purwantoro',
    alamat_domisili: 'Kos Petak Tambaksari',
    nomor_kk: '3578052300000009', nik_kepala_keluarga: '3578015504550026',
    jumlah_anggota_keluarga: 4, nama_kepala_keluarga: 'Wahyu Pratama', desil_kesejahteraan: 3,
    penerima_bantuan_iuran_nasional: 'TIDAK', penerima_bantuan_iuran_pemda: 'TIDAK', id_pelanggan_pln: '51234567809',
    status_kepemilikan_rumah: 'Sewa/Kontrak', jenis_lantai: 'Keramik Kasar', luas_lantai: 9, jenis_dinding: 'Tembok', jenis_atap: 'Asbes',
    sumber_air_minum: 'Membeli Eceran', sumber_penerangan: 'Listrik PLN', daya_listrik: '900 VA (Token Bersama)', bahan_bakar_memasak: 'Gas LPG 3kg',
    fasilitas_bab: 'MCK Umum', jenis_kloset: 'Jongkok', pembuangan_akhir_tinja: 'Tangki Septik',
    flag_kepemilikan_aset: 1, tabung_gas: 1, kulkas: 0, ac: 0, water_heater: 0, telepon_rumah: 0, tv: 1, emas: 0, komputer_laptop_tablet: 0, sepeda_motor: 1, sepeda: 0, mobil: 0, perahu: 0, kapal_motor: 0, smartphone: 2,
    lahan_lain: 0, rumah_lain: 0, jumlah_sapi: 0, jumlah_kerbau: 0, jumlah_kuda: 0, jumlah_babi: 0, jumlah_kambing_domba: 0
  },
  {
    id_keluarga: 'FAM-010',
    kode_provinsi: '35', nama_provinsi: 'Jawa Timur',
    kode_kabupaten_kota: '73', nama_kabupaten_kota: 'Malang',
    kode_kecamatan: '04', nama_kecamatan: 'Lowokwaru',
    kode_kelurahan_desa: '027', nama_kelurahan_desa: 'Tulusrejo',
    alamat_domisili: 'Rusunawa Genteng Blok A',
    nomor_kk: '3578012300000010', nik_kepala_keluarga: '3578027708430030',
    jumlah_anggota_keluarga: 4, nama_kepala_keluarga: 'Sri Mulyani', desil_kesejahteraan: 2,
    penerima_bantuan_iuran_nasional: 'YA', penerima_bantuan_iuran_pemda: 'TIDAK', id_pelanggan_pln: '51234567810',
    status_kepemilikan_rumah: 'Sewa (Rusunawa)', jenis_lantai: 'Keramik', luas_lantai: 21, jenis_dinding: 'Tembok', jenis_atap: 'Beton',
    sumber_air_minum: 'PDAM', sumber_penerangan: 'Listrik PLN', daya_listrik: '900 VA', bahan_bakar_memasak: 'Gas LPG 3kg',
    fasilitas_bab: 'Milik Sendiri', jenis_kloset: 'Jongkok', pembuangan_akhir_tinja: 'Tangki Septik',
    flag_kepemilikan_aset: 1, tabung_gas: 1, kulkas: 0, ac: 0, water_heater: 0, telepon_rumah: 0, tv: 1, emas: 0, komputer_laptop_tablet: 0, sepeda_motor: 0, sepeda: 1, mobil: 0, perahu: 0, kapal_motor: 0, smartphone: 1,
    lahan_lain: 0, rumah_lain: 0, jumlah_sapi: 0, jumlah_kerbau: 0, jumlah_kuda: 0, jumlah_babi: 0, jumlah_kambing_domba: 0
  },
  {
    id_keluarga: 'FAM-011',
    kode_provinsi: '35', nama_provinsi: 'Jawa Timur',
    kode_kabupaten_kota: '73', nama_kabupaten_kota: 'Malang',
    kode_kecamatan: '05', nama_kecamatan: 'Sukun',
    kode_kelurahan_desa: '031', nama_kelurahan_desa: 'Sukun',
    alamat_domisili: 'Perum KPR BTN Gedangan',
    nomor_kk: '3515052300000011', nik_kepala_keluarga: '3578038809320033',
    jumlah_anggota_keluarga: 4, nama_kepala_keluarga: 'Joko Widodo', desil_kesejahteraan: 4,
    penerima_bantuan_iuran_nasional: 'TIDAK', penerima_bantuan_iuran_pemda: 'TIDAK', id_pelanggan_pln: '51234567811',
    status_kepemilikan_rumah: 'Milik Sendiri (KPR)', jenis_lantai: 'Keramik', luas_lantai: 36, jenis_dinding: 'Tembok', jenis_atap: 'Genteng',
    sumber_air_minum: 'PDAM', sumber_penerangan: 'Listrik PLN', daya_listrik: '1300 VA', bahan_bakar_memasak: 'Gas LPG 3kg',
    fasilitas_bab: 'Milik Sendiri', jenis_kloset: 'Leher Angsa', pembuangan_akhir_tinja: 'Tangki Septik',
    flag_kepemilikan_aset: 1, tabung_gas: 1, kulkas: 1, ac: 0, water_heater: 0, telepon_rumah: 0, tv: 1, emas: 0, komputer_laptop_tablet: 0, sepeda_motor: 1, sepeda: 0, mobil: 0, perahu: 0, kapal_motor: 0, smartphone: 2,
    lahan_lain: 0, rumah_lain: 0, jumlah_sapi: 0, jumlah_kerbau: 0, jumlah_kuda: 0, jumlah_babi: 0, jumlah_kambing_domba: 0
  },
  {
    id_keluarga: 'FAM-012',
    kode_provinsi: '35', nama_provinsi: 'Jawa Timur',
    kode_kabupaten_kota: '73', nama_kabupaten_kota: 'Malang',
    kode_kecamatan: '06', nama_kecamatan: 'Klojen',
    kode_kelurahan_desa: '040', nama_kelurahan_desa: 'Klojen',
    alamat_domisili: 'Gang Sempit Klojen Lama',
    nomor_kk: '3573062300000012', nik_kepala_keluarga: '3578049910210036',
    jumlah_anggota_keluarga: 3, nama_kepala_keluarga: 'Endang Susilowati', desil_kesejahteraan: 3,
    penerima_bantuan_iuran_nasional: 'TIDAK', penerima_bantuan_iuran_pemda: 'YA', id_pelanggan_pln: '51234567812',
    status_kepemilikan_rumah: 'Milik Sendiri (Warisan)', jenis_lantai: 'Tegel Lama', luas_lantai: 30, jenis_dinding: 'Tembok Tua', jenis_atap: 'Asbes',
    sumber_air_minum: 'Sumur Pompa', sumber_penerangan: 'Listrik PLN', daya_listrik: '900 VA', bahan_bakar_memasak: 'Gas LPG 3kg',
    fasilitas_bab: 'Milik Sendiri', jenis_kloset: 'Jongkok', pembuangan_akhir_tinja: 'Tangki Septik',
    flag_kepemilikan_aset: 1, tabung_gas: 1, kulkas: 0, ac: 0, water_heater: 0, telepon_rumah: 0, tv: 1, emas: 0, komputer_laptop_tablet: 0, sepeda_motor: 0, sepeda: 1, mobil: 0, perahu: 0, kapal_motor: 0, smartphone: 1,
    lahan_lain: 0, rumah_lain: 0, jumlah_sapi: 0, jumlah_kerbau: 0, jumlah_kuda: 0, jumlah_babi: 0, jumlah_kambing_domba: 0
  },
  {
    id_keluarga: 'FAM-013',
    kode_provinsi: '35', nama_provinsi: 'Jawa Timur',
    kode_kabupaten_kota: '73', nama_kabupaten_kota: 'Malang',
    kode_kecamatan: '06', nama_kecamatan: 'Klojen',
    kode_kelurahan_desa: '042', nama_kelurahan_desa: 'Kauman',
    alamat_domisili: 'Jl. Raya Katering Wonokromo',
    nomor_kk: '3578022300000013', nik_kepala_keluarga: '3578051112220038',
    jumlah_anggota_keluarga: 4, nama_kepala_keluarga: 'Ibu Supinah', desil_kesejahteraan: 4,
    penerima_bantuan_iuran_nasional: 'TIDAK', penerima_bantuan_iuran_pemda: 'TIDAK', id_pelanggan_pln: '51234567813',
    status_kepemilikan_rumah: 'Milik Sendiri', jenis_lantai: 'Keramik', luas_lantai: 45, jenis_dinding: 'Tembok', jenis_atap: 'Genteng',
    sumber_air_minum: 'PDAM', sumber_penerangan: 'Listrik PLN', daya_listrik: '1300 VA', bahan_bakar_memasak: 'Gas LPG 12kg',
    fasilitas_bab: 'Milik Sendiri', jenis_kloset: 'Leher Angsa', pembuangan_akhir_tinja: 'Tangki Septik',
    flag_kepemilikan_aset: 1, tabung_gas: 1, kulkas: 2, ac: 1, water_heater: 0, telepon_rumah: 0, tv: 1, emas: 1, komputer_laptop_tablet: 0, sepeda_motor: 2, sepeda: 0, mobil: 0, perahu: 0, kapal_motor: 0, smartphone: 2,
    lahan_lain: 0, rumah_lain: 0, jumlah_sapi: 0, jumlah_kerbau: 0, jumlah_kuda: 0, jumlah_babi: 0, jumlah_kambing_domba: 0
  }
];
