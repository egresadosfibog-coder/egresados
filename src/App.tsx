import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Sparkles, 
  Award, 
  Calendar, 
  Users, 
  CheckCircle, 
  TrendingUp, 
  HelpCircle, 
  FileText, 
  Plus, 
  Filter, 
  SlidersHorizontal,
  Mail,
  ExternalLink,
  BookOpen
} from 'lucide-react';

import { Activity, Category, ActivityStatus, UserSubscription } from './types';
import { ACTIVITIES_DATA, CATEGORY_STYLES } from './data/activitiesData';
import { DashboardCharts } from './components/DashboardCharts';
import { RegistrationModal } from './components/RegistrationModal';

export default function App() {
  // State loaded from localStorage if exists, else initial static data
  const [activities, setActivities] = useState<Activity[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  
  // Accordion drop-down open/close states (menus desplegables)
  const [isRealizedOpen, setIsRealizedOpen] = useState<boolean>(true);
  const [isUpcomingOpen, setIsUpcomingOpen] = useState<boolean>(true);

  // Top overall menu selector state to quickly open/close sections
  const [selectedQuickView, setSelectedQuickView] = useState<'both' | 'realizadas' | 'proximas'>('both');

  // Selected event IDs for dropdown selectors within each section
  const [selectedRealizedId, setSelectedRealizedId] = useState<string>('');
  const [selectedUpcomingId, setSelectedUpcomingId] = useState<string>('');

  // Modal registration
  const [activeRegActivity, setActiveRegActivity] = useState<Activity | null>(null);
  const [isNewActivityOpen, setIsNewActivityOpen] = useState(false);

  // Successful toast message state
  const [notification, setNotification] = useState<string | null>(null);

  // Form for new activity
  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    expectedCoverage: '',
    expectedCoverageVal: '',
    actualCoverage: '',
    actualCoverageVal: '',
    date: '',
    observations: '',
    category: 'Conferencias' as Category,
    status: 'Realizado' as ActivityStatus,
    semester: '2026-2' as '2026-1' | '2026-2' | 'Todo el año'
  });

  // Load cache
  useEffect(() => {
    const cachedActivities = localStorage.getItem('unal_engineering_activities_2026');
    if (cachedActivities) {
      try {
        const parsed = JSON.parse(cachedActivities);
        parsed.forEach((act: any) => {
          act.timeLineDate = new Date(act.timeLineDate);
        });
        setActivities(parsed);
      } catch (e) {
        setActivities(ACTIVITIES_DATA);
      }
    } else {
      setActivities(ACTIVITIES_DATA);
      localStorage.setItem('unal_engineering_activities_2026', JSON.stringify(ACTIVITIES_DATA));
    }

    const cachedSubs = localStorage.getItem('unal_engineering_subscriptions');
    if (cachedSubs) {
      try {
        setSubscriptions(JSON.parse(cachedSubs));
      } catch (e) {}
    }
  }, []);

  const saveActivities = (updatedList: Activity[]) => {
    setActivities(updatedList);
    localStorage.setItem('unal_engineering_activities_2026', JSON.stringify(updatedList));
  };

  const handleRegisterSuccess = (activityId: string, name: string, email: string) => {
    const newSub: UserSubscription = {
      activityId,
      email,
      name,
      subscribedAt: new Date().toISOString()
    };
    const updated = [...subscriptions, newSub];
    setSubscriptions(updated);
    localStorage.setItem('unal_engineering_subscriptions', JSON.stringify(updated));
    showToast(`¡Inscripción exitosa para ${name}!`);
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.name || !newActivity.description || !newActivity.date) {
      alert('Por favor complete los campos obligatorios: Nombre, Descripción y Fecha.');
      return;
    }

    const created: Activity = {
      id: `custom-${Date.now()}`,
      name: newActivity.name,
      description: newActivity.description,
      expectedCoverage: newActivity.expectedCoverage || 'Por definir',
      expectedCoverageVal: newActivity.expectedCoverageVal ? parseInt(newActivity.expectedCoverageVal) : undefined,
      actualCoverage: newActivity.status === 'Realizado' ? (newActivity.actualCoverage || 'Completado') : undefined,
      actualCoverageVal: newActivity.status === 'Realizado' && newActivity.actualCoverageVal ? parseInt(newActivity.actualCoverageVal) : undefined,
      date: newActivity.date,
      observations: newActivity.observations || '',
      category: newActivity.category,
      status: newActivity.status,
      semester: newActivity.semester,
      timeLineDate: new Date()
    };

    const updated = [...activities, created];
    saveActivities(updated);
    setIsNewActivityOpen(false);
    
    // Reset form
    setNewActivity({
      name: '',
      description: '',
      expectedCoverage: '',
      expectedCoverageVal: '',
      actualCoverage: '',
      actualCoverageVal: '',
      date: '',
      observations: '',
      category: 'Conferencias',
      status: 'Realizado',
      semester: '2026-2'
    });

    showToast(`¡Actividad "${created.name}" creada exitosamente!`);

    // Force open the corresponding accordion if collapsed
    if (created.status === 'Realizado') {
      setIsRealizedOpen(true);
    } else {
      setIsUpcomingOpen(true);
    }
  };

  const handleResetData = () => {
    if (window.confirm('¿Está seguro de restaurar los datos iniciales del plan de acción 2026? Se perderán las modificaciones locales.')) {
      setActivities(ACTIVITIES_DATA);
      setSubscriptions([]);
      localStorage.setItem('unal_engineering_activities_2026', JSON.stringify(ACTIVITIES_DATA));
      localStorage.removeItem('unal_engineering_subscriptions');
      showToast('Plan de Acción restaurado a valores por defecto.');
    }
  };

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Sync selection mode with specific opens
  const handleQuickViewChange = (mode: 'both' | 'realizadas' | 'proximas') => {
    setSelectedQuickView(mode);
    if (mode === 'both') {
      setIsRealizedOpen(true);
      setIsUpcomingOpen(true);
    } else if (mode === 'realizadas') {
      setIsRealizedOpen(true);
      setIsUpcomingOpen(false);
    } else if (mode === 'proximas') {
      setIsRealizedOpen(false);
      setIsUpcomingOpen(true);
    }
  };

  // Subcount
  const getSubCount = (activityId: string) => {
    return subscriptions.filter(sub => sub.activityId === activityId).length;
  };

  // Split calculations
  const realizedList = activities.filter(act => act.status === 'Realizado');
  const upcomingList = activities.filter(act => act.status === 'Próximo');

  // Active selected events from local dropdown options (or fall back to first)
  const currentRealized = realizedList.find(a => a.id === selectedRealizedId) || realizedList[0];
  const currentUpcoming = upcomingList.find(a => a.id === selectedUpcomingId) || upcomingList[0];

  // Compute stats for indicator widgets (Only for realized)
  const numRealizedWithVal = realizedList.filter(a => a.expectedCoverageVal && a.actualCoverageVal);
  const totalExpectedCov = numRealizedWithVal.reduce((acc, curr) => acc + (curr.expectedCoverageVal || 0), 0);
  const totalActualCov = numRealizedWithVal.reduce((acc, curr) => acc + (curr.actualCoverageVal || 0), 0);
  const totalRate = totalExpectedCov > 0 ? Math.round((totalActualCov / totalExpectedCov) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-800">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-800 text-white px-5 py-3 rounded-lg shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BRAND SLEEK HEADER */}
      <header className="border-b border-slate-200 bg-white px-4 sm:px-8 py-4 shadow-xs" id="sleek-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left Brand info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#006633] flex items-center justify-center rounded-lg text-white font-extrabold shadow-sm" id="un-brand-logo">
              UN
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold text-slate-400">UNIVERSIDAD NACIONAL DE COLOMBIA</span>
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                <span className="text-[10px] font-mono text-slate-400 uppercase">Sede Bogotá</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none mt-0.5">
                Facultad de Ingeniería <span className="text-[#006633] font-medium">| Programa de Egresados</span>
              </h2>
            </div>
          </div>

        </div>
      </header>

      {/* HERO SECTION DESIGN BASED ON USER REQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-[#032314] text-white p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-md border border-emerald-950/40">
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,#fff_12%,transparent_12%,transparent_88%,#fff_88%),linear-gradient(135deg,#fff_12%,transparent_12%,transparent_88%,#fff_88%)] bg-[size:30px_30px] pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                <Sparkles size={11} className="text-yellow-400" />
                PORTAFOLIO OFICIAL DISPONIBLE 2026
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-none">
                Plan de Acción de Egresados <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-yellow-300">UNAL 2026</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* CORE BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">

        {/* ========================================== */}
        {/* DROPDOWN MENU 1: ACTIVIDADES REALIZADAS     */}
        {/* ========================================== */}
        <section className="mb-6" id="menu-realizadas">
          
          {/* Header trigger button */}
          <button
            onClick={() => setIsRealizedOpen(!isRealizedOpen)}
            className="w-full text-left bg-white border border-slate-200 hover:bg-slate-50/50 p-4 rounded-xl flex items-center justify-between shadow-xs transition cursor-pointer"
            aria-expanded={isRealizedOpen}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-[#006633]">
                <CheckCircle size={18} />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  Actividades Realizadas
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-bold px-2 py-0.5 rounded-full border border-slate-200">
                    {realizedList.length} Registradas
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Selecciona cualquiera de los eventos realizados para visualizar sus indicadores de asistencia completa y observaciones de comité.
                </p>
              </div>
            </div>

            {/* Expand / collapse Icon */}
            <div className="text-slate-400 hover:text-slate-700 p-1">
              {isRealizedOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {isRealizedOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="bg-slate-50/50 border-x border-b border-slate-200 rounded-b-xl p-4 sm:p-6 space-y-6">
                  
                  {/* DROPDOWN EVENT SELECTOR */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs">
                    <label htmlFor="realized-select" className="block text-xs font-bold text-slate-700 mb-2 font-mono uppercase tracking-wider">
                      Seleccionar Evento Realizado:
                    </label>
                    <select
                      id="realized-select"
                      value={currentRealized?.id || ''}
                      onChange={(e) => setSelectedRealizedId(e.target.value)}
                      className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg p-2.5 font-bold text-slate-800 focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633] transition"
                    >
                      {realizedList.map((act) => (
                        <option key={act.id} value={act.id}>
                          {act.name} ({act.semester})
                        </option>
                      ))}
                    </select>
                  </div>

                  {currentRealized ? (
                    <>
                      {/* INDICATORS OF ATTENDANCE FOR THE SELECTED EVENT */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs" id="realized-indicators">
                        <span className="text-[10px] font-mono text-[#006633] font-bold uppercase tracking-wider block mb-3">
                          📊 Indicadores de Asistencia del Evento Seleccionado
                        </span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          
                          {/* Metric 1: Expected */}
                          <div className="flex items-center gap-3 bg-[#F8FAFC] border border-slate-100 p-3.5 rounded-lg">
                            <div className="p-2.5 bg-slate-100 text-slate-600 rounded-md">
                              <Users size={16} />
                            </div>
                            <div>
                              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Meta Cobertura Esperada</p>
                              <p className="text-sm sm:text-base font-extrabold text-slate-705 font-mono">
                                {currentRealized.expectedCoverage}
                              </p>
                            </div>
                          </div>

                          {/* Metric 2: Actual */}
                          <div className="flex items-center gap-3 bg-[#F0FDF4] border border-emerald-100/50 p-3.5 rounded-lg">
                            <div className="p-2.5 bg-emerald-50 text-[#006633] rounded-md">
                              <CheckCircle size={16} />
                            </div>
                            <div>
                              <p className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider">Asistencia Real Registrada</p>
                              <p className="text-sm sm:text-base font-extrabold text-[#006633] font-mono">
                                {currentRealized.actualCoverage}
                              </p>
                            </div>
                          </div>

                          {/* Metric 3: Percentage efficiency */}
                          <div className="flex items-center gap-3 bg-slate-800 text-white p-3.5 rounded-lg shadow-sm">
                            <div className="p-2.5 bg-slate-700 text-emerald-300 rounded-md">
                              <TrendingUp size={16} />
                            </div>
                            <div className="flex-1">
                              {currentRealized.expectedCoverageVal && currentRealized.actualCoverageVal ? (
                                <>
                                  <div className="flex justify-between items-baseline">
                                    <p className="text-[10px] font-mono text-slate-300 uppercase tracking-wider">Cumplimiento Técnico</p>
                                    <span className="text-xs font-mono font-black text-yellow-300">
                                      {Math.round((currentRealized.actualCoverageVal / currentRealized.expectedCoverageVal) * 100)}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                    <div 
                                      className="bg-yellow-400 h-full rounded-full" 
                                      style={{ width: `${Math.min(100, Math.round((currentRealized.actualCoverageVal / currentRealized.expectedCoverageVal) * 100))}%` }} 
                                    />
                                  </div>
                                </>
                              ) : (
                                <div>
                                  <p className="text-[10px] font-mono text-slate-300 uppercase tracking-wider">Cumplimiento Técnico</p>
                                  <span className="text-xs font-sans font-bold text-yellow-300">Aforo / Convocatoria Nominal</span>
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* DETAILED INFORMATION TABLE (NO DESCRIPTION COLUMN) */}
                      <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden">
                        <h3 className="bg-slate-900 text-white text-center font-bold text-xs py-2 uppercase tracking-widest font-mono">
                          TABLA DETALLE DE ACTIVIDAD SELECCIONADA
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs font-sans">
                            <thead>
                              <tr className="bg-slate-100 text-slate-700 font-mono text-[10px] tracking-wider uppercase border-b border-slate-200">
                                <th className="p-3 border-r border-[#E2E8F0] w-1/3 text-slate-700">CONCEPTO / INDICADOR</th>
                                <th className="p-3 text-slate-700">REGISTRO SGE Y LOGÍSTICA DE EGRESADOS</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-150">
                              <tr>
                                <td className="p-3 border-r border-[#E2E8F0] font-bold text-slate-600 bg-slate-50/50 font-mono text-[10px]">ACTIVIDAD</td>
                                <td className="p-3 font-extrabold text-slate-900 text-sm">{currentRealized.name}</td>
                              </tr>
                              <tr>
                                <td className="p-3 border-r border-[#E2E8F0] font-bold text-slate-600 bg-slate-50/50 font-mono text-[10px]">CATEGORÍA OFICIAL</td>
                                <td className="p-3">
                                  <span className="text-[10px] font-mono tracking-wider font-bold uppercase px-2 py-0.5 rounded border inline-block bg-slate-100 text-slate-800">
                                    {currentRealized.category}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-400 ml-2">Periodo {currentRealized.semester}</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-3 border-r border-[#E2E8F0] font-bold text-slate-600 bg-slate-50/50 font-mono text-[10px]">COBERTURA ESPERADA (META)</td>
                                <td className="p-3 font-semibold text-slate-705">{currentRealized.expectedCoverage}</td>
                              </tr>
                              <tr>
                                <td className="p-3 border-r border-[#E2E8F0] font-bold text-slate-600 bg-slate-50/50 font-mono text-[10px]">COBERTURA REALIZADA (ASISTENCIA)</td>
                                <td className="p-3 font-extrabold text-[#006633] bg-[#F0FDF4]/50">{currentRealized.actualCoverage}</td>
                              </tr>
                              <tr>
                                <td className="p-3 border-r border-[#E2E8F0] font-bold text-slate-600 bg-slate-50/50 font-mono text-[10px]">FECHA DE REALIZACIÓN</td>
                                <td className="p-3 font-mono font-semibold text-slate-800">{currentRealized.date}</td>
                              </tr>
                              <tr>
                                <td className="p-3 border-r border-[#E2E8F0] font-bold text-slate-600 bg-slate-50/50 font-mono text-[10px]">OBSERVACIONES Y LOGROS CLAVE</td>
                                <td className="p-3 leading-relaxed italic text-slate-705">
                                  {currentRealized.observations || "Sin observaciones adicionales registradas."}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-slate-400 italic font-sans">
                      Por favor, seleccione un evento realizado de la lista para visualizar sus detalles.
                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ========================================== */}
        {/* DROPDOWN MENU 2: ACTIVIDADES PRÓXIMAS TO DO */}
        {/* ========================================== */}
        <section className="mb-12" id="menu-proximas">
          
          {/* Header trigger button */}
          <button
            onClick={() => setIsUpcomingOpen(!isUpcomingOpen)}
            className="w-full text-left bg-white border border-slate-200 hover:bg-slate-50/50 p-4 rounded-xl flex items-center justify-between shadow-xs transition cursor-pointer"
            aria-expanded={isUpcomingOpen}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                <Calendar size={18} />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  Actividades Próximas a Realizar
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-bold px-2 py-0.5 rounded-full border border-slate-200">
                    {upcomingList.length} Planeadas
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Selecciona cualquiera de los eventos futuros planeados para visualizar su fecha tentativa de realización, metas de aforo y observaciones.
                </p>
              </div>
            </div>

            {/* Expand / collapse Icon */}
            <div className="text-slate-400 hover:text-slate-700 p-1">
              {isUpcomingOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {isUpcomingOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="bg-slate-50/50 border-x border-b border-slate-200 rounded-b-xl p-4 sm:p-6 space-y-6">
                  
                  {/* DROPDOWN EVENT SELECTOR */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs">
                    <label htmlFor="upcoming-select" className="block text-xs font-bold text-slate-700 mb-2 font-mono uppercase tracking-wider">
                      Seleccionar Evento Próximo:
                    </label>
                    <select
                      id="upcoming-select"
                      value={currentUpcoming?.id || ''}
                      onChange={(e) => setSelectedUpcomingId(e.target.value)}
                      className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg p-2.5 font-bold text-slate-800 focus:outline-[#006633] focus:ring-1 focus:ring-[#006633] transition"
                    >
                      {upcomingList.map((act) => (
                        <option key={act.id} value={act.id}>
                          {act.name} ({act.semester})
                        </option>
                      ))}
                    </select>
                  </div>

                  {currentUpcoming ? (
                    <>
                      {/* DETAILED INFORMATION TABLE (NO DESCRIPTION COLUMN) */}
                      <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden">
                        <h3 className="bg-[#032314] text-white text-center font-bold text-xs py-2 uppercase tracking-widest font-mono">
                          PLANIFICACIÓN DETALLADA — EVENTO SELECCIONADO
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs font-sans">
                            <thead>
                              <tr className="bg-slate-100 text-slate-700 font-mono text-[10px] tracking-wider uppercase border-b border-slate-200">
                                <th className="p-3 border-r border-[#E2E8F0] w-1/3 text-slate-700">CONCEPTO / INDICADOR</th>
                                <th className="p-3 text-slate-700">DETALLES PROYECTADOS PARA EL PERIODO 2026-2</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-150">
                              <tr>
                                <td className="p-3 border-r border-[#E2E8F0] font-bold text-slate-600 bg-slate-50/50 font-mono text-[10px]">ACTIVIDAD PLANEADA</td>
                                <td className="p-3 font-extrabold text-slate-900 text-sm">{currentUpcoming.name}</td>
                              </tr>
                              <tr>
                                <td className="p-3 border-r border-[#E2E8F0] font-bold text-slate-600 bg-slate-50/50 font-mono text-[10px]">CATEGORÍA OFICIAL</td>
                                <td className="p-3">
                                  <span className="text-[10px] font-mono tracking-wider font-bold uppercase px-2 py-0.5 rounded border inline-block bg-[#FFFBEB] text-amber-800 border-amber-200">
                                    {currentUpcoming.category}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-400 ml-2">Periodo {currentUpcoming.semester}</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-3 border-r border-[#E2E8F0] font-bold text-slate-600 bg-slate-50/50 font-mono text-[10px]">COBERTURA ESPERADA (METAS DE CONVOCATORIA)</td>
                                <td className="p-3 font-bold text-slate-700 flex items-center gap-1.5 mt-1.5">
                                  <Users size={14} className="text-slate-400" />
                                  {currentUpcoming.expectedCoverage}
                                </td>
                              </tr>
                              <tr>
                                <td className="p-3 border-r border-[#E2E8F0] font-bold text-slate-600 bg-slate-50/50 font-mono text-[10px]">FECHA TENTATIVA DE REALIZACIÓN</td>
                                <td className="p-3 font-mono font-extrabold text-[#006633] bg-[#F0FDF4]/50">{currentUpcoming.date}</td>
                              </tr>
                              <tr>
                                <td className="p-3 border-r border-[#E2E8F0] font-bold text-slate-600 bg-slate-50/50 font-mono text-[10px]">OBSERVACIONES Y NOTAS DE PLANEACIÓN</td>
                                <td className="p-3 leading-relaxed italic text-slate-705">
                                  {currentUpcoming.observations || "Sin observaciones o notas registradas para esta planificación."}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-slate-400 italic font-sans">
                      Por favor, seleccione un evento próximo de la lista para visualizar sus detalles.
                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* COMPARATIVE ANALYSIS (D3 CHART EMBEDDED SAFELY AS GENERAL COMPLIANCE) */}
        <section className="bg-white border border-slate-200 rounded-xl p-5" id="compliance-chart">
          <div className="mb-4">
            <h3 className="text-sm font-extrabold uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <Award size={16} className="text-[#006633]" />
              Análisis Comparativo Gráfico - Aforo Realizado vs Esperado
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Análisis interactivo de asistencia registrada para las actividades ejecutadas en la Facultad de Ingeniería. Da hover en las barras para analizar el porcentaje de cumplimiento logístico.
            </p>
          </div>
          <DashboardCharts activities={activities} />
        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-12 text-xs text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-[#006633] rounded-lg">
              <FileText size={20} />
            </div>
            <div>
              <p className="font-extrabold text-slate-800">Programa de Egresados - Facultad de Ingeniería</p>
              <p className="text-[11px] text-slate-400 mt-0.5">© 2026 Universidad Nacional de Colombia | Sede Bogotá - Todos los derechos reservados</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-[11px] font-semibold text-slate-550">
            <button 
              onClick={() => alert('Programa de Egresados FI - egresados_fibog@unal.edu.co')}
              className="hover:text-[#006633] transition flex items-center gap-1 cursor-pointer"
            >
              <Mail size={12} />
              Contacto Soporte
            </button>
            <span className="text-slate-350">|</span>
            <a 
              href="https://ingenieria.bogota.unal.edu.co" 
              target="_blank" 
              referrerPolicy="no-referrer"
              className="hover:text-[#006633] transition flex items-center gap-1"
            >
              <ExternalLink size={12} />
              Portal de Ingeniería
            </a>
          </div>
        </div>
      </footer>

      {/* REGISTRATION MODAL */}
      <RegistrationModal
        activity={activeRegActivity}
        onClose={() => setActiveRegActivity(null)}
        onSuccess={handleRegisterSuccess}
      />

      {/* NEW ACTIVITY CREATION MODAL */}
      <AnimatePresence>
        {isNewActivityOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden"
              id="new-activity-modal"
            >
              <div className="bg-[#032314] text-white p-5 flex justify-between items-center">
                <h3 className="font-bold text-base font-display flex items-center gap-1.5 uppercase tracking-wide">
                  <Plus size={18} className="text-emerald-400" />
                  Agregar Nueva Actividad al Plan 2026
                </h3>
                <button
                  onClick={() => setIsNewActivityOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddActivity} className="p-6 space-y-4 text-xs">
                
                {/* Name */}
                <div>
                  <label htmlFor="form-name" className="block font-bold text-slate-700 mb-1">
                    Nombre de la Actividad <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="form-name"
                    type="text"
                    required
                    value={newActivity.name}
                    onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-[#006633]"
                    placeholder="Ej. Taller de Orientación laboral"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="form-desc" className="block font-bold text-slate-700 mb-1">
                    Descripción Detallada <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="form-desc"
                    required
                    rows={3}
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs leading-relaxed"
                    placeholder="Escribe la descripción de la actividad..."
                  />
                </div>

                {/* Status and Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="form-status" className="block font-bold text-slate-700 mb-1">
                      Estado
                    </label>
                    <select
                      id="form-status"
                      value={newActivity.status}
                      onChange={(e) => setNewActivity({ ...newActivity, status: e.target.value as any })}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Realizado">Realizado / Ejecutado</option>
                      <option value="Próximo">Próximo / Planeado</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="form-category" className="block font-bold text-slate-700 mb-1">
                      Categoría
                    </label>
                    <select
                      id="form-category"
                      value={newActivity.category}
                      onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value as any })}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Graduación">Graduación</option>
                      <option value="Inducción">Inducción</option>
                      <option value="Comunidad">Comunidad</option>
                      <option value="Cultura">Cultura</option>
                      <option value="Bienestar">Bienestar</option>
                      <option value="Revista">Revista</option>
                      <option value="Conferencias">Conferencias</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="form-semester" className="block font-bold text-slate-700 mb-1">
                      Semestre
                    </label>
                    <select
                      id="form-semester"
                      value={newActivity.semester}
                      onChange={(e) => setNewActivity({ ...newActivity, semester: e.target.value as any })}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="2026-1">Semestre I (2026-1)</option>
                      <option value="2026-2">Semestre II (2026-2)</option>
                      <option value="Todo el año">Frecuencia Continua</option>
                    </select>
                  </div>
                </div>

                {/* Expected Coverage */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="form-expected" className="block font-bold text-slate-700 mb-1">
                      Aforo Esperado (Texto)
                    </label>
                    <input
                      id="form-expected"
                      type="text"
                      value={newActivity.expectedCoverage}
                      onChange={(e) => setNewActivity({ ...newActivity, expectedCoverage: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                      placeholder="Ej. 150 Inscritos"
                    />
                  </div>

                  <div>
                    <label htmlFor="form-expected-val" className="block font-bold text-slate-700 mb-1">
                      Aforo Meta Numérico
                    </label>
                    <input
                      id="form-expected-val"
                      type="number"
                      value={newActivity.expectedCoverageVal}
                      onChange={(e) => setNewActivity({ ...newActivity, expectedCoverageVal: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg"
                      placeholder="Ej. 150"
                    />
                  </div>
                </div>

                {/* If Realized, get coverage reached */}
                {newActivity.status === 'Realizado' && (
                  <div className="grid grid-cols-2 gap-3 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                    <div>
                      <label htmlFor="form-actual" className="block font-bold text-emerald-800 mb-1">
                        Cobertura Lograda (Texto)
                      </label>
                      <input
                        id="form-actual"
                        type="text"
                        value={newActivity.actualCoverage}
                        onChange={(e) => setNewActivity({ ...newActivity, actualCoverage: e.target.value })}
                        className="w-full px-3 py-1.5 border border-emerald-200 rounded-lg bg-white"
                        placeholder="Ej. 132 Asistentes"
                      />
                    </div>

                    <div>
                      <label htmlFor="form-actual-val" className="block font-bold text-emerald-800 mb-1">
                        Asistió Real Numérico
                      </label>
                      <input
                        id="form-actual-val"
                        type="number"
                        value={newActivity.actualCoverageVal}
                        onChange={(e) => setNewActivity({ ...newActivity, actualCoverageVal: e.target.value })}
                        className="w-full px-3 py-1.5 border border-emerald-200 rounded-lg bg-white"
                        placeholder="Ej. 132"
                      />
                    </div>
                  </div>
                )}

                {/* Date */}
                <div>
                  <label htmlFor="form-date" className="block font-bold text-slate-700 mb-1">
                    Fecha de Realización <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="form-date"
                    type="text"
                    required
                    value={newActivity.date}
                    onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    placeholder="Ej. 28-ene-2026 o Semana de Inducción 2026-2"
                  />
                </div>

                {/* Observations */}
                <div>
                  <label htmlFor="form-obs" className="block font-bold text-slate-700 mb-1">
                    Observaciones Técnicas / Notas
                  </label>
                  <input
                    id="form-obs"
                    type="text"
                    value={newActivity.observations}
                    onChange={(e) => setNewActivity({ ...newActivity, observations: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    placeholder="Notas relevantes del comité curricular..."
                  />
                </div>

                {/* Submit buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsNewActivityOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-lg transition"
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#006633] hover:bg-[#00552b] text-white font-bold rounded-lg shadow-sm transition active:scale-95"
                  >
                    Guardar Actividad
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
