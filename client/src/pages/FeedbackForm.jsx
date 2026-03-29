import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { FullScreenLoader, Spinner } from '../components/ui/Spinner';
import { StarRating } from '../components/ui/StarRating';
import { Send, Star, FileText, List as ListIcon } from 'lucide-react';
import Confetti from 'react-dom-confetti';

const confettiConfig = {
  angle: 90,
  spread: 360,
  startVelocity: 40,
  elementCount: 70,
  dragFriction: 0.12,
  duration: 3000,
  stagger: 3,
  width: "10px",
  height: "10px",
  perspective: "500px",
  colors: ["#6366f1", "#4f46e5", "#c7d2fe"]
};

export const FeedbackForm = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [answers, setAnswers] = useState({});
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await api.get('/questions/active');
        setQuestions(data);
        
        // init answers obj
        const initAns = {};
        data.forEach(q => initAns[q.id] = null);
        setAnswers(initAns);
      } catch (err) {
        showToast({ type: 'error', title: 'Error', message: 'Failed to load questions.' });
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  if (loading) return <FullScreenLoader />;

  if (success) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <Confetti active={success} config={confettiConfig} />
            <span className="text-4xl">🎉</span>
          </div>
        </div>
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Thank you!</h2>
        <p className="text-gray-600 mb-8 text-lg">Your feedback helps us continuously improve.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition"
        >
          View my submissions
        </button>
      </div>
    );
  }

  // Calculate progress
  const answeredCount = questions.filter(q => {
    const ans = answers[q.id];
    if (q.required) {
      return ans !== null && ans !== '' && ans !== undefined;
    }
    return true; // if not required, it counts towards "valid" automatically for progress? 
    // Wait, better measure: how many total required answered? 
  }).length;
  // let's do simple progress based on total answered vs total
  const explicitlyAnswered = questions.filter(q => answers[q.id] !== null && answers[q.id] !== '').length;
  const progressPercent = questions.length > 0 ? (explicitlyAnswered / questions.length) * 100 : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required
    const missing = questions.find(q => q.required && (answers[q.id] === null || answers[q.id] === ''));
    if (missing) {
      showToast({ type: 'warning', title: 'Incomplete', message: 'Please answer all required questions.' });
      return;
    }

    try {
      setSubmitting(true);
      const responses = questions.map(q => ({
        questionId: q.id,
        rating: q.type === 'rating' ? answers[q.id] : null,
        textAnswer: q.type === 'text' ? answers[q.id] : null,
        choice: q.type === 'choice' ? answers[q.id] : null,
      }));

      await api.post('/feedback', { isAnonymous, responses });
      setSuccess(true);
    } catch (err) {
      showToast({ type: 'error', title: 'Submission failed', message: 'Something went wrong.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
          <div className="h-full bg-primary-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
        
        <div className="flex justify-between items-start mb-2 mt-4">
          <h1 className="text-3xl font-display font-bold text-gray-900">Share your thoughts</h1>
        </div>
        <p className="text-gray-500 mb-6">We value your honesty. Let us know how we did.</p>
        
        <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
          <input 
            type="checkbox" 
            id="anonymous" 
            checked={isAnonymous} 
            onChange={e => setIsAnonymous(e.target.checked)}
            className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-600 focus:ring-2"
          />
          <label htmlFor="anonymous" className="ml-3 font-medium text-gray-700 select-none cursor-pointer">
            Submit Anonymously
            <p className="text-sm font-normal text-gray-400">Hide your name and email from this submission.</p>
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 transform transition-all focus-within:ring-2 focus-within:ring-primary-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-start">
              <span className="text-primary-600 mr-2 flex-shrink-0 mt-0.5">
                {q.type === 'rating' ? <Star className="w-5 h-5" /> : 
                 q.type === 'text' ? <FileText className="w-5 h-5" /> : <ListIcon className="w-5 h-5" />}
              </span>
              <span>{q.text} {q.required ? <span className="text-red-500 ml-1">*</span> : null}</span>
            </h3>
            
            <div className="pl-7">
              {q.type === 'rating' && (
                <div className="inline-block p-1 bg-gray-50 rounded-xl border border-gray-100">
                  <StarRating 
                    value={answers[q.id] || 0}
                    onChange={v => setAnswers(prev => ({ ...prev, [q.id]: v }))}
                  />
                </div>
              )}
              
              {q.type === 'text' && (
                <div>
                  <textarea
                    rows={4}
                    value={answers[q.id] || ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-shadow resize-none bg-gray-50"
                    placeholder="Type your answer here..."
                    maxLength={1000}
                  />
                  <div className="text-right mt-1 text-xs text-gray-400">
                    {answers[q.id]?.length || 0} / 1000
                  </div>
                </div>
              )}

              {q.type === 'choice' && q.options && (
                <div className="space-y-3">
                  {q.options.map((opt, oIdx) => (
                    <label key={oIdx} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors has-[:checked]:border-primary-600 has-[:checked]:bg-primary-50">
                      <input 
                        type="radio" 
                        name={q.id} 
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-600 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-900">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-xl shadow-lg shadow-primary-500/20 text-white bg-primary-600 hover:bg-primary-700 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {submitting ? <Spinner size={20} className="text-white" /> : <><Send className="w-5 h-5 mr-3" /> Submit Feedback</>}
          </button>
        </div>
      </form>
    </div>
  );
};
