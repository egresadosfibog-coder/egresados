import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Check } from 'lucide-react';
import { Activity } from '../types';

interface RegistrationModalProps {
  activity: Activity | null;
  onClose: () => void;
  onSuccess: (activityId: string, name: string, email: string) => void;
}

const PROGRAMAS_ING = [
  'Ingeniería de Sistemas y Computación',
  'Ingeniería Civil',
  'Ingeniería Química',
  'Ingeniería Mecánica',
  'Ingeniería Eléctrica',
  'Ingeniería Electrónica',
  'Ingeniería Industrial',
  'Ingeniería Agrícola',
  'Ingeniería de Control'
];

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ activity, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    program: PROGRAMAS_ING[0],
    gradYear: '2026',
    comments: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!activity) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    // Simulate real database store
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(activity.id, formData.name, formData.email);
        onClose();
        setIsSuccess(false);
        setFormData({
          name: '',
          email: '',
          program: PROGRAMAS_ING[0],
          gradYear: '2026',
          comments: ''
        });
      }, 1500);
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden relative"
          id="registration-modal-body"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#006633] to-[#004d26] text-white p-5 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
            <span className="text-[10px] font-mono tracking-widest bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full uppercase">
              {activity.status === 'Realizado' ? 'Consultar / Memoria' : 'Registro de Interés'}
            </span>
            <h3 className="text-xl font-bold mt-2 leading-tight">{activity.name}</h3>
            <p className="text-xs text-emerald-100/80 mt-1 line-clamp-1">{activity.date}</p>
          </div>

          {/* Body */}
          <div className="p-6">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="w-16 h-16 bg-emerald-100 text-[#006633] rounded-full flex items-center justify-center mb-4">
                  <Check size={32} />
                </div>
                <h4 className="text-lg font-bold text-slate-800">¡Registro Exitoso!</h4>
                <p className="text-sm text-slate-500 mt-2 max-w-xs">
                  Hemos guardado tu interés para **{activity.name}**. Te enviaremos toda la información a tu correo institucional.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-slate-500">
                  Completa el siguiente formulario para suscribirte al evento o solicitar las memorias académicas de la Facultad de Ingeniería.
                </p>

                {/* Name */}
                <div>
                  <label htmlFor="user-name" className="block text-xs font-semibold text-slate-600 mb-1">
                    Nombre Completo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="user-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633] transition"
                    placeholder="Ej. Juan Sebastián Pérez"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="user-email" className="block text-xs font-semibold text-slate-600 mb-1">
                    Correo Electrónico <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="user-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#006633] focus:ring-1 focus:ring-[#006633] transition"
                    placeholder="Ej. jsperez@unal.edu.co"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Curricular program */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="user-program" className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Programa de Ingeniería
                    </label>
                    <select
                      id="user-program"
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#006633] transition bg-white"
                      disabled={isSubmitting}
                    >
                      {PROGRAMAS_ING.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="user-gradyear" className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Año de Graduación / Admisión
                    </label>
                    <input
                      id="user-gradyear"
                      type="number"
                      min="1960"
                      max="2026"
                      value={formData.gradYear}
                      onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#006633] transition"
                      placeholder="Ej. 2018"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Comments / Questions */}
                <div>
                  <label htmlFor="user-comments" className="block text-xs font-semibold text-slate-600 mb-1">
                    Aportes / Preguntas para el comité
                  </label>
                  <textarea
                    id="user-comments"
                    rows={2}
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#006633] transition resize-none"
                    placeholder="Escribe aquí si tienes sugerencias de temáticas o dudas adicionales..."
                    disabled={isSubmitting}
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#006633] hover:bg-[#00552b] text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-1">
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Registrando...
                      </span>
                    ) : (
                      <>
                        <Send size={12} />
                        Confirmar Registro
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
