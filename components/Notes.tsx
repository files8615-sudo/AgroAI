
import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { Plus, Trash2, Calendar, Save, Search, X, Edit2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CATEGORIES = ['General', 'Planting', 'Irrigation', 'Harvest', 'Issue'] as const;

export const Notes: React.FC = () => {
  const { t } = useLanguage();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<Note['category']>('General');

  // Load notes on mount
  useEffect(() => {
    const saved = localStorage.getItem('agroai_notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    } else {
      setNotes([
        { id: '1', title: 'Corn Planting', content: 'Finished planting North field. Used hybrid seeds.', date: new Date().toISOString(), category: 'Planting' },
        { id: '2', title: 'Irrigation Pump Maintenance', content: 'Pump #4 needs new filter.', date: new Date(Date.now() - 86400000).toISOString(), category: 'Irrigation' }
      ]);
    }
  }, []);

  // Save notes on change
  useEffect(() => {
    localStorage.setItem('agroai_notes', JSON.stringify(notes));
  }, [notes]);

  const openEditor = (note?: Note) => {
    if (note) {
      setEditingId(note.id);
      setFormTitle(note.title);
      setFormContent(note.content);
      setFormCategory(note.category);
    } else {
      setEditingId(null);
      setFormTitle('');
      setFormContent('');
      setFormCategory('General');
    }
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formTitle.trim()) return;

    if (editingId) {
      // Update existing
      setNotes(notes.map(n => n.id === editingId ? {
        ...n,
        title: formTitle,
        content: formContent,
        category: formCategory
      } : n));
    } else {
      // Create new
      const newNote: Note = {
        id: Date.now().toString(),
        title: formTitle,
        content: formContent,
        date: new Date().toISOString(),
        category: formCategory
      };
      setNotes([newNote, ...notes]);
    }
    closeEditor();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'General': return t('cat_general');
      case 'Planting': return t('cat_planting');
      case 'Irrigation': return t('cat_irrigation');
      case 'Harvest': return t('cat_harvest');
      case 'Issue': return t('cat_issue');
      default: return cat;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Planting': return 'bg-green-100 text-green-800 border-green-200';
      case 'Irrigation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Harvest': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Issue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full pb-20 relative">
      {/* Header & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{t('nav_notes')}</h2>
          <button 
            onClick={() => openEditor()}
            className="bg-agro-600 text-white p-2 rounded-full hover:bg-agro-700 transition-colors shadow-md flex items-center gap-2 px-4"
          >
            <Plus size={20} />
            <span className="text-sm font-medium">{t('new_btn')}</span>
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder={t('search_notes')} 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-agro-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Note Editor Overlay/Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-in-top">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">{editingId ? t('edit_note') : t('new_note')}</h3>
              <button onClick={closeEditor} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">{t('title_label')}</label>
                <input
                  type="text"
                  placeholder="..."
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-agro-500 text-gray-800 font-medium placeholder:text-gray-400"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">{t('category_label')}</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFormCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        formCategory === cat 
                          ? 'bg-agro-600 text-white border-agro-600' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-agro-400'
                      }`}
                    >
                      {getCategoryLabel(cat)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">{t('observations_label')}</label>
                <textarea
                  placeholder="..."
                  className="w-full p-3 h-32 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-agro-500 text-gray-600 resize-none text-sm"
                  value={formContent}
                  onChange={e => setFormContent(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={closeEditor} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">
                {t('cancel')}
              </button>
              <button 
                onClick={handleSave}
                disabled={!formTitle.trim()}
                className="bg-agro-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-agro-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Save size={18} /> {editingId ? t('update_note') : t('save_note')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="grid gap-4">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center opacity-50">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">{t('no_notes_found')}</p>
          </div>
        ) : (
          filteredNotes.map(note => (
            <div 
              key={note.id} 
              onClick={() => openEditor(note)}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-agro-200 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(note.category || 'General')}`}>
                  {getCategoryLabel(note.category || 'General')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(note.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-agro-700 transition-colors">{note.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{note.content}</p>
              
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); openEditor(note); }}
                  className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={(e) => handleDelete(note.id, e)}
                  className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
