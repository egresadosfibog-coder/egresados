import { Activity } from '../types';

export const ACTIVITIES_DATA: Activity[] = [
  // --- REALIZADAS ---
  {
    id: 'realizada-1',
    name: 'Abrazo con Sabor a UN 2026-1',
    description: 'Evento formal que celebra la graduación de estudiantes de pregrado y posgrado de la facultad. Durante la jornada se desarrollan diferentes actividades, entre ellas una conferencia tipo TED, un espacio de acercamiento entre las asociaciones de egresados y los futuros graduandos, charlas sobre ética profesional y movilidad internacional, y finalmente un acto cultural y musical de cierre.',
    expectedCoverage: '152 Inscritos',
    expectedCoverageVal: 152,
    actualCoverage: '130 Asistentes',
    actualCoverageVal: 130,
    date: '17-abr-26',
    observations: 'Se otorgó un reconocimiento al egresado destacado, quien ofreció la conferencia magistral titulada "Engineering Power Skills" durante el evento.',
    category: 'Graduación',
    status: 'Realizado',
    semester: '2026-1',
    timeLineDate: new Date('2026-04-17')
  },
  {
    id: 'realizada-2',
    name: 'Charlas Semana de Inducción 2026-1',
    description: 'Encuentro entre egresados y estudiantes admitidos, realizado durante la semana de inducción, con el objetivo de brindar a los nuevos estudiantes una perspectiva inspiradora basada en la experiencia académica y profesional de los egresados.',
    expectedCoverage: '772 Admitidos',
    expectedCoverageVal: 772,
    actualCoverage: '593 Asistentes',
    actualCoverageVal: 593,
    date: '28-ene-26',
    observations: 'Se contó con la participación de egresados de diversos programas curriculares, quienes compartieron aprendizajes prácticos y consejos clave de inserción laboral.',
    category: 'Inducción',
    status: 'Realizado',
    semester: '2026-1',
    timeLineDate: new Date('2026-01-28')
  },
  {
    id: 'realizada-3',
    name: 'UnalTalks 2026-1',
    description: 'Espacio de diálogo y reflexión que convoca a miembros de la comunidad universitaria (egresados, estudiantes y docentes) en torno a temas de relevancia social, académica o profesional. La sesión correspondiente al período 2026-1 estuvo enmarcada en la conmemoración del Día Internacional de la Mujer, celebrado tradicionalmente el 8 de marzo.',
    expectedCoverage: '13 Inscritos',
    expectedCoverageVal: 13,
    actualCoverage: '7 Asistentes',
    actualCoverageVal: 7,
    date: '06-mar-26',
    observations: 'Conmemoración especial al 8 de marzo, Día de la Mujer. Panel de diálogo sobre liderazgo femenino en la ingeniería contemporánea.',
    category: 'Comunidad',
    status: 'Realizado',
    semester: '2026-1',
    timeLineDate: new Date('2026-03-06')
  },
  {
    id: 'realizada-4',
    name: 'Actividades Culturales CREA 2026-1',
    description: 'Talleres y cursos del área de cultura de la Facultad, que incluyen disciplinas como: Acuarelas, Técnica vocal, Guitarra y Piano, Fotografía, Danza, Teatro, Creación Digital y Creación Literaria. Adicionalmente se desarrolló el tradicional Concurso de Murales interactivo con participación de egresados.',
    expectedCoverage: '62 Inscritos',
    expectedCoverageVal: 62,
    actualCoverage: '31 Asistentes',
    actualCoverageVal: 31,
    date: 'Semestre 2026-1',
    observations: 'Se integraron exitosamente egresados y estudiantes en roles creativos presenciales y virtuales dictados por instructores del CREA.',
    category: 'Cultura',
    status: 'Realizado',
    semester: '2026-1',
    timeLineDate: new Date('2026-05-10') // Approximate index mid semester
  },
  {
    id: 'realizada-5',
    name: 'Corre Sin Prisa',
    description: 'Carrera lúdico-recreativa dentro del campus que promueve la salud mental, el autocuidado y la prevención del estrés para todos los estamentos de la Facultad de Ingeniería.',
    expectedCoverage: '48 Inscritos',
    expectedCoverageVal: 48,
    actualCoverage: '31 Asistentes',
    actualCoverageVal: 31,
    date: '27-may-26', // Note: Prep on May 14 & 21
    observations: 'Preparación y entrenamientos los días 14 y 21 de mayo de 2026. La carrera oficial y el circuito de bienestar se consolidaron el 27 de mayo de 2026.',
    category: 'Bienestar',
    status: 'Realizado',
    semester: '2026-1',
    timeLineDate: new Date('2026-05-27')
  },
  {
    id: 'realizada-6',
    name: 'Revista de Egresados',
    description: 'Publicación periódica de artículos académicos, científicos y de opinión profesional en torno a las trayectorias de los egresados de la facultad de Ingeniería y sus aportes al país.',
    expectedCoverage: 'Egresados Invitados',
    expectedCoverageVal: undefined,
    actualCoverage: 'Comité de Evaluación',
    actualCoverageVal: undefined,
    date: '09-abr-26',
    observations: 'Reunión oficial del comité: el comité evaluó y analizó de manera rigurosa las propuestas de artículos recibidas para aprobar la edición final de la publicación.',
    category: 'Revista',
    status: 'Realizado',
    semester: '2026-1',
    timeLineDate: new Date('2026-04-09')
  },

  // --- PRÓXIMAS A REALIZAR ---
  {
    id: 'proximo-1',
    name: 'Abrazo con Sabor a UN 2026-2',
    description: 'Evento formal insignia que celebra la graduación grupal de los estudiantes de pregrado y posgrado de la facultad del segundo semestre. Contará con charlas tipo TED, integración gremial de egresados, talleres de orientación profesional, movilidad internacional y espectáculos culturales.',
    expectedCoverage: 'Total de Graduandos',
    expectedCoverageVal: 180,
    date: '17-ago-26 y 13-nov-26',
    observations: 'Se proyecta una alta convocatoria. Con conferencistas nacionales e internacionales de gran trayectoria en innovación.',
    category: 'Graduación',
    status: 'Próximo',
    semester: '2026-2',
    timeLineDate: new Date('2026-08-17')
  },
  {
    id: 'proximo-2',
    name: 'Charlas Semana de Inducción 2026-2',
    description: 'Encuentros inspiradores entre egresados destacados y estudiantes recién admitidos a los programas curriculares de ingeniería de la UNAL, brindando una cálida bienvenida pedagógica.',
    expectedCoverage: 'Total de Admitidos',
    expectedCoverageVal: 800,
    date: 'Semana de Inducción 2026-2',
    observations: 'Actividad clave de inducción para la retención académica, articulando egresados como mentores iniciales.',
    category: 'Inducción',
    status: 'Próximo',
    semester: '2026-2',
    timeLineDate: new Date('2026-07-25')
  },
  {
    id: 'proximo-3',
    name: 'UnalTalks - Conmemoración 65 Años',
    description: 'Foro especial y conversatorio universitario de alto nivel académico y empresarial en torno al impacto de la Facultad de Ingeniería de la Universidad Nacional en sus 65 años de labor educativa.',
    expectedCoverage: 'Egresados Invitados & Comunidad',
    expectedCoverageVal: 300,
    date: 'Fecha Conmemorativa 65 Años de la Facultad',
    observations: 'Edición histórica de UnalTalks con paneles sectoriales sobre sostenibilidad, IA en ingeniería y aportes a políticas de infraestructura del país.',
    category: 'Comunidad',
    status: 'Próximo',
    semester: '2026-2',
    timeLineDate: new Date('2026-09-15')
  },
  {
    id: 'proximo-4',
    name: 'Actividades Culturales CREA 2026-2',
    description: 'Segunda cohorte de talleres de expresión artística dirigidos a egresados y estudiantes en áreas creativas plásticas y musicales, culminando con la exposición interactiva de fin de año.',
    expectedCoverage: '62 Inscritos',
    expectedCoverageVal: 62,
    date: 'Semestre 2026-2',
    observations: 'Fomenta la salud mental y la apropiación cultural de los egresados fomentando dinámicas intergeneracionales.',
    category: 'Cultura',
    status: 'Próximo',
    semester: '2026-2',
    timeLineDate: new Date('2026-10-01')
  },
  {
    id: 'proximo-5',
    name: 'Diálogos con Egresados',
    description: 'Ciclo continuo de conferencias especializadas, talleres prácticos y simulacros para el fortalecimiento de habilidades de empleabilidad "soft & hard" en el sector tecnológico, empresarial y académico.',
    expectedCoverage: 'Egresados Invitados',
    expectedCoverageVal: undefined,
    date: 'A lo largo de todo el año',
    observations: 'Se analizaron 5 propuestas concretas (revisión de hojas de vida de los ponentes y pertinencia de los temas) para la aprobación del comité curricular.',
    category: 'Conferencias',
    status: 'Próximo',
    semester: 'Todo el año',
    timeLineDate: new Date('2026-06-15')
  }
];

export const CATEGORY_STYLES: Record<string, { bg: string; text?: string; border: string; iconBg: string }> = {
  'Graduación': { 
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', 
    iconBg: 'bg-emerald-100 text-emerald-800',
    border: 'border-emerald-200' 
  },
  'Inducción': { 
    bg: 'bg-sky-50 text-sky-700 border-sky-100', 
    iconBg: 'bg-sky-100 text-sky-800',
    border: 'border-sky-200' 
  },
  'Comunidad': { 
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-100', 
    iconBg: 'bg-indigo-100 text-indigo-800',
    border: 'border-indigo-200' 
  },
  'Cultura': { 
    bg: 'bg-amber-50 text-amber-700 border-amber-100', 
    iconBg: 'bg-amber-100 text-amber-800',
    border: 'border-amber-200' 
  },
  'Bienestar': { 
    bg: 'bg-rose-50 text-rose-700 border-rose-100', 
    iconBg: 'bg-rose-100 text-rose-800',
    border: 'border-rose-200' 
  },
  'Revista': { 
    bg: 'bg-violet-50 text-violet-700 border-violet-100', 
    iconBg: 'bg-violet-100 text-violet-800',
    border: 'border-violet-200' 
  },
  'Conferencias': { 
    bg: 'bg-teal-50 text-teal-700 border-teal-100', 
    iconBg: 'bg-teal-100 text-teal-800',
    border: 'border-teal-200' 
  }
};
