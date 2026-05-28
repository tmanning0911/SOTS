import { useState, useEffect } from 'react';
import { cms } from '@/lib/cms';
import { IconPlus, IconPencil, IconTrash, IconClose, IconCheck, IconImage } from '@/components/icons';

const emptyArticle = { title: '', date: '', category: 'News', image: '', excerpt: '', content: '', published: true };
const categories = ['News', 'Production', 'Feature', 'Education', 'Events'];
const categoryColors = {
  News: 'bg-navy/5 text-navy border border-navy/15',
  Production: 'bg-gold/15 text-gold-muted border border-gold/25',
  Feature: 'bg-cream-dark text-navy border border-navy/10',
  Education: 'bg-navy/8 text-navy-light border border-navy/12',
  Events: 'bg-gold/10 text-navy border border-gold/20',
};

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyArticle);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await cms.articles.list('-date');
    setArticles(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(emptyArticle); setEditingId(null); setShowForm(true); };
  const openEdit = (a) => { setForm(a); setEditingId(a.id); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditingId(null); };

  const save = async () => {
    setSaving(true);
    if (editingId) {
      await cms.articles.update(editingId, form);
    } else {
      await cms.articles.create(form);
    }
    setSaving(false);
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this article?')) return;
    setDeletingId(id);
    await cms.articles.delete(id);
    setDeletingId(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-navy/55 text-sm">{articles.length} articles</p>
        <button onClick={openNew} className="flex items-center gap-2 bg-gold text-navy-deep px-4 py-2 text-sm font-medium hover:bg-gold-light transition-colors">
          <IconPlus size={16} /> Add Article
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-navy/10 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-playfair text-navy text-lg font-bold uppercase">{editingId ? 'Edit Article' : 'New Article'}</h3>
            <button onClick={cancel}><IconClose size={18} className="text-navy/45 hover:text-navy/70" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Title *</label>
              <input className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Date *</label>
              <input className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" placeholder="e.g. 12 Jan 2026" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Category *</label>
              <select className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Image URL *</label>
              <input className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.image} onChange={e => setForm(f => ({...f, image: e.target.value}))} />
              {form.image && <img src={form.image} alt="" className="mt-2 h-24 object-cover border border-navy/8" />}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Excerpt *</label>
              <textarea rows={2} className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.excerpt} onChange={e => setForm(f => ({...f, excerpt: e.target.value}))} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Full Content</label>
              <textarea rows={6} className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.content || ''} onChange={e => setForm(f => ({...f, content: e.target.value}))} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="published" checked={form.published !== false} onChange={e => setForm(f => ({...f, published: e.target.checked}))} />
              <label htmlFor="published" className="text-xs font-medium text-navy/55 uppercase tracking-wider">Published</label>
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-5 border-t border-navy/8">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-navy text-white px-5 py-2 text-sm font-medium hover:bg-navy/90 transition-colors disabled:opacity-50">
              <IconCheck size={15} /> {saving ? 'Saving…' : 'Save Article'}
            </button>
            <button onClick={cancel} className="px-5 py-2 text-sm border border-navy/10 text-navy/55 hover:bg-cream-dark transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-navy/20 border-t-navy rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white border border-navy/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-dark border-b border-navy/10">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-navy/45 uppercase tracking-wider w-16">Image</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-navy/45 uppercase tracking-wider">Title</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-navy/45 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-navy/45 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-navy/45 uppercase tracking-wider hidden md:table-cell">Status</th>
                <th className="px-5 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/8">
              {articles.map(a => (
                <tr key={a.id} className="hover:bg-cream-dark transition-colors">
                  <td className="px-5 py-3">
                    {a.image ? <img src={a.image} alt="" className="w-12 h-8 object-cover" /> : <div className="w-12 h-8 bg-cream-dark flex items-center justify-center"><IconImage size={12} className="text-navy/30" /></div>}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-navy line-clamp-1">{a.title}</p>
                    <p className="text-navy/45 text-xs line-clamp-1">{a.excerpt}</p>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-full ${categoryColors[a.category]}`}>{a.category}</span>
                  </td>
                  <td className="px-5 py-3 text-navy/55 hidden md:table-cell">{a.date}</td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    {a.published !== false ? <span className="text-gold-muted text-xs font-medium">Published</span> : <span className="text-navy/45 text-xs">Draft</span>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(a)} className="p-1.5 text-navy/45 hover:text-navy transition-colors"><IconPencil size={14} /></button>
                      <button onClick={() => remove(a.id)} disabled={deletingId === a.id} className="p-1.5 text-navy/45 hover:text-red-500 transition-colors"><IconTrash size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}