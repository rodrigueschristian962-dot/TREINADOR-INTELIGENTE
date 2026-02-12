
import { ExperienceLevel, WorkoutGoal, WorkoutPlan, Gender } from "../types";
import { 
  generateIntelligentWorkout, 
  adjustWorkoutIntelligently, 
  getExerciseExplanation 
} from "../core/workoutEngine";

/**
 * All AI service calls are now redirected to the internal Intelligent Offline Motor.
 * This ensures 100% offline functionality without external dependencies.
 */

export async function generateWorkoutPlan(
  gender: Gender,
  experience: ExperienceLevel,
  goal: WorkoutGoal,
  muscles: string,
  daysPerWeek: number,
  timePerWorkout: string,
  limitations: string
): Promise<WorkoutPlan> {
  // Simulate a very short delay to maintain the "AI processing" feel
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return generateIntelligentWorkout(
    gender,
    experience,
    goal,
    daysPerWeek,
    muscles,
    timePerWorkout,
    limitations
  );
}

export async function adjustWorkoutPlan(currentPlan: WorkoutPlan, instruction: string): Promise<WorkoutPlan> {
  // Simulate a very short delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return adjustWorkoutIntelligently(currentPlan, instruction);
}

export async function explainExercise(exerciseName: string): Promise<{ execution: string; tip: string }> {
  return getExerciseExplanation(exerciseName);
}
