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
  Users, User as UserIcon, Info, Calendar, GraduationCap
} from 'lucide-react';

// ==========================================
// --- SHARED UI COMPONENTS (STANDAR DDP) ---
// ==========================================
const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-gray-50 border-b border-gray-100"><tr>{children}</tr></thead>
);
const Th: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{children}</th>
);
const Button: React.FC<{ onClick?: (e: any) => void; variant?: 'primary' | 'secondary' | 'danger'; children: React.ReactNode; className?: string; type?: "button" | "submit"; disabled?: boolean; }> = ({ onClick, variant = 'primary', children, className = '', type = 'button', disabled = false }) => {
    const base = "px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 transform active:scale-95 disabled:opacity-50 shadow-lg";
    const styles = { primary: "bg-[#E3242B] text-white hover:bg-[#111827]", secondary: "bg-white border border-gray-100 text-navy", danger: "bg-red-50 text-red-600" };
    return <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>{children}</button>;
};
const Modal = ({ isOpen, onClose, title, children }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#111827]/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white/20">
                <div className="flex justify-between items-center p-8 border-b border-gray-50 sticky top-0 bg-white/90 backdrop-blur-md z-10">
                    <h3 className="text-xl font-black text-[#111827] uppercase tracking-tighter">{title}</h3>
                    <button onClick={onClose} className="p-2 text-gray-400"><X size={24} /></button>
                </div>
                <div className="p-10 overflow-y-auto max-h-[calc(90vh-100px)] custom-scrollbar">{children}</div>
            </div>
        </div>
    );
};
const ActionButton = ({ onClick, icon: Icon, color }: any) => (
    <button onClick={onClick} className={`p-2.5 rounded-xl hover:bg-gray-100 transition-all ${color}`}><Icon size={18} /></button>
);

// ==========================================
// --- 1. USER MANAGEMENT ---
// ==========================================
export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    useEffect(() => { load(); }, []);
    const load = async () => { setUsers(await apiService.getUsers()); };
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-[#111827] uppercase">User Management</h2>
            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-50">
                    <TableHeader><Th>User</Th><Th>Role</Th><Th>Status</Th><Th>Action</Th></TableHeader>
                    <tbody className="divide-y divide-gray-50">
                        {users.map(u => (
                            <tr key={u.id}>
                                <td className="px-6 py-4"><div className="text-sm font-black uppercase">{u.name}</div><div className="text-[10px] text-gray-400">{u.email}</div></td>
                                <td className="px-6 py-4"><span className="text-[10px] font-bold">{u.role === 1 ? 'SUPER' : 'ADMIN'}</span></td>
                                <td className="px-6 py-4"><button onClick={async () => { await apiService.toggleApproval(u.id); load(); }} className={`h-5 w-10 rounded-full transition-all ${u.is_approved ? 'bg-emerald-500' : 'bg-gray-200'}`}><div className={`h-3 w-3 bg-white rounded-full transition-all ${u.is_approved ? 'translate-x-6' : 'translate-x-1'}`} /></button></td>
                                <td className="px-6 py-4"><ActionButton onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('users', u.id); load(); } }} icon={Trash2} color="text-red-500" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ==========================================
// --- 2. CAPAIAN MODULE ---
// ==========================================
export const CapaianModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({});
    useEffect(() => { load(); }, []);
    const load = async () => { setData(await apiService.getData('capaian')); };
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-2xl font-black text-[#111827] uppercase">Capaian Data</h2><Button onClick={() => {setFormData({}); setIsModalOpen(true)}}><Plus size={18} /> Update</Button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.map(item => (
                    <div key={item.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative group">
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all flex gap-2"><ActionButton onClick={() => {setFormData(item); setIsModalOpen(true)}} icon={Edit2} color="text-blue-500" /><ActionButton onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('capaian', item.id); load(); } }} icon={Trash2} color="text-red-500" /></div>
                        <div className="grid grid-cols-3 gap-4 border-b border-gray-50 pb-6 mb-6">
                            {['desa', 'kk', 'jiwa'].map(f => <div key={f}><p className="text-[8px] font-black text-gray-400 uppercase">{f}</p><p className="font-black text-[#111827] uppercase">{Number(item[f]).toLocaleString('id-ID')}</p></div>)}
                        </div>
                        <div className="space-y-3">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
                                <div className="h-full bg-blue-500" style={{ width: `${(item.laki/item.jiwa)*100}%` }}></div>
                                <div className="h-full bg-pink-500" style={{ width: `${(item.perempuan/item.jiwa)*100}%` }}></div>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase"><UserIcon size={10} /> {item.laki} Laki-laki</div>
                                <div className="flex items-center gap-1.5 text-[9px] font-black text-pink-600 uppercase"><UserIcon size={10} /> {item.perempuan} Perempuan</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Statistik">
                <form onSubmit={async (e) => { e.preventDefault(); await apiService.saveData('capaian', formData); setIsModalOpen(false); load(); }} className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {['desa', 'kelurahan', 'dusun', 'rw', 'bangunan', 'kk', 'jiwa', 'laki', 'perempuan'].map(f => (
                        <div key={f}><label className="text-[10px] font-black uppercase text-gray-400">{f}</label><input type="number" className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black text-navy outline-none focus:ring-2 focus:ring-red-100" value={formData[f] || 0} onChange={e => setFormData({...formData, [f]: Number(e.target.value)})} /></div>
                    ))}
                    <Button type="submit" className="col-span-full py-5">Simpan Statistik</Button>
                </form>
            </Modal>
        </div>
    );
};

// ==========================================
// --- 3. ARTIKEL MODULE ---
// ==========================================
export const ArtikelModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({ kategori: 'Berita' });
    useEffect(() => { load(); }, []);
    const load = async () => { setData(await apiService.getData('beritaartikel')); };
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-2xl font-black text-[#111827] uppercase">Warta & Artikel</h2><Button onClick={() => setIsModalOpen(true)}><Plus size={18} /> Berita Baru</Button></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.map(item => (
                    <div key={item.id} className="bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm relative group overflow-hidden">
                        <img src={`http://localhost:8000/storage/${item.gambar}`} className="h-48 w-full object-cover rounded-[2rem] mb-6" alt="Cover" />
                        <h4 className="font-black text-sm text-navy uppercase line-clamp-2">{item.judul_artikel}</h4>
                        <div className="flex justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all">
                            <ActionButton onClick={() => {setFormData(item); setIsModalOpen(true)}} icon={Edit2} color="text-blue-500" />
                            <ActionButton onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('beritaartikel', item.id); load(); } }} icon={Trash2} color="text-red-500" />
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Form Konten">
                <form onSubmit={async (e) => { e.preventDefault(); await apiService.saveData('beritaartikel', formData); setIsModalOpen(false); load(); }} className="space-y-4">
                    <input className="w-full p-4 bg-gray-50 rounded-2xl" placeholder="Judul" value={formData.judul_artikel || ''} onChange={e => setFormData({...formData, judul_artikel: e.target.value})} required />
                    <select className="w-full p-4 bg-gray-50 rounded-2xl" value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})}><option value="Berita">BERITA</option><option value="Artikel">ARTIKEL</option></select>
                    <textarea className="w-full p-4 bg-gray-50 rounded-2xl h-40" placeholder="Konten" value={formData.isi_artikel || ''} onChange={e => setFormData({...formData, isi_artikel: e.target.value})} required />
                    <input type="file" className="w-full p-3 border-2 border-dashed rounded-2xl" onChange={e => e.target.files && setFormData({...formData, gambar: e.target.files[0]})} />
                    <Button type="submit" className="w-full py-5">Publish</Button>
                </form>
            </Modal>
        </div>
    );
};

// ==========================================
// --- 4. MONOGRAFI MODULE ---
// ==========================================
export const MonografiModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    useEffect(() => { load(); }, []);
    const load = async () => { setData(await apiService.getData('monografi')); };
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-[#111827] uppercase">Monografi Desa</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {data.map(item => (
                    <div key={item.id} className="bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <img src={`http://localhost:8000/storage/${item.gambar}`} className="h-48 w-full object-cover rounded-3xl mb-4" alt="Book" />
                        <h4 className="font-black text-xs uppercase text-center mb-4">{item.desa}</h4>
                        <button onClick={async () => { await apiService.toggleMonografiFeatured(item.id); load(); }} className={`w-full py-2 rounded-xl font-black text-[9px] uppercase ${item.is_featured ? 'bg-[#E3242B] text-white' : 'bg-gray-100 text-gray-400'}`}>{item.is_featured ? 'Featured' : 'Pajang di Home'}</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==========================================
// --- 5. INFOGRAFIS MODULE (SUDAH DIKEMBALIKAN) ---
// ==========================================
export const InfografisModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({});
    useEffect(() => { load(); }, []);
    const load = async () => { setData(await apiService.getData('infografis')); };
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-2"><h2 className="text-2xl font-black text-[#111827] uppercase">Infografis</h2><Button onClick={() => setIsModalOpen(true)}><Plus size={18} /> Unggah Baru</Button></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {data.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm relative group">
                        <img src={`http://localhost:8000/storage/${item.gambar[0]}`} className="h-40 w-full object-cover rounded-2xl mb-4" alt="Infografis" />
                        <h4 className="font-black text-[10px] uppercase line-clamp-1">{item.judul}</h4>
                        <div className="flex justify-between items-center mt-4">
                            <button onClick={async () => { await apiService.toggleInfografisHome(item.id); load(); }} className={`px-4 py-1.5 rounded-full font-black text-[8px] uppercase ${item.is_approved_home ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>{item.is_approved_home ? 'Live' : 'Set'}</button>
                            <ActionButton onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('infografis', item.id); load(); } }} icon={Trash2} color="text-red-500" />
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Form Infografis">
                <form onSubmit={async (e) => { e.preventDefault(); await apiService.saveData('infografis', formData); setIsModalOpen(false); load(); }} className="space-y-4">
                    <input className="w-full p-4 bg-gray-50 rounded-2xl outline-none" placeholder="Judul" value={formData.judul || ''} onChange={e => setFormData({...formData, judul: e.target.value})} />
                    <input type="file" multiple className="w-full p-3 border-2 border-dashed rounded-2xl" onChange={e => e.target.files && setFormData({...formData, gambar: Array.from(e.target.files)})} />
                    <Button type="submit" className="w-full py-5">Upload Album</Button>
                </form>
            </Modal>
        </div>
    );
};

// ==========================================
// --- 6. GALERI MODULE ---
// ==========================================
export const GaleriModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({});
    useEffect(() => { load(); }, []);
    const load = async () => { setData(await apiService.getData('galeri')); };
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-2xl font-black text-[#111827] uppercase">Galeri Visual</h2><Button onClick={() => setIsModalOpen(true)}><Plus size={18} /> Tambah Foto</Button></div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {data.map(item => (
                    <div key={item.id} className="relative aspect-square rounded-3xl overflow-hidden group shadow-sm">
                        <img src={`http://localhost:8000/storage/${item.gambar}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Galeri" />
                        <div className="absolute inset-0 bg-[#111827]/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 backdrop-blur-[2px]">
                            <ActionButton onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('galeri', item.id); load(); } }} icon={Trash2} color="text-white" />
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Input Dokumentasi">
                <form onSubmit={async (e) => { e.preventDefault(); await apiService.saveData('galeri', formData); setIsModalOpen(false); load(); }} className="space-y-4">
                    <input className="w-full p-4 bg-gray-50 rounded-2xl" placeholder="Nama Kegiatan" value={formData.nama_kegiatan || ''} onChange={e => setFormData({...formData, nama_kegiatan: e.target.value})} required />
                    <input type="date" className="w-full p-4 bg-gray-50 rounded-2xl" value={formData.tanggal || ''} onChange={e => setFormData({...formData, tanggal: e.target.value})} required />
                    <input type="file" className="w-full p-3 border-2 border-dashed rounded-2xl" onChange={e => e.target.files && setFormData({...formData, gambar: e.target.files[0]})} required />
                    <Button type="submit" className="w-full py-5">Simpan Galeri</Button>
                </form>
            </Modal>
        </div>
    );
};

// ==========================================
// --- 7. BUKU & JURNAL MODULE ---
// ==========================================
export const BukuModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    useEffect(() => { load(); }, []);
    const load = async () => { const res = await apiService.getData('buku'); setData(res.data || res); };
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-[#111827] uppercase">Koleksi Buku</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {data.map(item => (
                    <div key={item.id} className="bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
                        <img src={`http://localhost:8000/storage/${item.gambar}`} className="h-48 w-full object-cover rounded-3xl mb-4 shadow-md" alt="Book" />
                        <h4 className="font-black text-xs uppercase line-clamp-1">{item.judul}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const JurnalModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    useEffect(() => { load(); }, []);
    const load = async () => { const res = await apiService.getData('jurnal'); setData(res.data || res); };
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-[#111827] uppercase">Jurnal Ilmiah</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex gap-4">
                        <img src={`http://localhost:8000/storage/${item.gambar}`} className="w-20 h-28 object-cover rounded-xl shadow-sm" alt="Jurnal" />
                        <div className="flex flex-col justify-center">
                            <h4 className="font-black text-xs uppercase line-clamp-2">{item.judul}</h4>
                            <p className="text-[10px] text-red-500 font-bold uppercase mt-2">{item.penulis}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==========================================
// --- 8. MITRA MODULE ---
// ==========================================
export const MitraModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({ kategori: 'pemerintah' });
    useEffect(() => { load(); }, []);
    const load = async () => { setData(await apiService.getData('mitra')); };
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-2"><h2 className="text-2xl font-black text-[#111827] uppercase">Mitra</h2><Button onClick={() => setIsModalOpen(true)}><Plus size={18} /> Tambah Mitra</Button></div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6 px-2">
                {data.map(item => (
                    <div key={item.id} className="bg-white border p-6 rounded-[2rem] flex flex-col items-center group relative shadow-sm hover:shadow-md transition-all">
                        <img src={`http://localhost:8000/storage/${item.gambar}`} className="h-16 object-contain grayscale group-hover:grayscale-0 transition-all" alt="Mitra" />
                        <ActionButton onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('mitra', item.id); load(); } }} icon={Trash2} color="absolute top-3 right-3 text-red-400" />
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Form Mitra">
                <form onSubmit={async (e) => { e.preventDefault(); await apiService.saveData('mitra', formData); setIsModalOpen(false); load(); }} className="space-y-4">
                    <input className="w-full p-4 bg-gray-50 rounded-2xl" placeholder="Nama Mitra" value={formData.nama_mitra || ''} onChange={e => setFormData({...formData, nama_mitra: e.target.value})} required />
                    <select className="w-full p-4 bg-gray-50 rounded-2xl font-black text-[10px] uppercase" value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})}>
                        <option value="pemerintah">PEMERINTAH</option>
                        <option value="akademisi">AKADEMISI</option>
                    </select>
                    <input type="file" className="w-full p-3 border-2 border-dashed rounded-2xl" onChange={e => e.target.files && setFormData({...formData, gambar: e.target.files[0]})} />
                    <Button type="submit" className="w-full py-5">Simpan Mitra</Button>
                </form>
            </Modal>
        </div>
    );
};

// ==========================================
// --- 9. TESTIMONI MODULE ---
// ==========================================
export const TestimoniModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({});
    useEffect(() => { load(); }, []);
    const load = async () => { setData(await apiService.getData('testimoni')); };
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-2xl font-black text-[#111827] uppercase">Suara Tokoh</h2><Button onClick={() => setIsModalOpen(true)}><Plus size={18} /> Tambah Testi</Button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.map(item => (
                    <div key={item.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative group">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <img src={`http://localhost:8000/storage/${item.gambar}`} className="h-16 w-16 rounded-2xl object-cover border border-gray-100 shadow-inner" />
                                <div><h4 className="font-black text-sm text-navy uppercase leading-none mb-1">{item.nama}</h4><p className="text-[9px] text-[#E3242B] font-black uppercase tracking-widest">{item.jabatan}</p></div>
                            </div>
                            <button onClick={async () => { await apiService.toggleTestimoniTampil(item.id); load(); }} className={`h-6 w-11 rounded-full transition-all ${item.is_tampil ? 'bg-[#E3242B] shadow-lg shadow-red-900/20' : 'bg-gray-200'}`}><div className={`h-4 w-4 bg-white rounded-full transition-all ${item.is_tampil ? 'translate-x-6' : 'translate-x-1'}`} /></button>
                        </div>
                        <p className="mt-8 text-gray-500 text-xs md:text-sm uppercase font-bold tracking-tight leading-relaxed italic text-justify">"{item.isi}"</p>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Form Testimoni">
                <form onSubmit={async (e) => { e.preventDefault(); await apiService.saveData('testimoni', formData); setIsModalOpen(false); load(); }} className="space-y-4">
                    <input className="w-full p-4 bg-gray-50 rounded-2xl" placeholder="Nama" value={formData.nama || ''} onChange={e => setFormData({...formData, nama: e.target.value})} required />
                    <input className="w-full p-4 bg-gray-50 rounded-2xl" placeholder="Jabatan" value={formData.jabatan || ''} onChange={e => setFormData({...formData, jabatan: e.target.value})} required />
                    <textarea className="w-full p-4 bg-gray-50 rounded-2xl h-32 outline-none resize-none" placeholder="Isi Testimoni" value={formData.isi || ''} onChange={e => setFormData({...formData, isi: e.target.value})} required />
                    <input type="file" className="w-full p-3 border-2 border-dashed rounded-2xl" onChange={e => e.target.files && setFormData({...formData, gambar: e.target.files[0]})} />
                    <Button type="submit" className="w-full py-5">Simpan Testimoni</Button>
                </form>
            </Modal>
        </div>
    );
};

// ==========================================
// --- 10. PESAN MASUK (KONTAK) ---
// ==========================================
export const PesanKontakModule: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    useEffect(() => { load(); }, []);
    const load = async () => { setData(await apiService.getData('contacts')); };
    return (
        <div className="space-y-6 px-2">
            <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tighter leading-none mb-8">Pesan Masuk (Inbox)</h2>
            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-100">
                    <TableHeader><Th>Pengirim</Th><Th>Subjek & Isi Pesan</Th><Th>Aksi</Th></TableHeader>
                    <tbody className="divide-y divide-gray-50">
                        {data.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-all">
                                <td className="px-6 py-6"><div className="text-sm font-black uppercase text-navy">{item.nama_lengkap}</div><div className="text-[9px] font-bold text-gray-400">{item.email}</div></td>
                                <td className="px-6 py-6"><div className="text-[9px] font-black text-[#E3242B] uppercase mb-1 tracking-widest">{item.subjek}</div><p className="text-xs text-gray-500 font-medium line-clamp-2">{item.pesan}</p></td>
                                <td className="px-6 py-6"><ActionButton icon={Trash2} color="text-red-500" onClick={async () => { if(window.confirm('Hapus?')){ await apiService.deleteData('contacts', item.id); load(); } }} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const GenericPlaceholderModule: React.FC<{title: string}> = ({ title }) => (
    <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
        <div className="p-6 bg-gray-50 rounded-full mb-4"><Database size={40} className="text-gray-300" /></div>
        <h2 className="text-2xl font-bold text-[#111827] mb-2">{title} Module</h2>
        <p className="max-w-md text-center text-gray-500 uppercase tracking-widest text-[10px] font-bold">Modul ini sedang disinkronkan.</p>
    </div>
);