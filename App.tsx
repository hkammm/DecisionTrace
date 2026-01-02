
import React, { useState, useEffect, useCallback } from 'react';
import { Decision, User, AIInsight, DecisionReview } from './types';
import { storageService } from './services/storage';
import { geminiService } from './services/gemini';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DecisionForm from './components/DecisionForm';
import DecisionCard from './components/DecisionCard';
import ReviewModal from './components/ReviewModal';
import AuthModal from './components/AuthModal';

type View = 'dashboard' | 'create' | 'history' | 'auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('auth');
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [insights, setInsights] = useState<AIInsight | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await storageService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setView('dashboard');
          await loadData();
        }
      } catch {
        // User not authenticated
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const loadData = useCallback(async () => {
    try {
      const data = await storageService.getDecisions();
      setDecisions(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Failed to load decisions:', error);
    }
  }, []);

  // AI Insights Trigger
  useEffect(() => {
    const fetchAI = async () => {
      const reviewedCount = decisions.filter(d => d.review).length;
      if (reviewedCount >= 1) {
        setLoadingAI(true);
        try {
          const result = await geminiService.analyzeDecisionPatterns(decisions);
          setInsights(result);
        } catch (error) {
          console.error('Failed to fetch AI insights:', error);
        } finally {
          setLoadingAI(false);
        }
      }
    };
    if (view === 'dashboard' && decisions.length > 0) {
      fetchAI();
    }
  }, [view, decisions]);

  const handleAuthSuccess = async () => {
    const currentUser = await storageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setView('dashboard');
      await loadData();
    }
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    setView('auth');
    setDecisions([]);
    setInsights(null);
  };

  const handleCreateDecision = async (newDecision: Omit<Decision, 'id' | 'userId' | 'createdAt'>) => {
    try {
      await storageService.saveDecision(newDecision);
      await loadData();
      setView('dashboard');
    } catch (error) {
      console.error('Failed to create decision:', error);
    }
  };

  const handleCompleteReview = async (review: DecisionReview) => {
    if (!selectedReview) return;
    try {
      await storageService.addReview(selectedReview.id, review);
      await loadData();
      setSelectedReview(null);
      setInsights(null);
    } catch (error) {
      console.error('Failed to add review:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (view === 'auth') {
    return <AuthModal onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      onNavigate={setView}
      currentView={view}
    >
      {view === 'dashboard' && (
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight">Executive Dashboard</h1>
              <p className="text-slate-500 font-medium">Monitoring reasoning patterns across {decisions.length} decisions.</p>
            </div>
            <button
              onClick={() => setView('create')}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              + Log New Decision
            </button>
          </div>

          <Dashboard decisions={decisions} insights={insights} loadingAI={loadingAI} />

          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Pending Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {decisions
                .filter(d => !d.review && new Date(d.targetDecisionDate) <= new Date())
                .map(d => (
                  <DecisionCard key={d.id} decision={d} onReview={setSelectedReview} />
                ))}
              {decisions.filter(d => !d.review && new Date(d.targetDecisionDate) <= new Date()).length === 0 && (
                <div className="col-span-full py-12 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 bg-white">
                  <span className="text-3xl mb-2">💤</span>
                  <p className="font-bold">No decisions ready for review yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {view === 'create' && (
        <DecisionForm 
          onSave={handleCreateDecision} 
          onCancel={() => setView('dashboard')} 
        />
      )}

      {view === 'history' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Decision Archives</h1>
            <div className="flex gap-2">
              <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none">
                <option>All Contexts</option>
                <option>Career</option>
                <option>Business</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decisions.map(d => (
              <DecisionCard 
                key={d.id} 
                decision={d} 
                onReview={setSelectedReview}
              />
            ))}
          </div>
        </div>
      )}

      {selectedReview && (
        <ReviewModal
          decision={selectedReview}
          onSave={handleCompleteReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </Layout>
  );
};

export default App;
