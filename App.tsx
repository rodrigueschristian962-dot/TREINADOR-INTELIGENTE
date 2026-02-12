
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ExperienceLevel, WorkoutGoal, WorkoutPlan, Gender, WorkoutHistoryEntry, UserProfile, WorkoutLog } from './types';
import { generateWorkoutPlan } from './services/geminiService';
import WorkoutForm from './components/WorkoutForm';
import WorkoutDisplay from './components/WorkoutDisplay';
import SafetyBanner from './components/SafetyBanner';
import ProfileSection from './components/ProfileSection';
import ProgressDashboard from './components/ProgressDashboard';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [history, setHistory] = useState<WorkoutHistoryEntry[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'history' | 'progress' | 'profile'>('create');
  const [error, setError] = useState<string | null>(null);
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const defaultProfile: UserProfile = { 
      name: 'Atleta', age: '', height: '', weight: '', gender: Gender.MALE, 
      goals: [], photo: '', weightHistory: [] 
    };
    try {
      const saved = localStorage.getItem('user_profile');
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('workout_history');
      const savedLogs = localStorage.getItem('workout_logs');
      if (savedHistory) setHistory(JSON.parse(savedHistory) || []);
      if (savedLogs) setWorkoutLogs(JSON.parse(savedLogs) || []);
    } catch (e) {
      console.error("Storage load error", e);
    }
  }, []);

  const handleSaveProfile = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem('user_profile', JSON.stringify(profile));
    } catch (e) {
      console.error("Save profile error", e);
    }
  }, []);

  const handleLogWorkout = useCallback((log: WorkoutLog) => {
    setWorkoutLogs(prev => {
      const updated = [log, ...prev].slice(0, 100);
      try {
        localStorage.setItem('workout_logs', JSON.stringify(updated));
      } catch (e) {
        console.error("Save logs error", e);
      }
      return updated;
    });
  }, []);

  const handleUndoLog = useCallback((dayTitle: string, planName: string) => {
    setWorkoutLogs(prev => {
      const index = prev.findIndex(log => log.dayTitle === dayTitle && log.planName === planName);
      if (index === -1) return prev;
      const updated = prev.filter((_, i) => i !== index);
      try {
        localStorage.setItem('workout_logs', JSON.stringify(updated));
      } catch (e) {
        console.error("Undo log error", e);
      }
      return updated;
    });
  }, []);

  const handleUpdatePlan = useCallback((updatedPlan: WorkoutPlan) => {
    setWorkoutPlan(updatedPlan);
    setHistory(prev => {
      const updated = prev.map(entry => entry.treinoGerado.id === updatedPlan.id ? { ...entry, treinoGerado: updatedPlan } : entry);
      try {
        localStorage.setItem('workout_history', JSON.stringify(updated));
      } catch (e) {
        console.error("Update plan history error", e);
      }
      return updated;
    });
  }, []);

  const finalizeWorkout = useCallback((plan: WorkoutPlan, gender: Gender, experience: ExperienceLevel, goal: WorkoutGoal, muscles: string, days: number, time: string) => {
    setWorkoutPlan(plan);
    
    if (userProfile.gender !== gender) {
      handleSaveProfile({ ...userProfile, gender });
    }

    const newEntry: WorkoutHistoryEntry = {
      id: crypto.randomUUID(),
      dataCriacao: new Date().toLocaleString('pt-BR'),
      genero: gender,
      nivel: experience,
      objetivo: goal,
      musculosPrioritarios: muscles || 'Geral',
      dias: days,
      tempo: time,
      treinoGerado: plan
    };

    setHistory(prev => {
      const updated = [newEntry, ...prev.filter(item => item.id !== newEntry.id)].slice(0, 20);
      try {
        localStorage.setItem('workout_history', JSON.stringify(updated));
      } catch (e) {
        console.error("Save history entry error", e);
      }
      return updated;
    });

    setTimeout(() => {
      document.getElementById('workout-result')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  }, [userProfile, handleSaveProfile]);

  const handleGenerateWorkout = async (
    gender: Gender, experience: ExperienceLevel, goal: WorkoutGoal, 
    muscles: string, days: number, time: string, limitations: string
  ) => {
    setLoading(true);
    setError(null);
    setWorkoutPlan(null);
    
    try {
      // The service is now 100% offline and intelligent
      const plan = await generateWorkoutPlan(gender, experience, goal, muscles, days, time, limitations);
      finalizeWorkout(plan, gender, experience, goal, muscles, days, time);
    } catch (err: any) {
      console.error("Workout generation error:", err);
      setError("Ocorreu um erro ao processar seu treino. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const showStatsTabs = useMemo(() => history.length > 0 || workoutLogs.length > 0 || !!workoutPlan, [history.length, workoutLogs.length, workoutPlan]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100 selection:bg-orange-500/30">
      <SafetyBanner />
      
      <header className="py-12 px-4 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
          TREINO <span className="text-orange-500">PRO</span>
        </h1>
        {userProfile.bmi && (
          <div className="inline-flex items-center bg-slate-800/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700 shadow-xl">
            <span className="text-[9px] font-black uppercase text-slate-500 mr-2">Condição:</span>
            <span className="text-[11px] font-black text-orange-500 uppercase tracking-tight">{userProfile.bmiCategory}</span>
          </div>
        )}
      </header>

      <main className="flex-grow px-4 pb-24 max-w-6xl mx-auto w-full">
        <div className="flex flex-wrap justify-center mb-10 gap-4">
          <button 
            onClick={() => { setActiveTab('create'); setError(null); }}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all border-2 ${activeTab === 'create' ? 'bg-orange-600 border-orange-500 text-white shadow-xl shadow-orange-900/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
          >
            Novo Treino
          </button>
          
          {showStatsTabs && (
            <>
              <button 
                onClick={() => { setActiveTab('history'); setError(null); }}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all border-2 ${activeTab === 'history' ? 'bg-orange-600 border-orange-500 text-white shadow-xl shadow-orange-900/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
              >
                Atividade
              </button>
              <button 
                onClick={() => { setActiveTab('progress'); setError(null); }}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all border-2 ${activeTab === 'progress' ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-900/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
              >
                📊 Progresso
              </button>
              <button 
                onClick={() => { setActiveTab('profile'); setError(null); }}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all border-2 ${activeTab === 'profile' ? 'bg-orange-600 border-orange-500 text-white shadow-xl shadow-orange-900/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
              >
                Perfil
              </button>
            </>
          )}
        </div>

        {error && (
          <div className="mb-8 p-4 bg-orange-900/20 border border-orange-500/30 rounded-2xl text-orange-200 text-xs font-bold text-center animate-in fade-in duration-300 shadow-lg">
            <span className="mr-2">💡</span> {error}
          </div>
        )}

        {activeTab === 'profile' && <ProfileSection profile={userProfile} onSave={handleSaveProfile} onClose={() => setActiveTab('create')} />}
        
        {activeTab === 'progress' && <ProgressDashboard logs={workoutLogs} currentPlan={workoutPlan} />}

        {activeTab === 'history' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {workoutLogs.length > 0 && (
              <section>
                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 px-2">Histórico de Conclusão</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {workoutLogs.map((log) => (
                    <div key={log.id} className="bg-slate-900/50 p-6 rounded-3xl border border-slate-700">
                      <p className="text-[9px] font-black text-emerald-500 uppercase mb-2">Concluído em {new Date(log.date).toLocaleString('pt-BR')}</p>
                      <h4 className="text-white font-black text-sm mb-3 uppercase tracking-tight">{log.dayTitle}</h4>
                      <p className="text-[10px] text-slate-500 mb-4">{log.planName}</p>
                      <div className="flex flex-wrap gap-1">
                        {log.exercises.slice(0, 3).map((ex, i) => (
                          <span key={i} className="bg-slate-800 text-[8px] px-2 py-0.5 rounded text-slate-400">✓ {ex}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 px-2">Planos Gerados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.length === 0 ? (
                  <div className="col-span-full py-20 text-center opacity-30 font-black uppercase tracking-widest">Nenhum plano criado</div>
                ) : (
                  history.map((entry) => (
                    <div 
                      key={entry.id} 
                      onClick={() => { setWorkoutPlan(entry.treinoGerado); setActiveTab('create'); }} 
                      className="bg-slate-800 p-6 rounded-[2rem] border-2 border-slate-700 hover:border-orange-500/50 cursor-pointer shadow-lg transition-all transform hover:scale-[1.02]"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <p className="text-[9px] font-black text-orange-500 uppercase">{entry.dataCriacao}</p>
                        <span className="bg-slate-900 text-[8px] font-black px-2 py-0.5 rounded text-slate-500">OFFLINE NATIVO</span>
                      </div>
                      <h3 className="text-xl font-black text-white mb-2 leading-tight">{entry.objetivo}</h3>
                      <div className="flex gap-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{entry.nivel}</span>
                        <span className="text-[10px] text-slate-500">•</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{entry.dias} dias</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'create' && (
          <>
            {!workoutPlan && !loading && (
              <WorkoutForm 
                onSubmit={handleGenerateWorkout} 
                loading={loading} 
                initialGender={userProfile.gender} 
              />
            )}
            {loading && (
              <div className="flex flex-col items-center justify-center py-32 animate-pulse">
                <div className="w-14 h-14 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(234,88,12,0.3)]"></div>
                <p className="text-orange-500 font-black uppercase text-xs tracking-widest">Processando sua estratégia...</p>
              </div>
            )}
            {workoutPlan && (
              <div id="workout-result" className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex justify-between items-center mb-8 bg-slate-800/40 p-4 rounded-2xl border border-slate-700">
                  <button onClick={() => setWorkoutPlan(null)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-[10px] font-black uppercase">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7"/></svg>
                    Novo Plano
                  </button>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Treino Offline Inteligente v3.0</p>
                </div>
                <WorkoutDisplay 
                  plan={workoutPlan} 
                  logs={workoutLogs}
                  onLogWorkout={handleLogWorkout}
                  onUndoLog={handleUndoLog}
                  onUpdatePlan={handleUpdatePlan}
                />
              </div>
            )}
          </>
        )}
      </main>

      <footer className="py-12 text-center text-slate-700 text-[9px] font-black uppercase tracking-[0.3em] border-t border-slate-900/50">
        Motor Local Inteligente • 100% Offline • {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
