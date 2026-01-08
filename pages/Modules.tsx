import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { 
  User as UserType, 
  CapaianData, 
  Beritaartikel as Artikel, 
  Monografi as MonografiType,
  Galeri as GaleriType,
  Testimoni as TestimoniType
} from '../services/types'; 

import { 
  Trash2, Edit2, Plus, Search, Check, X, Filter, ChevronDown, 
  MoreHorizontal, ChevronRight, ChevronLeft, Layout, ExternalLink,
  Database, BarChart3, Map, Home, Activity, Zap, Layers, PieChart, TrendingUp,
  Image as ImageIcon, Book, FileText, Camera, BookOpen, Bookmark, Globe, 
  ShieldCheck, MonitorPlay, Mail, MessageSquare,
  Users, User as UserIcon, Venus, Mars, Info, Calendar, GraduationCap
} from 'lucide-react';

// ==========================================
// --- SHARED UI COMPONENTS (STANDAR DDP) ---
// ==========================================

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-gray-50 border-b border-gray-100">
    <tr>{children}</tr>
  </thead>
);

const Th: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
    {children}
  </th>
);

const Button: React.FC<{ 
  onClick?: (e: any) => void; 
  variant?: 'primary' | 'secondary' | 'danger'; 
  children: React.ReactNode; 
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}> = ({ onClick, variant = 'primary', children, className = '', type = 'button', disabled = false }) => {
    const base = "px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 transform active:scale-95 disabled:opacity-50 shadow-lg";
    const styles = {
        primary: "bg-[#E3242B] text-white hover:bg-[#111827] shadow-red-900/20",
        secondary: "bg-white border border-gray-100 text-[#111827] hover:bg-gray-50 shadow-sm",
        danger: "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 shadow-none"
    };
    return (
      <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>
        {children}
      </button>
    );
};

const Modal = ({ isOpen, onClose, title, children }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#111827]/80 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
            <div className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center p-8 border-b border-gray-50 sticky top-0 bg-white/90 backdrop-blur-md z-10">
                    <div className="space-y-1">
                        <span className="text-[9px] font-black text-[#E3242B] uppercase tracking-[0.4em]">Formulir Input</span>
                        <h3 className="text-xl font-black text-[#111827] uppercase tracking-tighter">{title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-10 overflow-y-auto max-h-[calc(90vh-100px)] custom-scrollbar">{children}</div>
            </div>
        </div>
    );
};

const ActionButton = ({ onClick, icon: Icon, color }: any) => (
    <button onClick={onClick} className={`p-2.5 rounded-xl hover:bg-gray-100 transition-all transform hover:-translate-y-0.5 ${color}`}>
        <Icon size={18} />
    </button>
);

// ==========================================
// --- 1. MODULE: USER MANAGEMENT (ACC) ---
// ==========================================

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => { loadUsers(); }, []);
    const loadUsers = async () => { 
        const res = await apiService.getUsers();
        setUsers(res); 
    };

    const toggleStatus = async (id: number) => {
        await apiService.toggleApproval(id);
        loadUsers();
    };

    const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end px-2 gap-6">
                <div>
                    <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tighter">Manajemen Pengguna</h2>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Otoritas Akses Dashboard</p>
                </div>
                <div className="relative w-full md:w-72 group">
                    <Search className="absolute left-4 top-3.5 text-gray-300 group-focus-within:text-[#E3242B] transition-colors" size={18} />
                    <input type="text" placeholder="CARI NAMA USER..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-red-50 font-bold text-[10px] tracking-widest shadow-sm" />
                </div>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-50">
                    <TableHeader><Th>Nama & Alamat Email</Th><Th>Jabatan / Role</Th><Th>Status Akses</Th><Th>Tindakan</Th></TableHeader>
                    <tbody className="divide-y divide-gray-50">
                        {filtered.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-5">
                                    <div className="text-sm font-black text-[#111827] uppercase">{user.name}</div>
                                    <div className="text-[10px] font-bold text-gray-400 tracking-wider">{user.email}</div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${user.role === 1 ? 'bg-red-50 text-[#E3242B] border-red-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                        {user.role === 1 ? 'Super Admin' : 'Admin'}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <button onClick={() => toggleStatus(user.id)} disabled={user.role === 1}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${user.is_approved ? 'bg-emerald-500 shadow-lg shadow-emerald-900/20' : 'bg-gray-200'}`}>
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.is_approved ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </td>
                                <td className="px-6 py-5">
                                    {user.role !== 1 && <ActionButton onClick={async () => { if(window.confirm('Hapus akses user ini?')) { await apiService.deleteData('users', user.id); loadUsers(); } }} icon={Trash2} color="text-red-500" />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ==========================================
// --- 2. MODULE: CAPAIAN DATA DESA ---
// ==========================================

export const CapaianModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => { loadData(); }, []);
    const loadData = async () => { setData(await apiService.getData('capaian')); };

    const calculateTotal = (field: string) => {
        return data.reduce((sum, item) => sum + (Number(item[field]) || 0), 0);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiService.saveData('capaian', formData);
            setIsModalOpen(false);
            loadData();
            alert("Sinkronisasi Berhasil!");
        } catch (error) { alert("Gagal!"); } finally { setLoading(false); }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end px-2">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Capaian Pendataan</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">Accumulated Statistical Records</p>
                </div>
                <Button onClick={() => { setFormData({}); setIsModalOpen(true); }}><Plus size={18} /> Update Statistik</Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: 'Desa', value: calculateTotal('desa'), icon: Map, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Bangunan', value: calculateTotal('bangunan'), icon: Home, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'Jiwa', value: calculateTotal('jiwa'), icon: Users, color: 'text-[#E3242B]', bg: 'bg-red-50' },
                    { label: 'Keluarga', value: calculateTotal('kk'), icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex items-center gap-5">
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner`}><stat.icon size={24} /></div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                            <h3 className="text-xl font-black text-[#111827] tracking-tight">{stat.value.toLocaleString('id-ID')}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.map((item) => (
                    <div key={item.id} className="bg-white rounded-[3rem] border border-gray-100 p-8 hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-4">
                                <div className="bg-[#111827] text-white p-3 rounded-2xl"><Map size={20} /></div>
                                <div><h4 className="font-black text-[#111827] uppercase">Input Record</h4><p className="text-[10px] font-bold text-gray-400 uppercase">{item.created_at?.split('T')[0]}</p></div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <ActionButton onClick={() => {setFormData(item); setIsModalOpen(true)}} icon={Edit2} color="text-blue-500" />
                                <ActionButton onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('capaian', item.id); loadData(); } }} icon={Trash2} color="text-red-500" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 border-y border-gray-50 py-6 mb-6">
                            {['desa', 'dusun', 'kelurahan', 'rw', 'bangunan', 'kk'].map(f => (
                                <div key={f}><p className="text-[8px] font-black text-gray-400 uppercase">{f}</p><p className="text-sm font-black text-[#111827]">{Number(item[f]).toLocaleString('id-ID')}</p></div>
                            ))}
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end text-[10px] font-black uppercase"><p>Total Jiwa</p><p className="text-[#E3242B]">{item.jiwa.toLocaleString('id-ID')}</p></div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
                                <div className="h-full bg-blue-500" style={{ width: `${(item.laki/item.jiwa)*100}%` }}></div>
                                <div className="h-full bg-pink-500" style={{ width: `${(item.perempuan/item.jiwa)*100}%` }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Statistik">
                <form onSubmit={handleSave} className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {['desa', 'kelurahan', 'dusun', 'rw', 'bangunan', 'kk', 'jiwa', 'laki', 'perempuan'].map(f => (
                        <div key={f}>
                            <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">{f} *</label>
                            <input type="number" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black text-navy outline-none focus:ring-2 focus:ring-red-100" value={formData[f] || 0} onChange={e => setFormData({...formData, [f]: Number(e.target.value)})} required />
                        </div>
                    ))}
                    <div className="col-span-full pt-4"><Button type="submit" disabled={loading} className="w-full py-5">{loading ? "Syncing..." : "Simpan Data Statistik"}</Button></div>
                </form>
            </Modal>
        </div>
    );
};

// ==========================================
// --- 3. MODULE: ARTIKEL & BERITA ---
// ==========================================

export const ArtikelModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({ kategori: 'Berita' });
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { load(); }, []);
    const load = async () => { setData(await apiService.getData('beritaartikel')); };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiService.saveData('beritaartikel', formData);
            setIsModalOpen(false);
            setFormData({ kategori: 'Berita' });
            setPreview(null);
            load();
            alert("Konten Dipublikasi!");
        } catch (error) { alert("Gagal!"); } finally { setLoading(false); }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center px-2">
                <div><h2 className="text-2xl font-black text-[#111827] uppercase tracking-tighter">Warta & Artikel</h2><p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Publikasi Konten Media Center</p></div>
                <Button onClick={() => { setFormData({ kategori: 'Berita' }); setPreview(null); setIsModalOpen(true); }}><Plus size={18} /> Berita Baru</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {data.map((item, index) => (
                    <div key={item.id} className="bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-sm group relative overflow-hidden">
                        {index < 3 && (
                            <div className="absolute top-0 right-0 z-20 bg-[#E3242B] text-white text-[7px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1 h-1 bg-white rounded-full animate-ping"></div> Live on Index
                            </div>
                        )}
                        <div className="h-48 bg-gray-50 rounded-[2rem] mb-6 overflow-hidden relative border border-gray-50">
                            <img src={`http://localhost:8000/storage/${item.gambar}`} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="Cover" />
                            <div className="absolute bottom-4 left-6"><span className="bg-white/90 backdrop-blur-md text-navy text-[8px] font-black px-4 py-1.5 rounded-full uppercase shadow-sm">{item.kategori}</span></div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-black text-base text-[#111827] line-clamp-2 uppercase tracking-tighter leading-tight group-hover:text-[#E3242B] transition-colors">{item.judul_artikel}</h3>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.tanggal}</p>
                                <div className="flex gap-2">
                                    <ActionButton onClick={() => {setFormData(item); setIsModalOpen(true)}} icon={Edit2} color="text-blue-500" />
                                    <ActionButton onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('beritaartikel', item.id); load(); } }} icon={Trash2} color="text-red-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Form Artikel">
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-4 bg-gray-50 p-8 rounded-[2.5rem] shadow-inner">
                        <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Judul Utama *</label>
                        <input className="w-full p-4 bg-white border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold" value={formData.judul_artikel || ''} onChange={e => setFormData({...formData, judul_artikel: e.target.value})} required /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-2 px-1">Kategori *</label>
                            <select className="w-full p-4 bg-white border-none rounded-2xl outline-none font-bold text-sm" value={formData.kategori || 'Berita'} onChange={e => setFormData({...formData, kategori: e.target.value})} required><option value="Berita">BERITA</option><option value="Artikel">ARTIKEL</option></select></div>
                            <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-2 px-1">Penulis *</label>
                            <input className="w-full p-4 bg-white border-none rounded-2xl outline-none font-bold text-sm" value={formData.penulis || ''} onChange={e => setFormData({...formData, penulis: e.target.value})} required /></div>
                        </div>
                        <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-2 px-1">Tanggal *</label>
                        <input type="date" className="w-full p-4 bg-white border-none rounded-2xl font-bold text-sm" value={formData.tanggal || ''} onChange={e => setFormData({...formData, tanggal: e.target.value})} required /></div>
                        <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-2 px-1">Isi Narasi *</label>
                        <textarea className="w-full p-4 bg-white border-none rounded-2xl h-40 outline-none font-medium text-sm resize-none" value={formData.isi_artikel || ''} onChange={e => setFormData({...formData, isi_artikel: e.target.value})} required /></div>
                        <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-2 px-1">Upload Gambar Sampul *</label>
                        <input type="file" className="w-full p-3 bg-white border-2 border-dashed border-gray-100 rounded-2xl text-[10px]" onChange={e => {if(e.target.files){setFormData({...formData, gambar: e.target.files[0]}); setPreview(URL.createObjectURL(e.target.files[0]))}}} required={!formData.id} />
                        {preview && <img src={preview} className="h-24 w-full object-cover mt-4 rounded-2xl border-4 border-white shadow-md" />}</div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full py-5">{loading ? "Processing..." : "Terbitkan Sekarang"}</Button>
                </form>
            </Modal>
        </div>
    );
};

// ==========================================
// --- 4. MODULE: MONOGRAFI DESA ---
// ==========================================

export const MonografiModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { load(); }, []);
    const load = async () => { setData(await apiService.getData('monografi')); };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiService.saveData('monografi', formData);
            setIsModalOpen(false); load(); alert("Katalog Diperbarui!");
        } catch (error) { alert("Gagal!"); } finally { setLoading(false); }
    };

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center px-2">
                <div><h2 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Monografi Desa</h2><p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Digital Book Repository</p></div>
                <Button onClick={() => {setFormData({}); setPreview(null); setIsModalOpen(true)}}><Plus size={20} /> Tambah Katalog</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {data.map((item) => (
                    <div key={item.id} className="bg-white rounded-[3rem] border border-gray-100 p-5 shadow-sm group hover:shadow-2xl transition-all duration-700">
                        <div className="aspect-[3/4] bg-gray-50 rounded-[2.5rem] overflow-hidden mb-6 relative border border-gray-50">
                            <img src={`http://localhost:8000/storage/${item.gambar}`} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[1500ms]" />
                            <div className="absolute inset-0 bg-[#111827]/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4 backdrop-blur-[2px]">
                                <ActionButton onClick={() => {setFormData(item); setPreview(`http://localhost:8000/storage/${item.gambar}`); setIsModalOpen(true)}} icon={Edit2} color="text-blue-500" />
                                <ActionButton onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('monografi', item.id); load(); } }} icon={Trash2} color="text-red-500" />
                            </div>
                        </div>
                        <div className="space-y-4 px-2">
                            <div>
                                <span className="text-[9px] font-black text-[#E3242B] uppercase bg-red-50 px-2 py-0.5 rounded">Tahun {item.tahun}</span>
                                <h4 className="font-black text-sm text-navy uppercase tracking-tight mt-1 line-clamp-1">Desa {item.desa}</h4>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest truncate">{item.kecamatan}, {item.kota}</p>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Featured Home</span>
                                <button onClick={async () => { await apiService.toggleMonografiFeatured(item.id); load(); }} 
                                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all ${item.is_featured ? 'bg-[#E3242B]' : 'bg-gray-200'}`}>
                                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-all ${item.is_featured ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Form Monografi">
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-2 gap-5 bg-gray-50 p-8 rounded-[3rem]">
                        {['desa', 'kecamatan', 'kota', 'provinsi', 'tahun', 'link'].map(f => (
                            <div key={f}><label className="text-[9px] font-black text-gray-400 uppercase block mb-1">{f} *</label>
                            <input className="w-full p-4 bg-white border-none rounded-2xl outline-none font-bold text-sm" value={formData[f] || ''} onChange={e => setFormData({...formData, [f]: e.target.value})} required /></div>
                        ))}
                        <div className="col-span-full"><label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Ringkasan Profil *</label>
                        <textarea className="w-full p-4 bg-white border-none rounded-2xl h-24 outline-none text-sm resize-none" value={formData.ringkasan || ''} onChange={e => setFormData({...formData, ringkasan: e.target.value})} required /></div>
                        <div className="col-span-full"><label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Upload Sampul *</label>
                        <input type="file" className="w-full p-3 bg-white border-2 border-dashed border-gray-100 rounded-2xl text-[9px]" onChange={e => {if(e.target.files){setFormData({...formData, gambar: e.target.files[0]}); setPreview(URL.createObjectURL(e.target.files[0]))}}} required={!formData.id} />
                        {preview && <img src={preview} className="h-32 mt-4 rounded-2xl border-4 border-white shadow-lg mx-auto" />}</div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full py-5">{loading ? "Updating Archive..." : "Simpan Katalog"}</Button>
                </form>
            </Modal>
        </div>
    );
};

// ==========================================
// --- 5. MODULE: PESAN MASUK (KONTAK) ---
// ==========================================

export const PesanKontakModule: React.FC = () => {
    const [pesan, setPesan] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadPesan(); }, []);
    const loadPesan = async () => {
        try {
            const data = await apiService.getData('contacts');
            setPesan(data);
        } finally { setLoading(false); }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end px-2">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tighter">Kotak Masuk</h2>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Mail size={14} className="text-[#E3242B]" /> Hubungi Kami Messages
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-20 text-center text-gray-300 font-black uppercase tracking-[0.5em]">Checking Inbox...</div>
                ) : pesan.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-50">
                            <TableHeader><Th>Pengirim</Th><Th>Perihal / Subjek</Th><Th>Pesan Naratif</Th><Th>Waktu</Th><Th>Aksi</Th></TableHeader>
                            <tbody className="divide-y divide-gray-50">
                                {pesan.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-all">
                                        <td className="px-6 py-6">
                                            <div className="text-sm font-black text-[#111827] uppercase">{item.nama_lengkap}</div>
                                            <div className="text-[10px] font-bold text-blue-600 tracking-wider flex items-center gap-1"><Mail size={10} /> {item.email}</div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="bg-[#E3242B]/5 border border-red-100 text-[#E3242B] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-block">{item.subjek}</div>
                                        </td>
                                        <td className="px-6 py-6 max-w-xs">
                                            <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">{item.pesan}</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="text-[10px] font-black text-gray-400 uppercase">{item.created_at?.split('T')[0]}</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <ActionButton onClick={async () => { if(window.confirm('Hapus pesan?')){ await apiService.deleteData('contacts', item.id); loadPesan(); } }} icon={Trash2} color="text-red-400" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-32 text-center opacity-30 flex flex-col items-center gap-4">
                        <MessageSquare size={64} />
                        <p className="font-black uppercase tracking-[0.4em] text-xs">Belum ada pesan masuk</p>
                    </div>
                )}
            </div>
        </div>
    );
};