// ==========================================
// --- MASTER TYPES DATA DESA PRESISI (DDP) ---
// ==========================================

export enum UserRole {
    SUPER_ADMIN = 1,
    ADMIN = 2,
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: number; // Menggunakan 'role' sesuai temuan di Tinker tadi
    is_approved: boolean; // Laravel Casts merubah 0/1 menjadi true/false
    created_at?: string;
}

export interface CapaianData {
    id: number;
    desa: number; // Dirubah ke number agar bisa dijumlahkan (SUM)
    kelurahan: number;
    dusun: number;
    rw: number;
    bangunan: number;
    kk: number;
    jiwa: number;
    laki: number;
    perempuan: number;
    created_at?: string;
}

export interface Beritaartikel {
    id: number;
    judul_artikel: string;
    kategori: 'Berita' | 'Artikel'; // Sinkron dengan kolom enum di database
    penulis: string;
    tanggal: string;
    isi_artikel: string;
    gambar: string;
}

export interface Monografi {
    id: number;
    desa: string;
    kecamatan: string;
    kota: string;
    provinsi: string;
    tahun: string;
    ringkasan: string;
    gambar: string;
    link: string;
    is_featured: boolean;
}

export interface Infografis {
    id: number;
    judul: string;
    keterangan: string;
    gambar: string[]; // Mendukung Multiple Upload (Array)
    link: string;
    is_approved_home: boolean;
}

export interface Galeri {
    id: number;
    nama_kegiatan: string;
    tanggal: string;
    deskripsi: string;
    gambar: string;
}

export interface Buku {
    id: number;
    judul: string;
    penulis: string;
    ringkasan: string;
    link_drive: string;
    gambar: string;
}

export interface Jurnal {
    id: number;
    judul: string;
    penulis: string;
    link: string;
    gambar: string;
}

export interface Mitra {
    id: number;
    nama_mitra: string;
    kategori: 'pemerintah' | 'akademisi' | 'lembaga';
    gambar: string;
}

export interface Testimoni {
    id: number;
    nama: string;
    jabatan: string;
    tanggal: string;
    isi: string;
    gambar: string;
    is_tampil: boolean;
}

export interface Contact {
    id: number;
    nama_lengkap: string;
    email: string;
    subjek: string;
    pesan: string;
    created_at: string;
}

export interface DashboardStats {
    totalDesa: number;
    totalBerita: number;
    totalUser: number;
    totalTestimoni: number;
    totalGaleri: number;
    totalMitra: number;
    totalMonografi: number;
    totalInfografis: number;
}