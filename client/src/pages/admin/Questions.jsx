import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Spinner } from '../../components/ui/Spinner';
import { GripVertical, Trash2, Edit2, Plus, GripVertical as DragIcon } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ q, onEdit, onDelete, onToggleActive }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: q.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center justify-between p-4 mb-3 rounded-xl border ${q.is_active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-60'} shadow-sm group`}>
      <div className="flex items-center max-w-[70%]">
        <button {...attributes} {...listeners} className="p-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 focus:outline-none">
          <DragIcon className="w-5 h-5" />
        </button>
        <div className="ml-3 flexflex-col min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {q.text} {q.required ? <span className="text-red-500 ml-1 text-sm font-bold">*</span> : null}
          </p>
          <div className="flex space-x-2 mt-1">
            <span className="inline-flex px-2 rounded-full text-xs font-medium bg-primary-50 text-primary-700 uppercase tracking-wider">{q.type}</span>
            <span className={`inline-flex px-2 rounded-full text-xs font-medium ${q.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {q.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <button onClick={() => onToggleActive(q.id, !q.is_active)} className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
          Toggle
        </button>
        <button onClick={() => onEdit(q)} className="p-2 text-gray-400 hover:text-primary-600 bg-white hover:bg-primary-50 rounded-md transition-colors border border-transparent hover:border-primary-100">
          <Edit2 className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(q.id)} className="p-2 text-gray-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-md transition-colors border border-transparent hover:border-red-100">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ text: '', type: 'text', required: true, options: '' });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchQuestions = async () => {
    try {
      const { data } = await api.get('/questions');
      setQuestions(data);
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to load questions.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = questions.findIndex(q => q.id === active.id);
      const newIndex = questions.findIndex(q => q.id === over.id);
      const newArr = arrayMove(questions, oldIndex, newIndex);
      setQuestions(newArr);

      // Save order
      const orders = newArr.map((q, idx) => ({ id: q.id, order_index: idx }));
      try {
        await api.patch('/questions/reorder', { orders });
      } catch (err) {
        showToast({ type: 'error', title: 'Error', message: 'Failed to save new order.' });
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, options: formData.type === 'choice' ? formData.options.split(',').map(s=>s.trim()) : null };
      if (editingId) {
        await api.put(`/questions/${editingId}`, payload);
        showToast({ type: 'success', title: 'Saved', message: 'Question updated.' });
      } else {
        await api.post('/questions', payload);
        showToast({ type: 'success', title: 'Created', message: 'Question created.' });
      }
      setFormOpen(false);
      fetchQuestions();
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: 'Operation failed.' });
    }
  };

  const openEdit = (q) => {
    setEditingId(q.id);
    setFormData({
      text: q.text,
      type: q.type,
      required: q.required === 1,
      options: q.options ? q.options.join(', ') : ''
    });
    setFormOpen(true);
  };

  const openNew = () => {
    setEditingId(null);
    setFormData({ text: '', type: 'text', required: true, options: '' });
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Deactivate question?')) return;
    try {
      await api.delete(`/questions/${id}`);
      showToast({ type: 'success', title: 'Deactivated' });
      fetchQuestions();
    } catch (err) {
      showToast({ type: 'error', title: 'Error' });
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Spinner /></div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Manage Questions</h1>
          <p className="mt-2 text-sm text-gray-500">Drag to reorder. Toggle active status.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors">
          <Plus className="-ml-1 mr-2 h-4 w-4" /> Add Question
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-inner">
            {questions.map((q) => (
              <SortableItem key={q.id} q={q} onEdit={openEdit} onDelete={handleDelete} onToggleActive={handleDelete} />
            ))}
            {questions.length === 0 && <div className="text-center p-8 text-gray-500">No questions found.</div>}
          </div>
        </SortableContext>
      </DndContext>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Question' : 'New Question'}</h3>
              <button onClick={() => setFormOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Question Text</label>
                <input required value={formData.text} onChange={e=>setFormData({...formData, text: e.target.value})} className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-600 p-2.5 border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Type</label>
                  <select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-600 p-2.5 border bg-white">
                    <option value="rating">Rating (1-5)</option>
                    <option value="text">Text / Comment</option>
                    <option value="choice">Multiple Choice</option>
                  </select>
                </div>
                <div className="flex items-center mt-6">
                  <label className="flex items-center">
                    <input type="checkbox" checked={formData.required} onChange={e=>setFormData({...formData, required: e.target.checked})} className="rounded text-primary-600 focus:ring-primary-600 h-4 w-4 border-gray-300" />
                    <span className="ml-2 text-sm text-gray-900">Required</span>
                  </label>
                </div>
              </div>

              {formData.type === 'choice' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-medium text-gray-900 mb-1">Options (comma separated)</label>
                  <input required value={formData.options} onChange={e=>setFormData({...formData, options: e.target.value})} placeholder="Yes, No, Maybe" className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-600 p-2.5 border" />
                </div>
              )}

              <div className="pt-4 flex justify-end space-x-3 border-t border-gray-50 mt-6">
                <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
