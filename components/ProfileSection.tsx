
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { UserProfile, Goal, Gender } from '../types';
import { calculateBMI, calculateTMB } from '../core/workoutEngine';

interface ProfileSectionProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onClose: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, onSave, onClose }) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'imc'>('dashboard');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const healthMetrics = useMemo(() => calculateBMI(formData.weight, formData.height), [formData.weight, formData.height]);
  const caloricMetrics = useMemo(() => calculateTMB(formData.weight, formData.height, formData.age, formData.gender), [formData.weight, formData.height, formData.age, formData.gender]);

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setFormData(prev => ({ ...prev, photo: canvas.toDataURL('image/jpeg', 0.7) }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const finalData = {
      ...formData,
      bmi: healthMetrics?.bmi,
      bmiCategory: healthMetrics?.category,
      tmb: caloricMetrics?.tmb,
      dailyCalories: caloricMetrics?.dailyCalories
    };
    setTimeout(() => {
      onSave(finalData);
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(onClose, 1000);
    }, 400);
  }, [formData, healthMetrics, caloricMetrics, onSave, onClose]);

  const imcTable = [
    { range: 'Abaixo de 18,5', label: 'Abaixo do peso', color: 'text-blue-400' },
    { range: '18,5 a 24,9', label: 'Peso normal', color: 'text-emerald-400' },
    { range: '25 a 29,9', label: 'Sobrepeso', color: 'text-yellow-400' },
    { range: '30 a 34,9', label: 'Obesidade grau I', color: 'text-orange-400' },
    { range: '35 a 39,9', label: 'Obesidade grau II', color: 'text-red-400' },
    { range: '40+', label: 'Obesidade grau III', color: 'text-red-600' },
  ];

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500 pb-20">
      <div className="bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-700 relative overflow-hidden p-2">
        <div className="flex p-2 bg-slate-900/50 rounded-full mb-6 mx-4 mt-6 border border-slate-700">
          <button onClick={() => setActiveSubTab('dashboard')} className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'dashboard' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500'}`}>Dashboard</button>
          <button onClick={() => setActiveSubTab('imc')} className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'imc' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500'}`}>IMC</button>
        </div>

        {isSaved && (
          <div className="absolute inset-0 bg-emerald-600 flex flex-col items-center justify-center z-50 animate-in fade-in duration-300">
            <h3 className="text-xl font-black text-white uppercase tracking-widest">Perfil Atualizado!</h3>
          </div>
        )}

        {activeSubTab === 'dashboard' ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="flex flex-col items-center">
              <div onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-full border-4 border-orange-600 bg-slate-900 overflow-hidden cursor-pointer">
                {formData.photo ? <img src={formData.photo} alt="P" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-700 text-2xl">📸</div>}
              </div>
              <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
              <p className="text-[9px] font-black uppercase text-slate-500 mt-2">Toque para alterar foto</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[Gender.MALE, Gender.FEMALE].map(g => (
                <button key={g} type="button" onClick={() => setFormData(prev => ({ ...prev, gender: g }))} className={`py-3 rounded-xl border-2 font-black uppercase text-[10px] ${formData.gender === g ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>{g}</button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Idade', field: 'age', unit: 'anos' },
                { label: 'Altura', field: 'height', unit: 'cm' },
                { label: 'Peso', field: 'weight', unit: 'kg' }
              ].map(f => (
                <div key={f.field}>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">{f.label} ({f.unit})</label>
                  <input type="number" value={formData[f.field as keyof UserProfile] as any} onChange={e => setFormData(p => ({ ...p, [f.field]: e.target.value }))} className="w-full bg-slate-900 border-2 border-slate-800 rounded-xl py-3 px-4 text-white font-bold outline-none focus:border-orange-500 transition-colors" />
                </div>
              ))}
            </div>

            {caloricMetrics && (
              <div className="bg-orange-600/10 border-2 border-dashed border-orange-500/30 p-6 rounded-3xl text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Estimativa de Gasto Calórico Diário</p>
                <p className="text-3xl font-black text-white">{caloricMetrics.dailyCalories} <span className="text-sm text-orange-500">kcal</span></p>
              </div>
            )}

            <button type="submit" disabled={isSaving} className="w-full py-5 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl shadow-xl uppercase text-xs tracking-[0.2em] transition-all transform active:scale-95">{isSaving ? 'Salvando...' : 'Salvar Perfil'}</button>
          </form>
        ) : (
          <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
            {healthMetrics ? (
              <div className="text-center">
                <div className="bg-slate-900/80 p-8 rounded-[2rem] border-2 border-orange-500/30 mb-8">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Seu IMC Atual</p>
                  <p className="text-7xl font-black text-white tracking-tighter mb-2">{healthMetrics.bmi}</p>
                  <p className="text-xl font-black text-orange-500 uppercase tracking-widest">{healthMetrics.category}</p>
                </div>

                <div className="bg-slate-900/40 rounded-3xl border border-slate-700 overflow-hidden mb-6">
                  <div className="bg-slate-700/50 py-3 px-4 border-b border-slate-700">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Classificação do IMC (OMS)</h4>
                  </div>
                  <div className="p-2">
                    <table className="w-full text-[11px] text-left">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-800">
                          <th className="px-3 py-2 font-black uppercase">Intervalo</th>
                          <th className="px-3 py-2 font-black uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {imcTable.map((row, i) => (
                          <tr key={i} className={healthMetrics.category === row.label ? 'bg-orange-500/10' : ''}>
                            <td className="px-3 py-2 font-bold text-slate-300">{row.range}</td>
                            <td className={`px-3 py-2 font-black uppercase ${row.color}`}>{row.label}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl">
                  <p className="text-slate-400 text-[10px] leading-relaxed italic">
                    "O IMC é apenas uma estimativa geral. Atletas podem ter valores maiores devido à massa muscular, que pesa mais que a gordura mas é sinal de saúde."
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 font-bold uppercase text-xs">Preencha seu peso e altura no dashboard para calcular seu IMC.</p>
              </div>
            )}
            <button onClick={() => setActiveSubTab('dashboard')} className="w-full py-4 bg-slate-700 text-white font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-slate-600 transition-colors">Voltar ao Início</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
