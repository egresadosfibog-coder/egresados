import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity } from '../types';
import { CATEGORY_STYLES } from '../data/activitiesData';
import { 
  Calendar, 
  Users, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Clock,
  Pin
} from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  registeredUsersCount: number;
  onRegisterClick: (activity: Activity) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  registeredUsersCount,
  onRegisterClick 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const styles = CATEGORY_STYLES[activity.category] || {
    bg: 'bg-slate-50 text-slate-700',
    iconBg: 'bg-slate-100 text-slate-800',
    border: 'border-slate-200'
  };

  const isRealized = activity.status === 'Realizado';

  // Calculate percentage of coverage achieved if metadata is present
  const hasCoverageStats = isRealized && activity.expectedCoverageVal && activity.actualCoverageVal;
  const coveragePercentage = hasCoverageStats 
    ? Math.round((activity.actualCoverageVal! / activity.expectedCoverageVal!) * 100) 
    : 0;

  return (
    <motion.div
      layout
      transition={{ duration: 0.25 }}
      className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${
        isExpanded ? 'shadow-md border-[#006633]/30 scale-[1.01]' : 'shadow-xs hover:shadow-md hover:border-slate-300'
      }`}
      id={`activity-card-${activity.id}`}
    >
      {/* Top Bar Accent */}
      <div className={`h-1.5 w-full ${isRealized ? 'bg-[#006633]' : 'bg-slate-300'}`} />

      <div className="p-5 md:p-6">
        {/* Header containing Category in Tag, status badge and expandable arrow */}
        <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
          <div className="flex gap-2 items-center">
            <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase tracking-wide border ${styles.bg}`}>
              {activity.category}
            </span>
            <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-sm">
              Semestre {activity.semester}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-mono px-2.5 py-1 rounded-full font-bold ${
              isRealized 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/50' 
                : 'bg-amber-100 text-amber-800 border border-amber-200/50'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isRealized ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {activity.status}
            </span>

            {registeredUsersCount > 0 && (
              <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full font-bold">
                {registeredUsersCount} Registrado{registeredUsersCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Title and Short Description */}
        <div className="mb-4">
          <h4 className="text-base sm:text-lg font-sans font-extrabold text-slate-800 tracking-tight leading-snug group-hover:text-[#006633] transition-colors">
            {activity.name}
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 line-clamp-2 md:line-clamp-3 leading-relaxed font-sans">
            {activity.description}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50/50 p-4 rounded-lg border border-slate-100 mb-4 text-xs font-sans">
          {/* Calendar date row */}
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-slate-100 text-slate-500 rounded-md mt-0.5">
              <Calendar size={14} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">Fecha Estipulada</span>
              <span className="font-bold text-slate-700 mt-0.5 inline-block">{activity.date}</span>
            </div>
          </div>

          {/* Expected coverage row */}
          <div className="flex items-start gap-2.5">
            <div className={`p-1.5 rounded-md mt-0.5 ${styles.iconBg}`}>
              <Users size={14} className="opacity-80" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">Meta Cobertura</span>
              <span className="font-bold text-slate-700 mt-0.5 inline-block">{activity.expectedCoverage}</span>
            </div>
          </div>

          {/* Actual coverage achieved - IF realized */}
          {isRealized && (
            <div className="flex items-start gap-2.5 sm:col-span-2 border-t border-slate-200/60 pt-3 mt-1">
              <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-md mt-0.5">
                <Award size={14} />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-mono text-emerald-600 block uppercase tracking-wider">Resultado Realizado</span>
                <span className="font-extrabold text-slate-800 mt-0.5 inline-block font-mono">
                  {activity.actualCoverage}
                </span>

                {/* Draw progress bar if both indicators are numeric */}
                {hasCoverageStats && (
                  <div className="mt-2" id={`coverage-bar-${activity.id}`}>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                      <span>Logro de asistencia</span>
                      <span className="font-bold text-slate-700 font-mono">{coveragePercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#006633] h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${coveragePercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Collapsible details container */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-100 pt-4 mt-4 space-y-4 text-xs leading-relaxed text-slate-600 font-sans"
            id={`extra-details-${activity.id}`}
          >
            {/* Extended description text */}
            <div>
              <h5 className="font-bold text-slate-800 flex items-center gap-1 bg-slate-100/50 py-1 px-2 rounded-sm mb-2 text-[11px] uppercase tracking-wider font-mono">
                <BookOpen size={12} className="text-[#006633]" />
                Detalle del Evento
              </h5>
              <p className="text-slate-600 leading-relaxed font-sans font-normal pl-2">{activity.description}</p>
            </div>

            {/* Observations / Remarks */}
            {activity.observations && (
              <div>
                <h5 className="font-bold text-slate-800 flex items-center gap-1 bg-slate-100/50 py-1 px-2 rounded-sm mb-2 text-[11px] uppercase tracking-wider font-mono">
                  <Sparkles size={12} className="text-amber-500" />
                  Observaciones Técnicas y Bitácora
                </h5>
                <p className="text-slate-600 pl-2 italic leading-relaxed border-l-2 border-amber-300 bg-amber-50/20 py-1">
                  "{activity.observations}"
                </p>
              </div>
            )}

            {/* Highlight special characteristics of specific actual records (like sub-events) */}
            {activity.category === 'Cultura' && (
              <div className="pl-2 border-l border-indigo-200 bg-indigo-50/10 p-2.5 rounded-r-lg">
                <span className="text-[10px] font-mono text-indigo-700 uppercase font-bold block mb-1">Talleres Disponibles</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Acuarelas', 'Técnica Vocal', 'Guitarra', 'Piano', 'Fotografía', 'Danza', 'Teatro', 'Creación Digital', 'Creación Literaria', 'Concurso de Murales'].map((t) => (
                    <span key={t} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] font-medium text-slate-600">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activity.name.includes('Corre Sin Prisa') && (
              <div className="pl-2 border-l border-rose-200 bg-rose-50/10 p-2.5 rounded-r-lg space-y-1 text-[11px]">
                <span className="text-[10px] font-mono text-rose-700 uppercase font-bold block">Cronograma de Carrera</span>
                <p><span className="font-bold">14 y 21 de Mayo 2026:</span> Sesiones de preparación, estiramiento y calentamiento lúdico en las zonas verdes del campus.</p>
                <p><span className="font-bold">27 de Mayo 2026:</span> Carrera oficial por los prados del campus universitario con puntos de hidratación activa.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Action button bar */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-[#006633] hover:text-[#004d26] inline-flex items-center gap-1 py-1.5 focus:outline-hidden group"
            id={`toggle-details-btn-${activity.id}`}
          >
            {isExpanded ? (
              <>
                Ocultar detalles
                <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
              </>
            ) : (
              <>
                Ver observaciones y ampliación
                <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
              </>
            )}
          </button>

          <button
            onClick={() => onRegisterClick(activity)}
            className={`text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1.5 transition-all shadow-xs duration-300 cursor-pointer ${
              isRealized
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-800'
                : 'bg-[#006633] hover:bg-[#00552b] text-white hover:shadow-md'
            }`}
          >
            {isRealized ? (
              <>
                <BookOpen size={12} />
                Ver Memorias
              </>
            ) : (
              <>
                Preinscribirse
                <ArrowRight size={12} />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
