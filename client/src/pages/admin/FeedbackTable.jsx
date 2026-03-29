import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { DataTable } from '../../components/ui/DataTable';
import { RatingBadge } from '../../components/ui/RatingBadge';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Eye, Trash2, X } from 'lucide-react';

export const FeedbackTable = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  
  const [expandedId, setExpandedId] = useState(null);
  const [expandedData, setExpandedData] = useState(null);
  const [expandedLoading, setExpandedLoading] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/feedback?page=${page}&limit=${limit}`);
      setData(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to load feedback.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const toggleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedData(null);
      return;
    }
    setExpandedId(id);
    setExpandedLoading(true);
    try {
      const res = await api.get(`/feedback/${id}`);
      setExpandedData(res.data);
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to load details.' });
      setExpandedId(null);
    } finally {
      setExpandedLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/feedback/${deleteId}`);
      showToast({ type: 'success', title: 'Deleted', message: 'Feedback deleted successfully.' });
      fetchData();
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to delete.' });
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    {
      header: 'Date',
      accessorKey: 'submitted_at',
      cell: (row) => <span className="text-gray-900 font-medium">{new Date(row.submitted_at).toLocaleDateString()}</span>
    },
    {
      header: 'User',
      accessorKey: 'user_name',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{row.is_anonymous ? 'Anonymous User' : row.user_name}</span>
          {!row.is_anonymous && <span className="text-xs text-gray-500">{row.user_email}</span>}
        </div>
      )
    },
    {
      header: 'Avg Rating',
      accessorKey: 'avg_rating',
      cell: (row) => <RatingBadge value={row.avg_rating} />
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <button onClick={() => toggleExpand(row.id)} className="p-2 text-gray-500 hover:text-primary-600 bg-gray-50 hover:bg-primary-50 rounded transition-colors" title="View Details">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => setDeleteId(row.id)} className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded transition-colors" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">All Feedback</h1>
        <p className="mt-2 text-sm text-gray-500">View and manage all user submissions.</p>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading} 
        pagination={{ page, totalPages, onPageChange: setPage }}
      />

      {expandedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-900">Response Details</h3>
              <button onClick={() => setExpandedId(null)} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {expandedLoading ? (
                <div className="py-12 flex justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full" /></div>
              ) : expandedData ? (
                <div className="space-y-4">
                  {expandedData.responses.map(r => (
                    <div key={r.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        {r.question_text || `Question ID: ${r.question_id}`}
                      </p>
                      <div className="text-base text-gray-900 mt-1">
                        {r.rating ? <RatingBadge value={r.rating} /> : null}
                        {r.text_answer ? <p className="mt-2 text-gray-700">{r.text_answer}</p> : null}
                        {r.choice ? <span className="inline-block mt-2 bg-primary-50 text-primary-700 px-2.5 py-1 rounded-md text-sm font-medium border border-primary-100">{r.choice}</span> : null}
                      </div>
                      {r.sentiment && r.sentiment !== 'neutral' && r.text_answer && (
                        <div className="mt-3 flex items-center">
                          <span className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${r.sentiment === 'positive' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${r.sentiment === 'positive' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span>{r.sentiment}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {expandedData.responses.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No responses recorded for this submission.</div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog 
        isOpen={!!deleteId}
        title="Delete Feedback"
        message="Are you sure you want to delete this feedback? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        confirmText="Delete"
      />
    </div>
  );
};
