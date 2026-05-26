export type Category = 
  | 'Graduación'
  | 'Inducción'
  | 'Comunidad'
  | 'Cultura'
  | 'Bienestar'
  | 'Revista'
  | 'Conferencias';

export type ActivityStatus = 'Realizado' | 'Próximo';

export interface Activity {
  id: string;
  name: string;
  description: string;
  expectedCoverage: string; // e.g., "152 Inscritos"
  expectedCoverageVal?: number; // numerical for indicators
  actualCoverage?: string; // e.g., "130 Asistentes"
  actualCoverageVal?: number; // numerical for indicators
  date: string; // e.g., "17-abr-26" or "Semestre 2026-1"
  observations: string;
  category: Category;
  status: ActivityStatus;
  semester: '2026-1' | '2026-2' | 'Todo el año';
  timeLineDate: Date; // For sorting chronologically
}

export interface UserSubscription {
  activityId: string;
  email: string;
  name: string;
  subscribedAt: string;
}
