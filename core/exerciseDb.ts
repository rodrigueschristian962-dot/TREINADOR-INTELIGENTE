
import { Exercise, ExperienceLevel, ExerciseCategory } from '../types';

export const EXERCISE_DATABASE: Record<string, Exercise[]> = {
  'Peito': [
    { name: 'Supino Reto (Barra)', target: 'Peito', category: 'compound', level: [ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED], sets: '3-4', reps: '8-12', rest: '90s', tip: 'Mantenha as escápulas aduzidas e os pés firmes no chão.' },
    { name: 'Supino Inclinado (Halteres)', target: 'Peito Superior', category: 'compound', level: [ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED], sets: '3', reps: '10-12', rest: '90s', tip: 'Foque na contração da parte superior do peito.' },
    { name: 'Crucifixo Máquina (Peck Deck)', target: 'Peito', category: 'isolation', level: [ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE], sets: '3', reps: '12-15', rest: '60s', tip: 'Mantenha os cotovelos levemente flexionados.' },
    { name: 'Flexão de Braços', target: 'Peito', category: 'compound', level: [ExperienceLevel.BEGINNER], sets: '3', reps: 'Falha', rest: '60s', tip: 'Mantenha o core bem ativado.' },
    { name: 'Crossover Polia Alta', target: 'Peito Inferior', category: 'isolation', level: [ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED], sets: '3', reps: '12-15', rest: '60s', tip: 'Cruze as mãos à frente do corpo para maior contração.' }
  ],
  'Costas': [
    { name: 'Puxada Frontal (Pulley)', target: 'Dorsal', category: 'compound', level: [ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE], sets: '3-4', reps: '10-12', rest: '90s', tip: 'Puxe com os cotovelos, não apenas com as mãos.' },
    { name: 'Remada Baixa (Triângulo)', target: 'Costas', category: 'compound', level: [ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED], sets: '3', reps: '10-12', rest: '90s', tip: 'Evite balançar o tronco excessivamente.' },
    { name: 'Remada Curvada (Barra)', target: 'Costas', category: 'compound', level: [ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED], sets: '4', reps: '8-10', rest: '120s', tip: 'Mantenha a coluna neutra e paralela ao chão.' },
    { name: 'Barra Fixa', target: 'Dorsal', category: 'compound', level: [ExperienceLevel.ADVANCED], sets: '3', reps: 'Máximo', rest: '120s', tip: 'Controle bem a descida.' },
    { name: 'Pull Down (Corda)', target: 'Dorsal', category: 'isolation', level: [ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED], sets: '3', reps: '12-15', rest: '60s', tip: 'Mantenha os braços quase retos durante o movimento.' }
  ],
  'Pernas': [
    { name: 'Agachamento Livre', target: 'Quadríceps', category: 'compound', level: [ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED], sets: '4', reps: '8-12', rest: '120s', tip: 'Desça até as coxas ficarem pelo menos paralelas ao chão.' },
    { name: 'Leg Press 45', target: 'Pernas', category: 'compound', level: [ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE], sets: '3', reps: '12-15', rest: '90s', tip: 'Não trave os joelhos na extensão máxima.' },
    { name: 'Cadeira Extensora', target: 'Quadríceps', category: 'isolation', level: [ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE], sets: '3', reps: '12-15', rest: '60s', tip: 'Foque na contração de pico no topo do movimento.' },
    { name: 'Mesa Flexora', target: 'Posterior', category: 'isolation', level: [ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED], sets: '3', reps: '12-15', rest: '60s', tip: 'Evite levantar o quadril do banco.' },
    { name: 'Stiff (Halteres ou Barra)', target: 'Posterior/Glúteo', category: 'compound', level: [ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED], sets: '3', reps: '10-12', rest: '90s', tip: 'Mantenha a coluna reta e sinta o alongamento.' },
    { name: 'Elevação de Panturrilha em Pé', target: 'Panturrilha', category: 'isolation', level: [ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE], sets: '4', reps: '15-20', rest: '45s', tip: 'Amplitude máxima de movimento.' }
  ],
  'Ombros': [
    { name: 'Desenvolvimento (Halteres)', target: 'Deltóide', category: 'compound', level: [ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED], sets: '3', reps: '10-12', rest: '90s', tip: 'Não encoste os halteres no topo.' },
    { name: 'Elevação Lateral', target: 'Deltóide Lateral', category: 'isolation', level: [ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED], sets: '3', reps: '12-15', rest: '60s', tip: 'Imagine que está derramando água de uma jarra.' },
    { name: 'Elevação Frontal', target: 'Deltóide Frontal', category: 'isolation', level: [ExperienceLevel.BEGINNER], sets: '3', reps: '12', rest: '60s', tip: 'Controle o peso, evite usar impulso.' },
    { name: 'Crucifixo Inverso', target: 'Deltóide Posterior', category: 'isolation', level: [ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED], sets: '3', reps: '12-15', rest: '60s', tip: 'Sinta as escápulas se moverem.' }
  ],
  'Bíceps': [
    { name: 'Rosca Direta (Barra W)', target: 'Bíceps', category: 'isolation', level: [ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED], sets: '3', reps: '10-12', rest: '60s', tip: 'Mantenha os cotovelos fixos ao lado do corpo.' },
    { name: 'Rosca Martelo (Halteres)', target: 'Braquial', category: 'isolation', level: [ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE], sets: '3', reps: '12', rest: '60s', tip: 'Pegada neutra (palmas viradas uma para a outra).' },
    { name: 'Rosca Concentrada', target: 'Bíceps', category: 'isolation', level: [ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED], sets: '3', reps: '12', rest: '45s', tip: 'Excelente para o pico do bíceps.' }
  ],
  'Tríceps': [
    { name: 'Tríceps Corda', target: 'Tríceps', category: 'isolation', level: [ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED], sets: '3', reps: '12-15', rest: '60s', tip: 'Abra a corda no final do movimento.' },
    { name: 'Tríceps Testa (Barra)', target: 'Tríceps', category: 'compound', level: [ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED], sets: '3', reps: '10-12', rest: '90s', tip: 'Desça o peso em direção à testa.' },
    { name: 'Tríceps Coice (Halter)', target: 'Tríceps', category: 'isolation', level: [ExperienceLevel.INTERMEDIATE], sets: '3', reps: '12', rest: '60s', tip: 'Mantenha o braço paralelo ao chão.' },
    { name: 'Mergulho no Banco', target: 'Tríceps', category: 'compound', level: [ExperienceLevel.BEGINNER], sets: '3', reps: 'Falha', rest: '60s', tip: 'Mantenha o tronco próximo ao banco.' }
  ],
  'Abdômen': [
    { name: 'Abdominal Supra', target: 'Abdômen', category: 'isolation', level: [ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE], sets: '3', reps: '15-20', rest: '45s', tip: 'Foque na contração, não em subir o pescoço.' },
    { name: 'Prancha Isométrica', target: 'Core', category: 'isolation', level: [ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED], sets: '3', reps: '30-60s', rest: '60s', tip: 'Mantenha o corpo reto como uma prancha.' },
    { name: 'Elevação de Pernas', target: 'Abdômen Inferior', category: 'isolation', level: [ExperienceLevel.INTERMEDIATE, ExperienceLevel.ADVANCED], sets: '3', reps: '12-15', rest: '45s', tip: 'Não encoste os pés no chão durante a série.' }
  ]
};
