import { useState, useEffect } from 'react';
import { cms } from '@/lib/cms';
import { IconPlus, IconPencil, IconTrash, IconClose, IconCheck, IconImage } from '@/components/icons';

const emptyPlay = { title: '', subtitle: '', description: '', dates: '', location: '', status: 'Coming Soon', image: '', ticketUrl: '', tag: 'Get Tickets', featured: false, sort_order: 0 };

export default function AdminPlays() {
  const [plays, setPlays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyPlay);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await cms.plays.list('sort_order');
    setPlays(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(emptyPlay); setEditingId(null); setShowForm(true); };
  const openEdit = (play) => { setForm(play); setEditingId(play.id); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditingId(null); };

  const save = async () => {
    setSaving(true);
    if (editingId) {
      await cms.plays.update(editingId, form);
    } else {
      await cms.plays.create(form);
    }
    setSaving(false);
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this production?')) return;
    setDeletingId(id);
    await cms.plays.delete(id);
    setDeletingId(null);
    load();
  };

  const statusColors = {
    'Now On': 'bg-gold/15 text-gold-muted border border-gold/25',
    'On Sale': 'bg-gold/15 text-gold-muted border border-gold/25',
    Free: 'bg-navy/5 text-navy border border-navy/15',
    'Coming Soon': 'bg-navy/5 text-navy border border-navy/15',
    Archived: 'bg-cream-dark text-navy/50 border border-navy/10',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-navy/55 text-sm">{plays.length} productions</p>
        <button onClick={openNew} className="flex items-center gap-2 bg-gold text-navy-deep px-4 py-2 text-sm font-medium hover:bg-gold-light transition-colors">
          <IconPlus size={16} /> Add Production
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-navy/10 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-playfair text-navy text-lg font-bold uppercase">{editingId ? 'Edit Production' : 'New Production'}</h3>
            <button onClick={cancel}><IconClose size={18} className="text-navy/45 hover:text-navy/70" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Title *</label>
              <input className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Subtitle</label>
              <input className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.subtitle || ''} onChange={e => setForm(f => ({...f, subtitle: e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Dates *</label>
              <input className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" placeholder="e.g. 6 Mar – 28 Jun 2026" value={form.dates} onChange={e => setForm(f => ({...f, dates: e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Location</label>
              <input className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.location || ''} onChange={e => setForm(f => ({...f, location: e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Status</label>
              <select className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                <option>Now On</option><option>On Sale</option><option>Free</option><option>Coming Soon</option><option>Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Ticket URL</label>
              <input className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.ticketUrl || ''} onChange={e => setForm(f => ({...f, ticketUrl: e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">CTA Tag</label>
              <input className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" placeholder="e.g. Get Tickets" value={form.tag || ''} onChange={e => setForm(f => ({...f, tag: e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Sort Order</label>
              <input type="number" className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.sort_order || 0} onChange={e => setForm(f => ({...f, sort_order: Number(e.target.value)}))} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Image URL *</label>
              <input className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.image} onChange={e => setForm(f => ({...f, image: e.target.value}))} />
              {form.image && <img src={form.image} alt="" className="mt-2 h-24 object-cover border border-navy/8" />}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Description *</label>
              <textarea rows={3} className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={form.featured || false} onChange={e => setForm(f => ({...f, featured: e.target.checked}))} className="rounded" />
              <label htmlFor="featured" className="text-xs font-medium text-navy/55 uppercase tracking-wider">Featured in Hero Slider</label>
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-5 border-t border-navy/8">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-navy text-white px-5 py-2 text-sm font-medium hover:bg-navy/90 transition-colors disabled:opacity-50">
              <IconCheck size={15} /> {saving ? 'Saving…' : 'Save Production'}
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
                <th className="text-left px-5 py-3 text-xs font-medium text-navy/45 uppercase tracking-wider hidden md:table-cell">Dates</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-navy/45 uppercase tracking-wider hidden md:table-cell">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-navy/45 uppercase tracking-wider hidden md:table-cell">Featured</th>
                <th className="px-5 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/8">
              {plays.map(play => (
                <tr key={play.id} className="hover:bg-cream-dark transition-colors">
                  <td className="px-5 py-3">
                    {play.image ? <img src={play.image} alt="" className="w-12 h-8 object-cover" /> : <div className="w-12 h-8 bg-cream-dark flex items-center justify-center"><IconImage size={12} className="text-navy/30" /></div>}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-navy">{play.title}</p>
                    <p className="text-navy/45 text-xs">{play.location}</p>
                  </td>
                  <td className="px-5 py-3 text-navy/55 hidden md:table-cell">{play.dates}</td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-full ${statusColors[play.status]}`}>{play.status}</span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    {play.featured ? <span className="text-gold-muted text-xs font-medium">✓ Featured</span> : <span className="text-navy/30 text-xs">—</span>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(play)} className="p-1.5 text-navy/45 hover:text-navy transition-colors"><IconPencil size={14} /></button>
                      <button onClick={() => remove(play.id)} disabled={deletingId === play.id} className="p-1.5 text-navy/45 hover:text-red-500 transition-colors"><IconTrash size={14} /></button>
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