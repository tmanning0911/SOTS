import { useState, useEffect } from 'react';
import { cms } from '@/lib/cms';
import { IconPlus, IconPencil, IconTrash, IconClose, IconCheck } from '@/components/icons';

const emptyProgram = {
  title: '',
  description: '',
  icon: 'BookOpen',
  ctaText: '',
  ctaLink: '',
  image: '',
  sort_order: 0,
};
const iconOptions = ['BookOpen', 'Video', 'FileText', 'Users', 'GraduationCap', 'Globe', 'Mic', 'Music'];

export default function AdminLearning() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProgram);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await cms.learning.list('sort_order');
    setPrograms(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(emptyProgram); setEditingId(null); setShowForm(true); };
  const openEdit = (p) => { setForm(p); setEditingId(p.id); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditingId(null); };

  const save = async () => {
    setSaving(true);
    if (editingId) {
      await cms.learning.update(editingId, form);
    } else {
      await cms.learning.create(form);
    }
    setSaving(false);
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this program?')) return;
    setDeletingId(id);
    await cms.learning.delete(id);
    setDeletingId(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-navy/55 text-sm">{programs.length} programs</p>
        <button onClick={openNew} className="flex items-center gap-2 bg-gold text-navy-deep px-4 py-2 text-sm font-medium hover:bg-gold-light transition-colors">
          <IconPlus size={16} /> Add Program
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-navy/10 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-playfair text-navy text-lg font-bold uppercase">{editingId ? 'Edit Program' : 'New Program'}</h3>
            <button onClick={cancel}><IconClose size={18} className="text-navy/45 hover:text-navy/70" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Title *</label>
              <input className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Icon</label>
              <select className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.icon} onChange={e => setForm(f => ({...f, icon: e.target.value}))}>
                {iconOptions.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Card image URL</label>
              <input
                className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy"
                placeholder="/images/learning/in-schools.jpg"
                value={form.image || ''}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              />
              {form.image && (
                <img src={form.image} alt="" className="mt-2 w-full max-h-40 object-cover border border-navy/8" />
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">CTA Text *</label>
              <input className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" placeholder="e.g. Book This Workshop" value={form.ctaText} onChange={e => setForm(f => ({...f, ctaText: e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">CTA Link</label>
              <input className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" placeholder="e.g. /contact?topic=education" value={form.ctaLink || ''} onChange={e => setForm(f => ({...f, ctaLink: e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Sort Order</label>
              <input type="number" className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.sort_order || 0} onChange={e => setForm(f => ({...f, sort_order: Number(e.target.value)}))} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-navy/55 uppercase tracking-wider mb-1">Description *</label>
              <textarea rows={4} className="w-full border border-navy/10 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-5 border-t border-navy/8">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-navy text-white px-5 py-2 text-sm font-medium hover:bg-navy/90 transition-colors disabled:opacity-50">
              <IconCheck size={15} /> {saving ? 'Saving…' : 'Save Program'}
            </button>
            <button onClick={cancel} className="px-5 py-2 text-sm border border-navy/10 text-navy/55 hover:bg-cream-dark transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-navy/20 border-t-navy rounded-full animate-spin" /></div>
      ) : (
        <div className="grid gap-3">
          {programs.map(prog => (
            <div key={prog.id} className="bg-white border border-navy/10 px-5 py-4 flex items-start justify-between gap-4 hover:border-navy/20 transition-colors">
              {prog.image ? (
                <img src={prog.image} alt="" className="w-20 h-14 object-cover shrink-0 border border-navy/8" />
              ) : (
                <div className="w-20 h-14 bg-cream-dark shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-navy">{prog.title}</p>
                  <span className="text-navy/30 text-xs">·</span>
                  <span className="text-navy/45 text-xs">{prog.icon}</span>
                </div>
                <p className="text-navy/55 text-xs leading-relaxed line-clamp-2">{prog.description}</p>
                <p className="text-gold-muted text-xs mt-1 font-medium">{prog.ctaText}</p>
              </div>
              <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                <button onClick={() => openEdit(prog)} className="p-1.5 text-navy/45 hover:text-navy transition-colors"><IconPencil size={14} /></button>
                <button onClick={() => remove(prog.id)} disabled={deletingId === prog.id} className="p-1.5 text-navy/45 hover:text-red-500 transition-colors"><IconTrash size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}