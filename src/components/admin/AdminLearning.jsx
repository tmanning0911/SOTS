import { useState, useEffect } from 'react';
import { content } from '@/api/content';
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
    const data = await content.entities.LearningProgram.list('sort_order');
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
      await content.entities.LearningProgram.update(editingId, form);
    } else {
      await content.entities.LearningProgram.create(form);
    }
    setSaving(false);
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this program?')) return;
    setDeletingId(id);
    await content.entities.LearningProgram.delete(id);
    setDeletingId(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm">{programs.length} programs</p>
        <button onClick={openNew} className="flex items-center gap-2 bg-gold text-navy-deep px-4 py-2 text-sm font-medium hover:bg-gold-light transition-colors">
          <IconPlus size={16} /> Add Program
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-playfair text-navy text-lg font-bold uppercase">{editingId ? 'Edit Program' : 'New Program'}</h3>
            <button onClick={cancel}><IconClose size={18} className="text-gray-400 hover:text-gray-600" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Title *</label>
              <input className="w-full border border-gray-200 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Icon</label>
              <select className="w-full border border-gray-200 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.icon} onChange={e => setForm(f => ({...f, icon: e.target.value}))}>
                {iconOptions.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Card image URL</label>
              <input
                className="w-full border border-gray-200 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy"
                placeholder="/images/learning/in-schools.jpg"
                value={form.image || ''}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              />
              {form.image && (
                <img src={form.image} alt="" className="mt-2 w-full max-h-40 object-cover border border-gray-100" />
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">CTA Text *</label>
              <input className="w-full border border-gray-200 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" placeholder="e.g. Book This Workshop" value={form.ctaText} onChange={e => setForm(f => ({...f, ctaText: e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">CTA Link</label>
              <input className="w-full border border-gray-200 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" placeholder="e.g. /contact?topic=education" value={form.ctaLink || ''} onChange={e => setForm(f => ({...f, ctaLink: e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Sort Order</label>
              <input type="number" className="w-full border border-gray-200 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.sort_order || 0} onChange={e => setForm(f => ({...f, sort_order: Number(e.target.value)}))} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Description *</label>
              <textarea rows={4} className="w-full border border-gray-200 px-3 py-2 text-sm text-navy focus:outline-none focus:border-navy" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-navy text-white px-5 py-2 text-sm font-medium hover:bg-navy/90 transition-colors disabled:opacity-50">
              <IconCheck size={15} /> {saving ? 'Saving…' : 'Save Program'}
            </button>
            <button onClick={cancel} className="px-5 py-2 text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-navy/20 border-t-navy rounded-full animate-spin" /></div>
      ) : (
        <div className="grid gap-3">
          {programs.map(prog => (
            <div key={prog.id} className="bg-white border border-gray-200 px-5 py-4 flex items-start justify-between gap-4 hover:border-gray-300 transition-colors">
              {prog.image ? (
                <img src={prog.image} alt="" className="w-20 h-14 object-cover shrink-0 border border-gray-100" />
              ) : (
                <div className="w-20 h-14 bg-gray-100 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-navy">{prog.title}</p>
                  <span className="text-gray-300 text-xs">·</span>
                  <span className="text-gray-400 text-xs">{prog.icon}</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{prog.description}</p>
                <p className="text-rust text-xs mt-1 font-medium">{prog.ctaText}</p>
              </div>
              <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                <button onClick={() => openEdit(prog)} className="p-1.5 text-gray-400 hover:text-navy transition-colors"><IconPencil size={14} /></button>
                <button onClick={() => remove(prog.id)} disabled={deletingId === prog.id} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><IconTrash size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}