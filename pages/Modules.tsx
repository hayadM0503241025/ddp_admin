import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { 
  User as UserType, 
  CapaianData, 
  Beritaartikel as Artikel, 
  Monografi as MonografiType,
  Galeri as GaleriType,
  Testimoni as TestimoniType,
  Contact
} from '../services/types'; 

import { 
  Trash2, Edit2, Plus, Search, Check, X, Filter, ChevronDown, 
  MoreHorizontal, ChevronRight, ChevronLeft, Layout, ExternalLink,
  Database, BarChart3, Map, Home, Activity, Zap, Layers, PieChart, TrendingUp,
  Image as ImageIcon, Book, FileText, Camera, BookOpen, Bookmark, Globe, 
  ShieldCheck, MonitorPlay, Mail, MessageSquare,
  Users, User as UserIcon, Info, Calendar, GraduationCap
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
  type?: "button" | "submit";
  disabled?: boolean;
}> = ({ onClick, variant = 'primary', children, className = '', type = 'button', disabled = false }) => {
    const base = "px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 transform active:scale-95 disabled:opacity-50 shadow-lg";
    const styles = {
        primary: "bg-[#E3242B] text-white hover:bg-[#111827] shadow-red-900/20",
        secondary: "bg-white border border-gray-100 text-navy hover:bg-gray-50 shadow-sm",
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
                        <span className="text-[9px] font-black text-[#E3242B] uppercase tracking-[0.4em]">Input System</span>
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

// Helper URL Gambar
const getImg = (path: string) => {
    // SOP: Menyesuaikan alamat gambar agar muncul di lokal maupun Vercel via Ngrok
    // @ts-ignore
    const base = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000/api';
    const storageBase = base.replace('/api', '/storage');
    return `${storageBase}/${path}`;
};

// ==========================================
// --- 1. USER MANAGEMENT ---
// ==========================================
export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    useEffect(() => { load(); }, []);
    const load = async () => { setUsers(await apiService.getUsers()); };
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tighter">Manajemen User</h2>
            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-50">
                    <TableHeader><Th>User Info</Th><Th>Role</Th><Th>Status</Th><Th>Action</Th></TableHeader>
                    <tbody className="divide-y divide-gray-50">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-5">
                                    <div className="text-sm font-black text-[#111827] uppercase">{u.name}</div>
                                    <div className="text-[10px] font-bold text-gray-400">{u.email}</div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${u.role === 1 ? 'bg-red-50 text-[#E3242B] border-red-100' : 'bg-gray-50 text-gray-400'}`}>
                                        {u.role === 1 ? 'Super Admin' : 'Admin'}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <button onClick={async () => { await apiService.toggleApproval(u.id); load(); }} disabled={u.role === 1}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${u.is_approved ? 'bg-emerald-500 shadow-lg' : 'bg-gray-200'}`}>
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all ${u.is_approved ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </td>
                                <td className="px-6 py-5">
                                    {u.role !== 1 && <ActionButton onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('users', u.id); load(); } }} icon={Trash2} color="text-red-500" />}
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
// --- 2. CAPAIAN DATA ---
// ==========================================
export const CapaianModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({});
    useEffect(() => { load(); }, []);
    const load = async () => { setData(await apiService.getData('capaian')); };
    const handleSave = async (e: any) => {
        e.preventDefault();
        await apiService.saveData('capaian', formData);
        setIsModalOpen(false); load(); alert("Data Disinkronkan!");
    };
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end px-2">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Capaian Data</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">Official Statistics</p>
                </div>
                <Button onClick={() => {setFormData({}); setIsModalOpen(true)}}><Plus size={18} /> Update Data</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.map(item => (
                    <div key={item.id} className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm relative group hover:shadow-xl transition-all duration-500">
                        <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                            <ActionButton onClick={() => {setFormData(item); setIsModalOpen(true)}} icon={Edit2} color="text-blue-500" />
                            <ActionButton onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('capaian', item.id); load(); } }} icon={Trash2} color="text-red-500" />
                        </div>
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            {['desa', 'dusun', 'rw', 'kelurahan', 'bangunan', 'kk'].map(f => (
                                <div key={f} className="space-y-1">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{f}</p>
                                    <p className="text-lg font-black text-[#111827] uppercase tracking-tighter">{Number(item[f]).toLocaleString('id-ID')}</p>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4 pt-6 border-t border-gray-50">
                            <div className="flex justify-between items-end"><span className="text-[10px] font-black uppercase">Total Jiwa</span><span className="text-xl font-black text-[#E3242B]">{item.jiwa.toLocaleString('id-ID')}</span></div>
                            <div className="h-2.5 bg-gray-50 rounded-full overflow-hidden flex shadow-inner border border-gray-100">
                                <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ width: `${(item.laki/item.jiwa)*100}%` }}></div>
                                <div className="h-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]" style={{ width: `${(item.perempuan/item.jiwa)*100}%` }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Form Statistik">
                <form onSubmit={handleSave} className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {['desa', 'kelurahan', 'dusun', 'rw', 'bangunan', 'kk', 'jiwa', 'laki', 'perempuan'].map(f => (
                        <div key={f}>
                            <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">{f} *</label>
                            <input type="number" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-black text-navy" value={formData[f] || 0} onChange={e => setFormData({...formData, [f]: e.target.value})} required />
                        </div>
                    ))}
                    <Button type="submit" className="col-span-full py-5">Simpan Database</Button>
                </form>
            </Modal>
        </div>
    );
};

// ==========================================
// --- 3. WARTA & ARTIKEL ---
// ==========================================
export const ArtikelModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({ kategori: 'Berita' });
    const [preview, setPreview] = useState<string | null>(null);
    useEffect(() => { load(); }, []);
    const load = async () => { setData(await apiService.getData('beritaartikel')); };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center px-2">
                <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tighter">Warta & Artikel</h2>
                <Button onClick={() => { setFormData({ kategori: 'Berita' }); setPreview(null); setIsModalOpen(true); }}><Plus size={18} /> Tulis Berita</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {data.map((item, index) => (
                    <div key={item.id} className="bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm group relative overflow-hidden transition-all hover:shadow-xl">
                        {index < 3 && (
                            <div className="absolute top-0 right-0 z-20 bg-[#E3242B] text-white text-[7px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1 h-1 bg-white rounded-full animate-ping"></div> Live
                            </div>
                        )}
                        <div className="h-48 bg-gray-50 rounded-[2rem] mb-6 overflow-hidden border border-gray-50 shadow-inner">
                            <img src={getImg(item.gambar)} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
                        </div>
                        <div className="space-y-4 px-2">
                            <h3 className="font-black text-base text-[#111827] line-clamp-2 uppercase tracking-tighter leading-tight group-hover:text-[#E3242B] transition-colors">{item.judul_artikel}</h3>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                <span className="text-[8px] font-black text-red-500 uppercase bg-red-50 px-2 py-0.5 rounded">{item.kategori}</span>
                                <div className="flex gap-1">
                                    <ActionButton onClick={() => {setFormData(item); setIsModalOpen(true)}} icon={Edit2} color="text-blue-500" />
                                    <ActionButton onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('beritaartikel', item.id); load(); } }} icon={Trash2} color="text-red-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Form Artikel">
                <form onSubmit={async (e) => { e.preventDefault(); await apiService.saveData('beritaartikel', formData); setIsModalOpen(false); load(); }} className="space-y-6">
                    <input className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold" placeholder="Judul Artikel" value={formData.judul_artikel || ''} onChange={e => setFormData({...formData, judul_artikel: e.target.value})} required />
                    <div className="grid grid-cols-2 gap-4">
                        <select className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold" value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} required><option value="Berita">BERITA</option><option value="Artikel">ARTIKEL</option></select>
                        <input className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold" placeholder="Penulis" value={formData.penulis || ''} onChange={e => setFormData({...formData, penulis: e.target.value})} required />
                    </div>
                    <input type="date" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold" value={formData.tanggal || ''} onChange={e => setFormData({...formData, tanggal: e.target.value})} required />
                    <textarea className="w-full p-4 bg-gray-50 border-none rounded-2xl h-40 outline-none font-medium text-sm" placeholder="Konten Lengkap..." value={formData.isi_artikel || ''} onChange={e => setFormData({...formData, isi_artikel: e.target.value})} required />
                    <input type="file" className="w-full p-3 border-2 border-dashed rounded-2xl" onChange={e => {if(e.target.files){setFormData({...formData, gambar: e.target.files[0]}); setPreview(URL.createObjectURL(e.target.files[0]))}}} />
                    {preview && <img src={preview} className="h-32 mt-4 rounded-3xl border-4 border-white shadow-xl mx-auto" />}
                    <Button type="submit" className="w-full py-5">Terbitkan Sekarang</Button>
                </form>
            </Modal>
        </div>
    );
};

// ==========================================
// --- 4. MONOGRAFI DESA ---
// ==========================================
export const MonografiModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [preview, setPreview] = useState<string | null>(null);
    useEffect(() => { load(); }, []);
    const load = async () => { setData(await apiService.getData('monografi')); };
    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center px-2">
                <h2 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Monografi Desa</h2>
                <Button onClick={() => {setFormData({}); setPreview(null); setIsModalOpen(true)}}><Plus size={20} /> Tambah Katalog</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {data.map((item) => (
                    <div key={item.id} className="bg-white rounded-[3rem] border border-gray-100 p-5 shadow-sm group hover:shadow-2xl transition-all duration-700">
                        <div className="aspect-[3/4] bg-gray-50 rounded-[2.5rem] overflow-hidden mb-6 relative border border-gray-50">
                            <img src={getImg(item.gambar)} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[1500ms]" />
                            <div className="absolute inset-0 bg-[#111827]/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4 backdrop-blur-[2px]">
                                <ActionButton onClick={() => {setFormData(item); setIsModalOpen(true)}} icon={Edit2} color="text-blue-500" />
                                <ActionButton onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('monografi', item.id); load(); } }} icon={Trash2} color="text-red-500" />
                            </div>
                        </div>
                        <div className="space-y-4 px-2">
                            <h4 className="font-black text-sm text-navy uppercase tracking-tight line-clamp-1">Desa {item.desa}</h4>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <span className="text-[8px] font-black text-gray-300 uppercase">Featured Home</span>
                                <button onClick={async () => { await apiService.toggleMonografiFeatured(item.id); load(); }} 
                                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all ${item.is_featured ? 'bg-[#E3242B]' : 'bg-gray-200'}`}>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all ${item.is_featured ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Form Monografi">
                <form onSubmit={async (e) => { e.preventDefault(); await apiService.saveData('monografi', formData); setIsModalOpen(false); load(); }} className="space-y-6">
                    <div className="grid grid-cols-2 gap-5 bg-gray-50 p-10 rounded-[3.5rem]">
                        {['desa', 'kecamatan', 'kota', 'provinsi', 'tahun', 'link'].map(f => (
                            <div key={f}><label className="text-[9px] font-black text-gray-400 uppercase block mb-1">{f} *</label>
                            <input className="w-full p-4 bg-white border-none rounded-2xl outline-none font-bold text-sm" value={formData[f] || ''} onChange={e => setFormData({...formData, [f]: e.target.value})} required /></div>
                        ))}
                        <textarea className="col-span-full p-5 bg-white border-none rounded-[2rem] h-24 outline-none text-sm" placeholder="Ringkasan..." value={formData.ringkasan || ''} onChange={e => setFormData({...formData, ringkasan: e.target.value})} required />
                        <input type="file" className="col-span-full p-3 bg-white border-2 border-dashed rounded-2xl text-[9px]" onChange={e => {if(e.target.files){setFormData({...formData, gambar: e.target.files[0]}); setPreview(URL.createObjectURL(e.target.files[0]))}}} />
                        {preview && <img src={preview} className="col-span-full h-32 mt-4 rounded-2xl border-4 border-white shadow-lg mx-auto" />}
                    </div>
                    <Button type="submit" className="w-full py-5">Sync Katalog</Button>
                </form>
            </Modal>
        </div>
    );
};

// ==========================================
// --- 5. INFOGRAFIS MODULE ---
// ==========================================
export const InfografisModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({ judul: '', kategori: 'Analitik', gambar: [] });
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => { load(); }, []);
    const load = async () => { setData(await apiService.getData('infografis')); };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center px-2">
                <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tighter">Infografis & Visual</h2>
                <Button onClick={() => { setFormData({ judul: '', kategori: 'Analitik', gambar: [] }); setPreviews([]); setIsModalOpen(true); }}><Plus size={18} /> Unggah Baru</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {data.map(item => (
                    <div key={item.id} className={`group bg-white border-2 rounded-[2.5rem] p-6 transition-all duration-500 shadow-sm hover:shadow-2xl ${item.is_approved_home ? 'border-[#E3242B]' : 'border-gray-100'}`}>
                        <div className="aspect-[4/3] bg-gray-50 rounded-[2rem] mb-6 flex items-center justify-center overflow-hidden relative shadow-inner">
                            {item.gambar && item.gambar.length > 0 ? (
                                <img src={getImg(item.gambar[0])} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                            ) : <ImageIcon size={40} className="text-gray-200" />}
                            <div className="absolute top-4 right-4 bg-navy/80 text-white text-[8px] px-3 py-1 rounded-full font-black uppercase">{item.gambar?.length || 0} Slides</div>
                        </div>
                        <h4 className="font-black text-sm text-navy uppercase mb-4 line-clamp-1">{item.judul}</h4>
                        <button onClick={async () => { await apiService.toggleInfografisHome(item.id); load(); }} className={`w-full py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all ${item.is_approved_home ? 'bg-emerald-500 text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}>{item.is_approved_home ? 'Active on Home' : 'Set as Featured'}</button>
                        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-50">
                            <ActionButton onClick={() => {setFormData(item); setIsModalOpen(true)}} icon={Edit2} color="text-blue-500" />
                            <ActionButton onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('infografis', item.id); load(); } }} icon={Trash2} color="text-red-500" />
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Form Infografis">
                <form onSubmit={async (e) => { e.preventDefault(); await apiService.saveData('infografis', formData); setIsModalOpen(false); load(); }} className="space-y-6">
                    <div className="bg-gray-50 p-8 rounded-[3rem] space-y-4">
                        <input className="w-full p-4 bg-white border-none rounded-2xl outline-none font-bold" placeholder="Judul Album" value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})} required />
                        <textarea className="w-full p-4 bg-white border-none rounded-2xl h-24 outline-none font-medium text-sm" placeholder="Keterangan..." value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} />
                        <input type="file" multiple className="w-full p-4 bg-white border-2 border-dashed rounded-2xl text-[9px]" onChange={e => {if(e.target.files){const files = Array.from(e.target.files); setFormData({...formData, gambar: files}); setPreviews(files.map(f => URL.createObjectURL(f)))}}} />
                        <div className="grid grid-cols-5 gap-3">{previews.map((url, i) => <img key={i} src={url} className="aspect-square rounded-xl border-2 border-white shadow-sm object-cover" />)}</div>
                    </div>
                    <Button type="submit" className="w-full py-5">Upload Album</Button>
                </form>
            </Modal>
        </div>
    );
};

// ==========================================
// --- 6. GALERI KEGIATAN ---
// ==========================================
export const GaleriModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [preview, setPreview] = useState<string | null>(null);
    useEffect(() => { load(); }, []);
    const load = async () => { setData(await apiService.getData('galeri')); };
    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center px-2">
                <h2 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Galeri Bakti</h2>
                <Button onClick={() => {setFormData({}); setPreview(null); setIsModalOpen(true)}}><Plus size={18} /> Tambah Foto</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {data.map((item, index) => (
                    <div key={item.id} className="relative aspect-[4/5] bg-white rounded-[2.5rem] overflow-hidden shadow-sm group hover:shadow-xl transition-all duration-700">
                        {index < 11 && <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[7px] font-black px-3 py-1 rounded-full uppercase">Live</div>}
                        <img src={getImg(item.gambar)} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[2000ms]" />
                        <div className="absolute inset-0 bg-[#111827]/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4 backdrop-blur-[2px]">
                            <ActionButton onClick={() => {setFormData(item); setIsModalOpen(true)}} icon={Edit2} color="text-white" />
                            <ActionButton onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('galeri', item.id); load(); } }} icon={Trash2} color="text-red-400" />
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Galeri">
                <form onSubmit={async (e) => { e.preventDefault(); await apiService.saveData('galeri', formData); setIsModalOpen(false); load(); }} className="space-y-6">
                    <div className="bg-gray-50 p-8 rounded-[3rem] space-y-4">
                        <input className="w-full p-4 bg-white border-none rounded-2xl outline-none font-bold" placeholder="Nama Kegiatan" value={formData.nama_kegiatan || ''} onChange={e => setFormData({...formData, nama_kegiatan: e.target.value})} required />
                        <input type="date" className="w-full p-4 bg-white border-none rounded-2xl font-bold" value={formData.tanggal || ''} onChange={e => setFormData({...formData, tanggal: e.target.value})} required />
                        <textarea className="w-full p-4 bg-white border-none rounded-2xl h-24 outline-none font-medium text-sm" placeholder="Deskripsi..." value={formData.deskripsi || ''} onChange={e => setFormData({...formData, deskripsi: e.target.value})} required />
                        <input type="file" className="w-full p-4 bg-white border-2 border-dashed rounded-2xl" onChange={e => {if(e.target.files){setFormData({...formData, gambar: e.target.files[0]}); setPreview(URL.createObjectURL(e.target.files[0]))}}} />
                        {preview && <img src={preview} className="h-40 w-full object-cover rounded-3xl border-4 border-white shadow-xl" />}
                    </div>
                    <Button type="submit" className="w-full py-5">Upload Dokumentasi</Button>
                </form>
            </Modal>
        </div>
    );
};

// ==========================================
// --- 7. BUKU & JURNAL ---
// ==========================================
export const BukuModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [preview, setPreview] = useState<string | null>(null);
    useEffect(() => { load(); }, []);
    const load = async () => { const res = await apiService.getData('buku'); setData(res.data || res); };
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center px-2">
                <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tighter">Digital Bookshelf</h2>
                <Button onClick={() => {setFormData({}); setPreview(null); setIsModalOpen(true)}}><Plus size={18} /> Tambah Buku</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {data.map(item => (
                    <div key={item.id} className="bg-white rounded-[3rem] border border-gray-100 p-6 flex flex-col items-center group hover:shadow-xl transition-all">
                        <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden mb-6 relative border border-gray-50 shadow-inner bg-gray-50">
                            <img src={getImg(item.gambar)} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[2000ms]" />
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                <ActionButton onClick={() => {setFormData(item); setPreview(getImg(item.gambar)); setIsModalOpen(true)}} icon={Edit2} color="bg-white text-blue-500 shadow-xl" />
                            </div>
                        </div>
                        <h4 className="font-black text-xs uppercase text-center line-clamp-1">{item.judul}</h4>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Form Koleksi Buku">
                <form onSubmit={async (e) => { e.preventDefault(); await apiService.saveData('buku', formData); setIsModalOpen(false); load(); }} className="space-y-6">
                    <div className="bg-gray-50 p-8 rounded-[3rem] space-y-4">
                        <input className="w-full p-4 bg-white border-none rounded-2xl outline-none font-bold" placeholder="Judul Buku" value={formData.judul || ''} onChange={e => setFormData({...formData, judul: e.target.value})} required />
                        <input className="w-full p-4 bg-white border-none rounded-2xl outline-none font-bold" placeholder="Penulis" value={formData.penulis || ''} onChange={e => setFormData({...formData, penulis: e.target.value})} required />
                        <input className="w-full p-4 bg-white border-none rounded-2xl outline-none font-bold" placeholder="Link G-Drive" value={formData.link_drive || ''} onChange={e => setFormData({...formData, link_drive: e.target.value})} required />
                        <textarea className="w-full p-4 bg-white border-none rounded-2xl h-24 outline-none font-medium text-sm" placeholder="Abstrak..." value={formData.ringkasan || ''} onChange={e => setFormData({...formData, ringkasan: e.target.value})} required />
                        <input type="file" className="w-full p-4 bg-white border-2 border-dashed rounded-2xl" onChange={e => {if(e.target.files){setFormData({...formData, gambar: e.target.files[0]}); setPreview(URL.createObjectURL(e.target.files[0]))}}} />
                        {preview && <img src={preview} className="h-40 aspect-[3/4] object-cover rounded-2xl border-4 border-white shadow-xl mx-auto" />}
                    </div>
                    <Button type="submit" className="w-full py-5">Simpan Koleksi</Button>
                </form>
            </Modal>
        </div>
    );
};

export const JurnalModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [preview, setPreview] = useState<string | null>(null);
    useEffect(() => { load(); }, []);
    const load = async () => { const res = await apiService.getData('jurnal'); setData(res.data || res); };
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center px-2">
                <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tighter">Academic Journals</h2>
                <Button onClick={() => {setFormData({}); setPreview(null); setIsModalOpen(true)}}><Plus size={18} /> Tambah Jurnal</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {data.map(item => (
                    <div key={item.id} className="bg-white rounded-[2rem] border border-gray-100 p-6 flex gap-6 hover:shadow-xl transition-all relative group">
                        <div className="w-24 h-32 bg-gray-50 rounded-xl overflow-hidden shrink-0 border shadow-inner">
                            <img src={getImg(item.gambar)} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-between py-1">
                            <div><h4 className="font-black text-sm text-navy uppercase leading-tight line-clamp-2">{item.judul}</h4><p className="text-[10px] text-red-500 font-bold uppercase mt-2">{item.penulis}</p></div>
                            <div className="flex gap-2"><ActionButton onClick={() => {setFormData(item); setPreview(getImg(item.gambar)); setIsModalOpen(true)}} icon={Edit2} color="text-blue-500" /><ActionButton onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('jurnal', item.id); load(); } }} icon={Trash2} color="text-red-500" /></div>
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Jurnal Ilmiah">
                <form onSubmit={async (e) => { e.preventDefault(); await apiService.saveData('jurnal', formData); setIsModalOpen(false); load(); }} className="space-y-6">
                    <div className="bg-gray-50 p-8 rounded-[3rem] space-y-4">
                        <input className="w-full p-4 bg-white border-none rounded-2xl outline-none font-bold" placeholder="Judul Jurnal" value={formData.judul || ''} onChange={e => setFormData({...formData, judul: e.target.value})} required />
                        <input className="w-full p-4 bg-white border-none rounded-2xl outline-none font-bold" placeholder="Penulis" value={formData.penulis || ''} onChange={e => setFormData({...formData, penulis: e.target.value})} required />
                        <input className="w-full p-4 bg-white border-none rounded-2xl outline-none font-bold" placeholder="URL Publikasi" value={formData.link || ''} onChange={e => setFormData({...formData, link: e.target.value})} required />
                        <input type="file" className="w-full p-4 bg-white border-2 border-dashed rounded-2xl" onChange={e => {if(e.target.files){setFormData({...formData, gambar: e.target.files[0]}); setPreview(URL.createObjectURL(e.target.files[0]))}}} />
                        {preview && <img src={preview} className="h-40 aspect-[3/4] object-cover rounded-2xl border-4 border-white shadow-xl mx-auto" />}
                    </div>
                    <Button type="submit" className="w-full py-5">Publish Jurnal</Button>
                </form>
            </Modal>
        </div>
    );
};

// ==========================================
// --- 8. MITRA STRATEGIS ---
// ==========================================
export const MitraModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({ kategori: 'pemerintah' });
    const [preview, setPreview] = useState<string | null>(null);
    useEffect(() => { load(); }, []);
    const load = async () => { setData(await apiService.getData('mitra')); };
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
                <div><h2 className="text-2xl font-black text-[#111827] uppercase tracking-tighter">Mitra Kerja Sama</h2><p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Kolaborasi Lintas Sektor</p></div>
                <Button onClick={() => {setFormData({ kategori: 'pemerintah' }); setPreview(null); setIsModalOpen(true)}}><Plus size={18} /> Tambah Mitra</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                {data.map(item => (
                    <div key={item.id} className="bg-white border p-8 rounded-[2.5rem] flex flex-col items-center group relative hover:shadow-xl transition-all">
                        <img src={getImg(item.gambar)} className="h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-700" />
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => {setFormData(item); setPreview(getImg(item.gambar)); setIsModalOpen(true)}} className="p-1.5 bg-blue-50 text-blue-500 rounded-lg"><Edit2 size={12}/></button>
                            <button onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('mitra', item.id); load(); } }} className="p-1.5 bg-red-50 text-red-500 rounded-lg"><Trash2 size={12}/></button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Partner">
                <form onSubmit={async (e) => { e.preventDefault(); await apiService.saveData('mitra', formData); setIsModalOpen(false); load(); }} className="space-y-6">
                    <div className="bg-gray-50 p-8 rounded-[3rem] space-y-4">
                        <input className="w-full p-4 bg-white border-none rounded-2xl outline-none font-bold" placeholder="Nama Instansi" value={formData.nama_mitra || ''} onChange={e => setFormData({...formData, nama_mitra: e.target.value})} required />
                        <select className="w-full p-4 bg-white border-none rounded-2xl outline-none font-bold" value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})}>
                            <option value="pemerintah">PEMERINTAH</option><option value="akademisi">AKADEMISI</option><option value="lembaga">LEMBAGA</option>
                        </select>
                        <input type="file" className="w-full p-4 bg-white border-2 border-dashed rounded-2xl" onChange={e => {if(e.target.files){setFormData({...formData, gambar: e.target.files[0]}); setPreview(URL.createObjectURL(e.target.files[0]))}}} />
                        {preview && <img src={preview} className="h-20 object-contain mx-auto border rounded-xl p-2" />}
                    </div>
                    <Button type="submit" className="w-full py-5">Simpan Mitra</Button>
                </form>
            </Modal>
        </div>
    );
};

// ==========================================
// --- 9. TESTIMONI TOKOH ---
// ==========================================
export const TestimoniModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [preview, setPreview] = useState<string | null>(null);
    useEffect(() => { load(); }, []);
    const load = async () => { setData(await apiService.getData('testimoni')); };
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center px-2">
                <div><h2 className="text-2xl font-black text-[#111827] uppercase tracking-tighter">Testimoni Tokoh</h2><p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Public Appreciation Center</p></div>
                <Button onClick={() => {setFormData({}); setPreview(null); setIsModalOpen(true)}}><Plus size={18} /> Tambah Testi</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.map(item => (
                    <div key={item.id} className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm relative group hover:shadow-xl transition-all duration-700">
                        <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <ActionButton onClick={() => {setFormData(item); setPreview(getImg(item.gambar)); setIsModalOpen(true)}} icon={Edit2} color="text-blue-500" />
                            <ActionButton onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('testimoni', item.id); load(); } }} icon={Trash2} color="text-red-500" />
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-10 italic">"{item.isi}"</p>
                        <div className="flex items-center gap-5 pt-8 border-t border-gray-50">
                            <img src={getImg(item.gambar)} className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-white" />
                            <div className="flex-1 overflow-hidden">
                                <h4 className="font-black text-sm text-navy uppercase truncate">{item.nama}</h4>
                                <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mt-1">{item.jabatan}</p>
                            </div>
                            <button onClick={async () => { await apiService.toggleTestimoniTampil(item.id); load(); }} 
                                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all ${item.is_tampil ? 'bg-[#E3242B] shadow-lg shadow-red-200' : 'bg-gray-200'}`}>
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-all ${item.is_tampil ? 'translate-x-7' : 'translate-x-2'}`} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Input Testimoni">
                <form onSubmit={async (e) => { e.preventDefault(); await apiService.saveData('testimoni', formData); setIsModalOpen(false); load(); }} className="space-y-6">
                    <div className="bg-gray-50 p-10 rounded-[3.5rem] space-y-4">
                        <input className="w-full p-4 bg-white border-none rounded-2xl outline-none font-bold" placeholder="Nama Lengkap" value={formData.nama || ''} onChange={e => setFormData({...formData, nama: e.target.value})} required />
                        <input className="w-full p-4 bg-white border-none rounded-2xl outline-none font-bold" placeholder="Jabatan/Institusi" value={formData.jabatan || ''} onChange={e => setFormData({...formData, jabatan: e.target.value})} required />
                        <input type="date" className="w-full p-4 bg-white border-none rounded-2xl font-bold text-sm text-gray-500" value={formData.tanggal || ''} onChange={e => setFormData({...formData, tanggal: e.target.value})} required />
                        <textarea className="w-full p-4 bg-white border-none rounded-2xl h-32 outline-none text-sm font-medium resize-none" placeholder="Narasi kutipan testimoni..." value={formData.isi || ''} onChange={e => setFormData({...formData, isi: e.target.value})} required />
                        <input type="file" className="w-full p-4 bg-white border-2 border-dashed rounded-2xl" onChange={e => {if(e.target.files){setFormData({...formData, gambar: e.target.files[0]}); setPreview(URL.createObjectURL(e.target.files[0]))}}} />
                        {preview && <img src={preview} className="h-32 w-32 object-cover rounded-3xl border-4 border-white shadow-xl mx-auto" />}
                    </div>
                    <Button type="submit" className="w-full py-5 font-black uppercase tracking-widest">Update Suara Tokoh</Button>
                </form>
            </Modal>
        </div>
    );
};

// ==========================================
// --- 10. PESAN MASUK ---
// ==========================================
export const PesanKontakModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => { load(); }, []);
    const load = async () => { try { const res = await apiService.getData('contacts'); setData(res); } finally { setLoading(false); } };
    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tighter">Kotak Masuk (Inbox)</h2>
            <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-50">
                    <TableHeader><Th>Pengirim</Th><Th>Narasi Pesan</Th><Th>Tanggal</Th><Th>Aksi</Th></TableHeader>
                    <tbody className="divide-y divide-gray-50">
                        {data.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-all">
                                <td className="px-6 py-8"><div className="text-sm font-black uppercase text-[#111827]">{item.nama_lengkap}</div><div className="text-[10px] text-blue-500 font-bold tracking-wider uppercase">{item.email}</div></td>
                                <td className="px-6 py-8"><div className="text-[10px] font-black text-red-500 uppercase mb-2">{item.subjek}</div><p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2 max-w-sm">{item.pesan}</p></td>
                                <td className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase">{item.created_at?.split('T')[0]}</td>
                                <td className="px-6 py-8"><ActionButton icon={Trash2} color="text-red-500" onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('contacts', item.id); load(); } }} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && data.length === 0 && <div className="py-32 text-center opacity-30 uppercase font-black text-[10px] tracking-widest">Inbox Kosong</div>}
            </div>
        </div>
    );
};