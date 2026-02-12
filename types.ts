
export enum ExperienceLevel {
  BEGINNER = 'Iniciante',
  INTERMEDIATE = 'Intermediário',
  ADVANCED = 'Experiente'
}

export enum WorkoutGoal {
  MASS = 'Ganho de massa',
  WEIGHT_LOSS = 'Emagrecer com saúde',
  HEALTHY = 'Se manter saudável'
}

export enum Gender {
  MALE = 'Masculino',
  FEMALE = 'Feminino'
}

export type ExerciseCategory = 'compound' | 'isolation' | 'cardio';

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

export interface UserProfile {
  name: string;
  age: string;
  height: string;
  weight: string;
  gender: Gender;
  goals: Goal[];
  photo: string;
  bmi?: number;
  bmiCategory?: string;
  tmb?: number;
  dailyCalories?: number;
  weightHistory: { date: string; weight: number }[];
}

export interface Exercise {
  // Added 'level' property and made metadata fields optional for compatibility with dynamic AI generation
  id?: string;
  name: string;
  target?: string;
  category?: ExerciseCategory;
  level?: ExperienceLevel[];
  sets: string;
  reps: string;
  rest: string;
  tip: string;
}

export interface DayWorkout {
  dayTitle: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  planName: string;
  description: string;
  weeklyDivision: string;
  workouts: DayWorkout[];
  warmup: string[];
  stretching: string[];
  safetyTips: string[];
  generatedAt: string;
  isOffline: boolean;
  daysPerWeek: number;
}

export interface WorkoutHistoryEntry {
  id: string;
  dataCriacao: string;
  genero: Gender;
  nivel: ExperienceLevel;
  objetivo: WorkoutGoal;
  musculosPrioritarios: string;
  dias: number;
  tempo: string;
  treinoGerado: WorkoutPlan;
}

export interface WorkoutLog {
  id: string;
  date: string;
  planName: string;
  dayTitle: string;
  exercises: string[];
  durationMinutes: number;
  totalSets: number;
}
