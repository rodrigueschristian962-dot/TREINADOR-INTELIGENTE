
import React, { useMemo } from 'react';
import { WorkoutLog, WorkoutPlan } from '../types';

interface ProgressDashboardProps {
  logs: WorkoutLog[];
  currentPlan: WorkoutPlan | null;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ logs, currentPlan }) => {
  const stats = useMemo(() => {
    const totalWorkouts = logs.length;
    
    // Soma total de exercícios realizados em todos os treinos registrados
    const totalExercises = logs.reduce((acc, log) => acc + (log.exercises?.length || 0), 0);
    
    // Soma total de séries realizadas em todos os treinos registrados
    const totalSets = logs.reduce((acc, log) => acc + (log.totalSets || 0), 0);
    
    // Cálculo do início da semana atual (Segunda-feira)
    const now = new Date();
    const day = now.getDay(); // 0 (Dom) a 6 (Sab)
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Ajuste para segunda-feira ser o dia 1
    const startOfThisWeek = new Date(now.setDate(diff));
    startOfThisWeek.setHours(0, 0, 0, 0);
    
    // Filtra logs que ocorreram desde a última segunda-feira
    const recentLogs = logs.filter(log => new Date(log.date) >= startOfThisWeek);
    
    // Conta dias únicos treinados nesta semana específica
    const uniqueDaysThisWeek = new Set(recentLogs.map(log => new Date(log.date).toDateString())).size;
    
    const weeklyGoal = currentPlan?.daysPerWeek || 3;
    const progressPercent = Math.min((uniqueDaysThisWeek / weeklyGoal) * 100, 100);
    
    return {
      totalWorkouts,
      totalExercises,
      totalSets,
      uniqueDaysThisWeek,
      weeklyGoal,
      progressPercent
    };
  }, [logs, currentPlan]);

  const isGoalReached = stats.uniqueDaysThisWeek >= stats.weeklyGoal;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-10">
      {/* Cards de Estatísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Total de Treinos</p>
          <p className="text-3xl font-black text-white">{stats.totalWorkouts}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Séries Feitas</p>
          <p className="text-3xl font-black text-orange-500">{stats.totalSets}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-lg text-center col-span-2 md:col-span-1 transform hover:scale-105 transition-transform duration-300">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Exercícios Feitos</p>
          <p className="text-3xl font-black text-emerald-500">{stats.totalExercises}</p>
        </div>
      </div>

      {/* Meta Semanal e Barra de Progresso */}
      <div className={`p-8 rounded-[2.5rem] border-2 shadow-2xl relative overflow-hidden transition-all duration-700 ${isGoalReached ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-800 border-slate-700'}`}>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Meta da Semana</h3>
            <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${isGoalReached ? 'text-emerald-400' : 'text-slate-400'}`}>
              Frequência: {stats.uniqueDaysThisWeek} de {stats.weeklyGoal} dias treinados
            </p>
          </div>
          <div className="text-right">
            <span className={`text-4xl font-black italic ${isGoalReached ? 'text-emerald-500 animate-pulse' : 'text-orange-500'}`}>
              {Math.round(stats.progressPercent)}%
            </span>
          </div>
        </div>

        {/* Barra de Progresso Animada */}
        <div className="h-8 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700 p-1.5 shadow-inner">
          <div 
            className={`h-full rounded-full transition-all duration-[1500ms] ease-out relative ${isGoalReached ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.6)]' : 'bg-gradient-to-r from-orange-700 to-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.4)]'}`}
            style={{ width: `${stats.progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
          </div>
        </div>

        {/* Mensagens de Estado e Animações */}
        <div className="mt-10">
          {isGoalReached ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl text-center animate-in zoom-in duration-700">
              <div className="text-6xl mb-6 animate-bounce">🎊</div>
              <h4 className="text-emerald-500 font-black text-2xl uppercase italic tracking-tighter">Missão Cumprida!</h4>
              <p className="text-emerald-100 text-base mt-3 font-medium leading-relaxed">
                Parabéns! Você completou seu objetivo semanal de {stats.weeklyGoal} dias. 
                Sua dedicação é inspiradora, continue nesse ritmo para resultados épicos! 🚀
              </p>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-dashed border-slate-700 p-8 rounded-3xl text-center">
              <div className="text-5xl mb-6 opacity-60">⏳</div>
              <h4 className="text-white font-black text-xl uppercase tracking-tight">Falta Pouco para a Vitória</h4>
              <p className="text-slate-400 text-base mt-3 font-medium leading-relaxed">
                {stats.uniqueDaysThisWeek === 0 
                  ? "Você ainda não registrou treinos nesta semana. Que tal começar sua jornada agora?" 
                  : `Bom trabalho! Você já treinou ${stats.uniqueDaysThisWeek} dia(s) nesta semana.`}
                <br />
                <span className="text-orange-500/80 font-black uppercase text-xs mt-4 block">Faltam apenas {stats.weeklyGoal - stats.uniqueDaysThisWeek} dia(s) para bater sua meta semanal.</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ESTATÍSTICAS NO BRASIL */}
      <div className="bg-blue-600/10 border-2 border-dashed border-blue-500/20 p-8 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h4 className="text-xl font-black text-white mb-6 flex items-center">
           <span className="mr-3 text-blue-500">📊</span> ESTATÍSTICAS NO BRASIL
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 group">
              <span className="text-2xl font-black text-blue-400 group-hover:scale-110 transition-transform">~22%</span>
              <p className="text-slate-300 text-xs font-bold uppercase tracking-tight">Se exercitam diariamente.</p>
            </div>
            <div className="flex items-center gap-4 group">
              <span className="text-2xl font-black text-blue-400 group-hover:scale-110 transition-transform">13%</span>
              <p className="text-slate-300 text-xs font-bold uppercase tracking-tight">Pelo menos 3x por semana.</p>
            </div>
            <div className="flex items-center gap-4 group">
              <span className="text-2xl font-black text-blue-400 group-hover:scale-110 transition-transform">08%</span>
              <p className="text-slate-300 text-xs font-bold uppercase tracking-tight">Pelo menos 2x por semana.</p>
            </div>
          </div>
          <div className="bg-slate-900/40 p-5 rounded-2xl border border-blue-500/10 shadow-inner">
            <p className="text-slate-400 text-[11px] leading-relaxed italic">
              "Quase metade dos brasileiros não pratica nenhuma atividade física regular. 
              De acordo com pesquisa nacional, apenas <span className="text-blue-400 font-bold">26,4%</span> dos adultos 
              atendem às recomendações da OMS, e apenas <span className="text-blue-400 font-bold">8,6%</span> realizam 
              fortalecimento muscular.
              <br/><br/>
              <span className="text-white font-black uppercase tracking-widest text-[10px] block border-t border-slate-700 pt-3 mt-1">Não faça parte da média. Treine e evolua!</span>"
            </p>
          </div>
        </div>
      </div>

      {/* Frase de Efeito Final */}
      <div className="py-4 text-center">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">O sucesso é a soma de pequenos esforços repetidos.</p>
      </div>
    </div>
  );
};

export default ProgressDashboard;
