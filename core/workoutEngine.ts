
import { 
  Gender, 
  ExperienceLevel, 
  WorkoutGoal, 
  WorkoutPlan, 
  DayWorkout, 
  Exercise 
} from '../types';
import { EXERCISE_DATABASE } from './exerciseDb';

/**
 * INTELLIGENT OFFLINE MOTOR v3.1
 * Generates personalized, safe, and balanced workouts based on local logic.
 */

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const normalize = (str: string) => 
  str.toLowerCase()
     .normalize("NFD")
     .replace(/[\u0300-\u036f]/g, "")
     .replace(/[^a-z0-9]/g, " ");

const getExercisesByMuscle = (muscle: string, level: ExperienceLevel, count: number): Exercise[] => {
  const available = EXERCISE_DATABASE[muscle] || [];
  const filtered = available.filter(ex => !ex.level || ex.level.includes(level));
  const pool = filtered.length > 0 ? filtered : available;
  return shuffleArray(pool).slice(0, count);
};

export const generateIntelligentWorkout = (
  gender: Gender,
  level: ExperienceLevel,
  goal: WorkoutGoal,
  days: number,
  musclesPrioritarios: string,
  time: string,
  limitations: string
): WorkoutPlan => {
  const workouts: DayWorkout[] = [];
  
  if (days <= 2) {
    for (let i = 0; i < days; i++) {
      const dayExercises: Exercise[] = [
        ...getExercisesByMuscle('Peito', level, 1),
        ...getExercisesByMuscle('Costas', level, 1),
        ...getExercisesByMuscle('Pernas', level, 1),
        ...getExercisesByMuscle('Ombros', level, 1),
        ...getExercisesByMuscle('Bíceps', level, 1),
        ...getExercisesByMuscle('Tríceps', level, 1),
        ...getExercisesByMuscle('Abdômen', level, 1),
      ];
      workouts.push({ dayTitle: `Treino ${i + 1} - Full Body`, exercises: dayExercises });
    }
  } else if (days === 3) {
    workouts.push({ 
      dayTitle: 'Treino A - Peito, Ombros e Tríceps', 
      exercises: [
        ...getExercisesByMuscle('Peito', level, 2),
        ...getExercisesByMuscle('Ombros', level, 2),
        ...getExercisesByMuscle('Tríceps', level, 2),
      ] 
    });
    workouts.push({ 
      dayTitle: 'Treino B - Costas e Bíceps', 
      exercises: [
        ...getExercisesByMuscle('Costas', level, 3),
        ...getExercisesByMuscle('Bíceps', level, 2),
        ...getExercisesByMuscle('Abdômen', level, 1),
      ] 
    });
    workouts.push({ 
      dayTitle: 'Treino C - Pernas Completo', 
      exercises: [
        ...getExercisesByMuscle('Pernas', level, 5),
      ] 
    });
  } else {
    const groups = ['Peito/Tríceps', 'Costas/Bíceps', 'Pernas', 'Ombros/Abdômen'];
    for (let i = 0; i < days; i++) {
      const currentGroup = groups[i % groups.length];
      const muscles = currentGroup.split('/');
      const dayExercises = [
        ...getExercisesByMuscle(muscles[0], level, 3),
        ...(muscles[1] ? getExercisesByMuscle(muscles[1], level, 2) : []),
      ];
      workouts.push({ dayTitle: `Treino ${String.fromCharCode(65 + i)} - ${currentGroup}`, exercises: dayExercises });
    }
  }

  if (musclesPrioritarios) {
    const priorities = musclesPrioritarios.split(',').map(m => normalize(m.trim()));
    workouts.forEach(day => {
      priorities.forEach(p => {
        let groupKey = '';
        if (p.includes('peito')) groupKey = 'Peito';
        else if (p.includes('costas') || p.includes('dorsal')) groupKey = 'Costas';
        else if (p.includes('perna')) groupKey = 'Pernas';
        else if (p.includes('ombro')) groupKey = 'Ombros';
        else if (p.includes('bicep')) groupKey = 'Bíceps';
        else if (p.includes('tricep')) groupKey = 'Tríceps';

        if (groupKey && normalize(day.dayTitle).includes(normalize(groupKey))) {
          const extra = getExercisesByMuscle(groupKey, level, 1);
          if (extra.length > 0 && !day.exercises.some(e => e.name === extra[0].name)) {
            day.exercises.push(extra[0]);
          }
        }
      });
    });
  }

  return {
    id: crypto.randomUUID(),
    planName: `Plano Inteligente ${goal}`,
    description: `Estratégia personalizada para ${level}.`,
    weeklyDivision: `${days} dias por semana - ${time}`,
    workouts,
    warmup: ["5 min Cardio leve", "Mobilidade articular"],
    stretching: ["Alongamento estático leve pós-treino"],
    safetyTips: [
      "Foque na execução",
      "Mantenha a hidratação",
      limitations ? `Cuidado: ${limitations}` : "Respeite seus limites"
    ],
    generatedAt: new Date().toISOString(),
    isOffline: true,
    daysPerWeek: days
  };
};

export const adjustWorkoutIntelligently = (currentPlan: WorkoutPlan, instruction: string): WorkoutPlan => {
  const instr = normalize(instruction);
  const newPlan = JSON.parse(JSON.stringify(currentPlan)); // Deep copy
  newPlan.id = crypto.randomUUID();
  newPlan.generatedAt = new Date().toISOString();

  // 1. Lógica de Substituição: "Troque X por Y" ou "Mude X"
  if (instr.includes('troque') || instr.includes('mude') || instr.includes('substitua')) {
    // Tenta identificar o que remover e o que adicionar
    let targetToReplace: string | null = null;
    let replacementName: string | null = null;

    if (instr.includes(' por ')) {
      const parts = instr.split(' por ');
      targetToReplace = parts[0].replace(/troque|mude|substitua|o|a/g, '').trim();
      replacementName = parts[1].trim();
    } else {
      targetToReplace = instr.replace(/troque|mude|substitua|o|a/g, '').trim();
    }

    let foundAny = false;
    newPlan.workouts = newPlan.workouts.map((day: DayWorkout) => ({
      ...day,
      exercises: day.exercises.map(ex => {
        const normEx = normalize(ex.name);
        // Se a instrução contém o nome do exercício OU o exercício contém o alvo da busca
        if (targetToReplace && (normEx.includes(targetToReplace) || targetToReplace.includes(normEx))) {
          foundAny = true;
          
          // Se o usuário especificou um substituto, procura ele na base
          if (replacementName) {
            for (const group of Object.values(EXERCISE_DATABASE)) {
              const match = group.find(e => normalize(e.name).includes(replacementName!));
              if (match) return { ...match, sets: ex.sets, reps: ex.reps };
            }
          }

          // Se não achou o substituto ou não foi especificado, pega um aleatório do mesmo grupo
          const groupKey = Object.keys(EXERCISE_DATABASE).find(key => 
            EXERCISE_DATABASE[key].some(e => normalize(e.name) === normEx)
          ) || 'Peito';
          
          const alternatives = EXERCISE_DATABASE[groupKey].filter(e => normalize(e.name) !== normEx);
          return alternatives.length > 0 
            ? { ...alternatives[Math.floor(Math.random() * alternatives.length)], sets: ex.sets, reps: ex.reps }
            : ex;
        }
        return ex;
      })
    }));
  }

  // 2. Lógica de Intensidade
  if (instr.includes('dificil') || instr.includes('pesado') || instr.includes('aumente')) {
    newPlan.workouts.forEach((day: DayWorkout) => {
      day.exercises.forEach(ex => {
        ex.sets = '4';
        ex.reps = '8-10';
        ex.tip += " (Foco em carga)";
      });
    });
  } else if (instr.includes('facil') || instr.includes('leve') || instr.includes('diminua')) {
    newPlan.workouts.forEach((day: DayWorkout) => {
      day.exercises.forEach(ex => {
        ex.sets = '2-3';
        ex.reps = '12-15';
        ex.tip += " (Foco em técnica)";
      });
    });
  }

  return newPlan;
};

export const getExerciseExplanation = (name: string): { execution: string; tip: string } => {
  const normName = normalize(name);
  for (const group of Object.values(EXERCISE_DATABASE)) {
    const found = group.find(e => normalize(e.name).includes(normName));
    if (found) {
      return { 
        execution: "Realize o movimento com controle, mantendo a postura ereta e focando na musculatura alvo. Evite usar impulso.", 
        tip: found.tip 
      };
    }
  }
  return { 
    execution: "Execute o movimento com técnica apurada e amplitude total.", 
    tip: "Consulte um profissional em caso de dúvidas sobre a postura." 
  };
};

export const calculateBMI = (weight: number | string, height: number | string) => {
  const w = Number(weight);
  const h = Number(height);
  if (!w || !h || w <= 0 || h <= 0) return null;
  const hMeters = h / 100;
  const bmi = w / (hMeters * hMeters);
  let category = "";
  if (bmi < 18.5) category = "Abaixo do peso";
  else if (bmi < 25) category = "Peso normal";
  else if (bmi < 30) category = "Sobrepeso";
  else if (bmi < 35) category = "Obesidade grau I";
  else if (bmi < 40) category = "Obesidade grau II";
  else category = "Obesidade grau III";
  return { bmi: parseFloat(bmi.toFixed(2)), category };
};

export const calculateTMB = (weight: number | string, height: number | string, age: number | string, gender: Gender) => {
  const w = Number(weight);
  const h = Number(height);
  const a = Number(age);
  if (!w || !h || !a || w <= 0 || h <= 0 || a <= 0) return null;
  let tmb = (10 * w) + (6.25 * h) - (5 * a);
  tmb = gender === Gender.MALE ? tmb + 5 : tmb - 161;
  return {
    tmb: Math.max(0, Math.round(tmb)),
    dailyCalories: Math.max(0, Math.round(tmb * 1.55))
  };
};
