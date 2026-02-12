
import React, { useState, useCallback, useMemo } from 'react';
import { WorkoutPlan, DayWorkout, WorkoutLog } from '../types';
import { explainExercise, adjustWorkoutPlan } from '../services/geminiService';

interface WorkoutDisplayProps {
  plan: WorkoutPlan;
  logs: WorkoutLog[];
  onLogWorkout?: (log: WorkoutLog) => void;
  onUndoLog?: (dayTitle: string, planName: string) => void;
  onUpdatePlan?: (updatedPlan: WorkoutPlan) => void;
}

interface ExplanationState {
  name: string;
  execution: string;
  tip: string;
  loading: boolean;
}

const MOTIVATIONAL_MESSAGES = [
  "Incrível! Mais um dia vencido. O progresso é real! 🚀",
  "Missão cumprida! Seu eu do futuro vai te agradecer por hoje. 💪",
  "Excelente trabalho! Consistência é a chave para o sucesso. 🔥",
  "Você é sua única competição, e hoje você ganhou! 🎯",
  "Foco total! Cada treino te deixa mais perto do seu objetivo. 🏆"
];

const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ plan, logs, onLogWorkout, onUndoLog, onUpdatePlan }) => {
  const [explanation, setExplanation] = useState<ExplanationState | null>(null);
  const [motivation, setMotivation] = useState<string | null>(null);
  
  // Identifica quais dias foram concluídos na semana atual (desde segunda-feira)
  const finishedDays = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const startOfThisWeek = new Date(now.setDate(diff));
    startOfThisWeek.setHours(0, 0, 0, 0);
    
    const finished = new Set<string>();
    (logs || []).forEach(log => {
      if (log.planName === plan.planName && new Date(log.date) >= startOfThisWeek) {
        finished.add(log.dayTitle);
      }
    });
    return finished;
  }, [logs, plan.planName]);

  const [adjustmentText, setAdjustmentText] = useState('');
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustError, setAdjustError] = useState<string | null>(null);

  const handleExerciseClick = useCallback(async (name: string) => {
    setExplanation({ name, execution: '', tip: '', loading: true });
    try {
      const result = await explainExercise(name);
      setExplanation({ name, ...result, loading: false });
    } catch {
      setExplanation(null);
    }
  }, []);

  const handleFinishDay = useCallback((day: DayWorkout) => {
    const durationStr = plan.weeklyDivision?.match(/\d+/)?.[0] || "45";
    const durationMinutes = parseInt(durationStr);

    const totalSets = (day.exercises || []).reduce((acc, ex) => {
      const match = (ex.sets || "").match(/\d+/);
      return acc + (match ? parseInt(match[0]) : 0);
    }, 0);

    const log: WorkoutLog = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      planName: plan.planName,
      dayTitle: day.dayTitle,
      exercises: (day.exercises || []).map(e => e.name),
      durationMinutes: isNaN(durationMinutes) ? 45 : durationMinutes,
      totalSets: totalSets
    };

    if (onLogWorkout) onLogWorkout(log);
    
    const randomMsg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
    setMotivation(randomMsg);
  }, [plan, onLogWorkout]);

  const handleUndoDay = useCallback((day: DayWorkout) => {
    if (onUndoLog) {
      onUndoLog(day.dayTitle, plan.planName);
    }
  }, [plan.planName, onUndoLog]);

  const handleAdjust = useCallback(async () => {
    if (!adjustmentText.trim() || isAdjusting) return;
    
    setIsAdjusting(true);
    setAdjustError(null);
    try {
      const updatedPlan = await adjustWorkoutPlan(plan, adjustmentText);
      if (onUpdatePlan) {
        onUpdatePlan(updatedPlan);
        setAdjustmentText('');
      }
    } catch (err: any) {
      setAdjustError(err.message);
    } finally {
      setIsAdjusting(false);
    }
  }, [plan, adjustmentText, isAdjusting, onUpdatePlan]);

  const closeModal = useCallback(() => setExplanation(null), []);
  const closeMotivation = useCallback(() => setMotivation(null), []);

  if (!plan || !plan.workouts) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="bg-slate-800/60 p-6 rounded-3xl border border-slate-700 shadow-xl animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-orange-600/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Ajustes & Personalização</h3>
        </div>
        
        <div className="flex gap-2">
          <input 
            type="text"
            value={adjustmentText}
            onChange={(e) => setAdjustmentText(e.target.value)}
            disabled={isAdjusting}
            placeholder="Ex: 'Troque o Supino por Peck Deck'..."
            className="flex-grow bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-orange-500 transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleAdjust()}
          />
          <button 
            onClick={handleAdjust}
            disabled={isAdjusting || !adjustmentText.trim()}
            className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${
              isAdjusting || !adjustmentText.trim() 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg'
            }`}
          >
            {isAdjusting ? 'Processando...' : 'Ajustar'}
          </button>
        </div>
        {adjustError && <p className="text-[10px] text-red-400 mt-2 font-black uppercase tracking-tighter">{adjustError}</p>}
      </div>

      <div className="bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-700">
        <h2 className="text-2xl font-black text-white mb-2 tracking-tight flex items-center">
          <span className="mr-3 text-orange-500">📅</span> Divisão do treino:
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed font-medium">
          {plan.weeklyDivision}
        </p>
      </div>

      <div className="space-y-12">
        {(plan.workouts || []).map((day, idx) => {
          const isDone = finishedDays.has(day.dayTitle);
          return (
            <div key={idx} className={`bg-slate-800 rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500 ${isDone ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'border-slate-700 shadow-xl'}`}>
              <div className={`p-6 border-b flex justify-between items-center ${isDone ? 'bg-emerald-900/20 border-emerald-800/50' : 'bg-slate-700/40 border-slate-600'}`}>
                <h3 className="text-xl font-black text-white flex items-center">
                  <span className={`${isDone ? 'text-emerald-500' : 'text-orange-500'} mr-3`}>
                    {isDone ? '✅' : '🔹'}
                  </span>
                  {day.dayTitle}
                  {isDone && <span className="ml-3 text-[10px] bg-emerald-500 text-white px-2 py-1 rounded-full uppercase tracking-tighter">Concluído</span>}
                </h3>
              </div>
              
              <div className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-900/40 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                        <th className="px-6 py-4">Exercício</th>
                        <th className="px-6 py-4">Esforço</th>
                        <th className="px-6 py-4">Descanso</th>
                        <th className="px-6 py-4">Dica</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {(day.exercises || []).map((ex, eIdx) => (
                        <tr key={eIdx} className="hover:bg-slate-700/20 transition-colors">
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => handleExerciseClick(ex.name)}
                              className="text-left font-bold text-white text-sm hover:text-orange-500 underline decoration-slate-600 underline-offset-4 transition-all"
                            >
                              {ex.name}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-orange-400 font-mono font-bold text-xs uppercase">
                            {ex.sets} x {ex.reps}
                          </td>
                          <td className="px-6 py-4 text-slate-400 text-xs">
                            {ex.rest}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400 italic leading-relaxed">
                            "{ex.tip}"
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-8 bg-slate-900/30 flex justify-center gap-4">
                {!isDone ? (
                  <button
                    onClick={() => handleFinishDay(day)}
                    className="flex items-center gap-3 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transform hover:-translate-y-1"
                  >
                    ✔️ Finalizar o dia do treino
                  </button>
                ) : (
                  <>
                    <div className="flex items-center gap-3 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest bg-slate-800 text-slate-500 border border-slate-700 cursor-default">
                      Treino Registrado
                    </div>
                    <button
                      onClick={() => handleUndoDay(day)}
                      className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all bg-red-600 hover:bg-red-500 text-white shadow-lg transform hover:-translate-y-1"
                    >
                      Retirar
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {plan.warmup && plan.warmup.length > 0 && (
        <div className="bg-slate-800/50 border-2 border-dashed border-slate-700 p-8 rounded-3xl">
          <h4 className="text-xl font-black text-white mb-4 flex items-center">
             <span className="mr-3 text-orange-500">🔥</span> Aquecimento (Antes do Treino):
          </h4>
          <div className="space-y-2">
            {plan.warmup.map((step, idx) => (
              <p key={idx} className="text-slate-300 text-sm flex items-start">
                <span className="text-orange-500 mr-2">•</span> {step}
              </p>
            ))}
          </div>
        </div>
      )}

      {plan.stretching && plan.stretching.length > 0 && (
        <div className="bg-slate-800/50 border-2 border-dashed border-slate-700 p-8 rounded-3xl">
          <h4 className="text-xl font-black text-white mb-4 flex items-center">
             <span className="mr-3 text-orange-500">🧘</span> Alongamento (Após o Treino):
          </h4>
          <div className="space-y-2">
            {plan.stretching.map((step, idx) => (
              <p key={idx} className="text-slate-300 text-sm flex items-start">
                <span className="text-orange-500 mr-2">•</span> {step}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="bg-orange-600/10 border-2 border-dashed border-orange-500/20 p-8 rounded-3xl">
        <h4 className="text-xl font-black text-white mb-4 flex items-center">
           <span className="mr-3 text-orange-500">⚠️</span> Observações finais:
        </h4>
        <div className="space-y-2">
          {(plan.safetyTips || []).map((tip, sIdx) => (
            <p key={sIdx} className="text-slate-300 text-sm flex items-start">
              <span className="text-orange-500 mr-2">•</span> {tip}
            </p>
          ))}
        </div>
      </div>

      {motivation && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={closeMotivation}>
          <div className="bg-slate-800 border-2 border-emerald-500/50 w-full max-w-sm rounded-[2.5rem] p-10 text-center relative shadow-2xl animate-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Treino Finalizado!</h3>
            <p className="text-slate-300 text-lg font-medium mb-8">
              {motivation}
            </p>
            <button onClick={closeMotivation} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl transition-all uppercase text-xs tracking-widest">
              Continuar Focado
            </button>
          </div>
        </div>
      )}

      {explanation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-3xl p-8 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-6 right-6 text-slate-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {explanation.loading ? (
              <div className="py-12 text-center text-slate-400 font-bold">Consultando Treinador...</div>
            ) : (
              <div>
                <h3 className="text-2xl font-black text-white mb-6">🔸 {explanation.name}</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-slate-500 text-[10px] font-black uppercase mb-2">Execução:</h4>
                    <p className="text-white text-sm leading-relaxed">{explanation.execution}</p>
                  </div>
                  <div className="bg-orange-600/10 p-4 rounded-xl border border-orange-600/20 italic">
                    <p className="text-orange-100 text-sm">💡 {explanation.tip}</p>
                  </div>
                </div>
                <button onClick={closeModal} className="w-full mt-8 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition-all">Entendi!</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutDisplay;
