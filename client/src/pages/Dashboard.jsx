import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/ui/StatCard';
import { DataTable } from '../components/ui/DataTable';
import { RatingBadge } from '../components/ui/RatingBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { MessageSquare, Calendar, Star, FileText } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyFeedback = async () => {
      try {
        const { data } = await api.get('/feedback/my');
        setFeedback(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyFeedback();
  }, []);

  const totalSubmissions = feedback.length;
  // Calculate average rating
  const avgRating = totalSubmissions > 0 
    ? (feedback.reduce((sum, item) => sum + (item.avg_rating || 0), 0) / feedback.filter(i => i.avg_rating).length).toFixed(1)
    : 0;

  const lastSubmission = feedback.length > 0 ? new Date(feedback[0].submitted_at).toLocaleDateString() : 'N/A';

  const columns = [
    {
      header: 'Date',
      accessorKey: 'submitted_at',
      cell: (row) => <div className="text-gray-900 font-medium">{new Date(row.submitted_at).toLocaleDateString()}</div>
    },
    {
      header: 'Average Rating',
      accessorKey: 'avg_rating',
      cell: (row) => <RatingBadge value={row.avg_rating} />
    },
    {
      header: 'Visibility',
      accessorKey: 'is_anonymous',
      cell: (row) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${row.is_anonymous ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-700'}`}>
          {row.is_anonymous ? 'Anonymous' : 'Public'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500">Manage and track your feedback submissions.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Submissions" value={totalSubmissions} icon={MessageSquare} />
        <StatCard label="Average Rating Given" value={isNaN(avgRating) ? 'N/A' : `${avgRating} ★`} icon={Star} />
        <StatCard label="Last Submission Date" value={lastSubmission} icon={Calendar} />
      </div>

      {loading ? (
        <DataTable columns={columns} loading={true} />
      ) : feedback.length === 0 ? (
        <EmptyState 
          icon={FileText}
          title="No feedback submissions yet"
          message="You haven't submitted any feedback yet. Start sharing your thoughts to see them here."
          action={
            <Link to="/feedback/new" className="inline-flex justify-center items-center px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-all">
              Submit New Feedback
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-display font-semibold text-gray-900">Your History</h2>
            <Link to="/feedback/new" className="text-sm font-semibold text-primary-600 hover:text-primary-700">Submit New &rarr;</Link>
          </div>
          <DataTable columns={columns} data={feedback} />
        </div>
      )}
    </div>
  );
};
