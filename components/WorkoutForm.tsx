
import React, { useState, useEffect } from 'react';
import { ExperienceLevel, WorkoutGoal, Gender } from '../types';

interface WorkoutFormProps {
  onSubmit: (gender: Gender, experience: ExperienceLevel, goal: WorkoutGoal, muscles: string, days: number, time: string, limitations: string) => void;
  loading: boolean;
  initialGender?: Gender;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onSubmit, loading, initialGender }) => {
  const [gender, setGender] = useState<Gender>(initialGender || Gender.MALE);
  const [experience, setExperience] = useState<ExperienceLevel>(ExperienceLevel.BEGINNER);
  const [goal, setGoal] = useState<WorkoutGoal>(WorkoutGoal.HEALTHY);
  const [muscles, setMuscles] = useState('');
  const [days, setDays] = useState(3);
  const [time, setTime] = useState('60 minutos');
  const [limitations, setLimitations] = useState('');

  // Sincroniza o gênero se o perfil for alterado externamente
  useEffect(() => {
    if (initialGender) {
      setGender(initialGender);
    }
  }, [initialGender]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(gender, experience, goal, muscles.trim(), days, time, limitations.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-700 max-w-2xl mx-auto animate-in fade-in zoom-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-white tracking-tight">Prepare seu Plano</h2>
        <span className="bg-orange-600/20 text-orange-500 text-[10px] font-black px-3 py-1 rounded-full border border-orange-500/30">VERSÃO PRO</span>
      </div>
      
      {/* Gênero */}
      <div className="mb-8">
        <label className="block text-xs font-black uppercase tracking-widest mb-4 text-slate-400">Gênero (Integrado com Bio)</label>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(Gender).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`py-4 px-2 rounded-2xl border-2 transition-all text-xs font-black uppercase tracking-wider ${
                gender === g 
                ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/20 translate-y-[-2px]' 
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Experiência */}
      <div className="mb-8">
        <label className="block text-xs font-black uppercase tracking-widest mb-4 text-slate-400">Nível de Experiência</label>
        <div className="grid grid-cols-3 gap-3">
          {Object.values(ExperienceLevel).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setExperience(level)}
              className={`py-4 px-2 rounded-2xl border-2 transition-all text-xs font-black uppercase tracking-wider ${
                experience === level 
                ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/20 translate-y-[-2px]' 
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Objetivo */}
      <div className="mb-8">
        <label className="block text-xs font-black uppercase tracking-widest mb-4 text-slate-400">Objetivo</label>
        <select 
          value={goal}
          onChange={(e) => setGoal(e.target.value as WorkoutGoal)}
          className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-4 px-5 text-white text-sm font-bold focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer"
        >
          {Object.values(WorkoutGoal).map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Prioridade Muscular */}
      <div className="mb-8">
        <label className="block text-xs font-black uppercase tracking-widest mb-4 text-slate-400">Músculos Prioritários (Opcional)</label>
        <input 
          type="text"
          placeholder="Ex: Peito, Pernas, Braços..."
          value={muscles}
          onChange={(e) => setMuscles(e.target.value)}
          className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-4 px-5 text-white text-sm font-bold focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Dias */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-4 text-slate-400">Frequência: <span className="text-orange-500">{days} Dias/Semana</span></label>
          <input 
            type="range" 
            min="1" 
            max="6" 
            step="1" 
            value={days} 
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>

        {/* Tempo */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-4 text-slate-400">Duração Desejada</label>
          <select 
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-4 px-5 text-white text-sm font-bold focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all cursor-pointer"
          >
            <option value="30 minutos">Rápido (30 min)</option>
            <option value="45 minutos">Padrão (45 min)</option>
            <option value="60 minutos">Intenso (60 min)</option>
            <option value="90 minutos">Completo (90 min)</option>
          </select>
        </div>
      </div>

      <div className="mb-10">
        <label className="block text-xs font-black uppercase tracking-widest mb-4 text-slate-400">Observações ou Limitações</label>
        <textarea 
          placeholder="Ex: Lesão no ombro, pouco equipamento disponível..."
          value={limitations}
          onChange={(e) => setLimitations(e.target.value)}
          className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-4 px-5 text-white text-sm font-bold focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none min-h-[100px] transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl uppercase tracking-[0.1em] ${
          loading 
          ? 'bg-slate-700 cursor-not-allowed text-slate-500' 
          : 'bg-orange-600 hover:bg-orange-500 text-white transform hover:translate-y-[-4px] active:translate-y-0'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processando Estratégia...
          </span>
        ) : 'Gerar Meu Treino'}
      </button>
    </form>
  );
};

export default WorkoutForm;
