import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity } from '../types';
import { Users, Calendar, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';

interface ChartsProps {
  activities: Activity[];
}

export const DashboardCharts: React.FC<ChartsProps> = ({ activities }) => {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // Filter activities to those that are Realizadas and have numerical expected/actual values
  const completedWithNumbers = activities.filter(
    (act) => act.status === 'Realizado' && act.expectedCoverageVal && act.actualCoverageVal
  );

  const totalPlanned = activities.length;
  const completedCount = activities.filter((act) => act.status === 'Realizado').length;
  const upcomingCount = totalPlanned - completedCount;
  const planPercentage = Math.round((completedCount / totalPlanned) * 100);

  // Totalized coverage for completed events
  const totalExpectedCoverage = completedWithNumbers.reduce((acc, curr) => acc + (curr.expectedCoverageVal || 0), 0);
  const totalActualCoverage = completedWithNumbers.reduce((acc, curr) => acc + (curr.actualCoverageVal || 0), 0);
  const totalCoveragePercent = totalExpectedCoverage > 0 ? Math.round((totalActualCoverage / totalExpectedCoverage) * 100) : 0;

  // Let's build a clean, custom responsive bar chart for completed activities
  // Normalized heights
  const maxVal = Math.max(...completedWithNumbers.map(act => Math.max(act.expectedCoverageVal || 0, act.actualCoverageVal || 0)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-charts-container">
      {/* CARD 1: Progreso de Ejecución del Plan (Circular gauge) */}
      <div className="bg-white border border-[#E2E8F0] shadow-xs rounded-xl p-6 relative overflow-hidden" id="card-execution-progress">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs font-mono font-medium tracking-wider text-[#006633] uppercase">Avance Tecnico</span>
            <h3 className="text-lg font-sans font-bold text-slate-800 mt-1">Ejecución del Plan</h3>
          </div>
          <div className="p-2 bg-emerald-50 rounded-lg text-[#006633]">
            <CheckCircle size={20} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative w-36 h-36">
            {/* SVG circle gauge */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-100"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Foreground circle with stroke-dasharray */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-[#006633]"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * planPercentage) / 100 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-sans font-extrabold text-slate-800">{planPercentage}%</span>
              <span className="text-[10px] font-mono tracking-wide text-slate-500 uppercase mt-0.5">Completado</span>
            </div>
          </div>
        </div>

        <div className="mt-2 space-y-3">
          <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
            <span className="text-slate-500 flex items-center gap-1.5 font-sans">
              <span className="w-2.5 h-2.5 bg-[#006633] rounded-full inline-block"></span>
              Eventos Realizados
            </span>
            <span className="font-bold text-slate-800 font-mono">{completedCount} actividades</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 flex items-center gap-1.5 font-sans">
              <span className="w-2.5 h-2.5 bg-slate-200 rounded-full inline-block"></span>
              Eventos Programados
            </span>
            <span className="font-bold text-slate-800 font-mono">{upcomingCount} pendientes</span>
          </div>
        </div>
      </div>

      {/* CARD 2: Índice de Cobertura General (KPI Comparison) */}
      <div className="bg-white border border-[#E2E8F0] shadow-xs rounded-xl p-6 relative overflow-hidden flex flex-col justify-between" id="card-coverage-kpi">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs font-mono font-medium tracking-wider text-[#006633] uppercase">Efectividad de Convocatoria</span>
              <h3 className="text-lg font-sans font-bold text-slate-800 mt-1">Cumplimiento de Aforo</h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg text-[#006633]">
              <Users size={20} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed font-sans">
            Métrica consolidad de asistencia registrada sobre la cobertura proyectada en los eventos finalizados de ingeniería en 2026.
          </p>
        </div>

        <div className="py-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Meta Cobertura</p>
              <p className="text-xl font-sans font-extrabold text-slate-600 mt-1 font-mono">1.047</p>
              <p className="text-[11px] text-slate-500 italic mt-0.5">personas esperadas</p>
            </div>
            <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50">
              <p className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider">Asistencia Real</p>
              <p className="text-xl font-sans font-extrabold text-[#006633] mt-1 font-mono">792</p>
              <p className="text-[11px] text-emerald-700 italic mt-0.5">asistentes presenciales</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 font-sans">Eficiencia acumulada</span>
              <span className="font-bold text-[#006633] font-mono">{totalCoveragePercent}% de la meta</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <motion.div 
                className="bg-[#006633] h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${totalCoveragePercent}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 font-sans">
          <AlertCircle size={12} className="text-emerald-500" />
          <span>Excluye la revista de egresados al no contar con registro numérico directo.</span>
        </div>
      </div>

      {/* CARD 3: Detalle por Actividad (Custom Vertical Bar Chart) */}
      <div className="bg-white border border-[#E2E8F0] shadow-xs rounded-xl p-6 lg:col-span-1 flex flex-col justify-between" id="card-by-activity-chart">
        <div>
          <span className="text-xs font-mono font-medium tracking-wider text-[#006633] uppercase">Análisis Comparativo</span>
          <h3 className="text-lg font-sans font-bold text-slate-800 mt-1 mb-2">Asistentes vs Meta</h3>
          <p className="text-xs text-slate-500 mb-4 font-sans">
            Coloca el cursor sobre las barras para ver la relación esperada vs realizada de cada evento.
          </p>
        </div>

        {/* Minimalist interactive SVG bar chart */}
        <div className="h-44 w-full flex items-end justify-between gap-2 px-1 relative">
          {completedWithNumbers.map((act) => {
            const expected = act.expectedCoverageVal || 0;
            const actual = act.actualCoverageVal || 0;
            const percentage = expected > 0 ? Math.round((actual / expected) * 100) : 0;
            
            // Scaled heights (relative to 140px max height)
            const maxBarHeight = 110;
            const expectedHeight = (expected / maxVal) * maxBarHeight + 10;
            const actualHeight = (actual / maxVal) * maxBarHeight + 10;

            const isHovered = hoveredBar === act.id;

            return (
              <div 
                key={act.id} 
                className="flex flex-col items-center flex-1 group cursor-pointer"
                onMouseEnter={() => setHoveredBar(act.id)}
                onMouseLeave={() => setHoveredBar(null)}
                id={`bar-group-${act.id}`}
              >
                {/* Visual side-by-side bar indicator */}
                <div className="w-full flex justify-center items-end gap-1.5 h-32 relative">
                  {/* Expected bar */}
                  <motion.div
                    className={`w-3.5 bg-slate-200 rounded-t-sm transition-colors duration-200 ${isHovered ? 'bg-[#006633]/30' : ''}`}
                    style={{ height: `${expectedHeight}px` }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                  {/* Actual assistants bar */}
                  <motion.div
                    className={`w-3.5 bg-[#006633] rounded-t-sm transition-all duration-200 ${isHovered ? 'shadow-[0_0_12px_rgba(0,102,51,0.4)] bg-[#00552b]' : ''}`}
                    style={{ height: `${actualHeight}px` }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                </div>

                <span className="text-[9px] font-sans text-slate-500 mt-2 text-center line-clamp-1 w-full font-medium">
                  {act.name.split(' ')[0]}
                </span>
                
                {/* Popover detailed analysis */}
                {isHovered && (
                  <div className="absolute bottom-full left-0 right-0 bg-slate-900 text-white p-3 rounded-lg text-xs shadow-lg z-20 mb-2 border border-slate-800 font-sans transition-all">
                    <p className="font-bold text-emerald-400">{act.name}</p>
                    <div className="grid grid-cols-2 gap-2 mt-1.5 font-mono text-[10px]">
                      <div>
                        <span className="text-slate-400 block">Proyectados:</span>
                        <span className="font-bold">{expected}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Reales:</span>
                        <span className="font-bold">{actual}</span>
                      </div>
                    </div>
                    <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400 text-[10px]">Efectividad aforo:</span>
                      <span className="font-bold text-[#006633] bg-emerald-500/10 px-1 rounded font-mono">{percentage}%</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 justify-center text-[10px] text-slate-500 mt-3 pt-3 border-t border-slate-100 font-sans">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-slate-200 rounded"></span>
            <span>Establecido / Meta</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-[#006633] rounded"></span>
            <span>Logrado / Asistentes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
