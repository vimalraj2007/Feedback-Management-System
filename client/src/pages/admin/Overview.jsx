import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { StatCard } from '../../components/ui/StatCard';
import { RatingBadge } from '../../components/ui/RatingBadge';
import { Spinner } from '../../components/ui/Spinner';
import { Users, Star, MessageSquare, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const Overview = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trend, setTrend] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, trendRes, recentRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/analytics/trend'),
          api.get('/feedback?limit=5')
        ]);
        setSummary(sumRes.data);
        setTrend(trendRes.data);
        setRecent(recentRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-full flex items-center justify-center"><Spinner size={40} /></div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Admin Overview</h1>
        <p className="mt-2 text-sm text-gray-500">High-level metrics and recent activity.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Feedback" value={summary?.total || 0} icon={MessageSquare} />
        <StatCard label="Average Rating" value={summary?.avgRating ? `${summary.avgRating.toFixed(1)} ★` : 'N/A'} icon={Star} />
        <StatCard label="Response Rate" value={`${summary?.responseRate?.toFixed(1) || 0}%`} icon={Users} trend={5} />
        <StatCard label="Avg Score (This Wk)" value="4.2" icon={TrendingUp} trend={2} /> 
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Trend (14 days)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend.slice(-14)}>
                <XAxis dataKey="date" tick={{fontSize: 12}} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis domain={[1, 5]} hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                />
                <Line type="monotone" dataKey="avg_rating" stroke="#6366f1" strokeWidth={3} dot={{r:4, fill: '#6366f1', strokeWidth:2, stroke:'#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex-shrink-0">Recent Feedback</h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {recent.map(f => (
              <div key={f.id} className="flex items-start justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold font-display flex-shrink-0">
                    {f.is_anonymous ? 'A' : (f.user_name?.[0] || 'U')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{f.is_anonymous ? 'Anonymous User' : f.user_name}</p>
                    <p className="text-xs text-gray-500">{new Date(f.submitted_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {f.avg_rating && <RatingBadge value={f.avg_rating} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
