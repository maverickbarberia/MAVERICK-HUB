'use client'

import { useState, useRef, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, X, Loader2, AlertCircle } from 'lucide-react'
import { addTeamMember } from '@/app/actions'
import { toast } from 'sonner'

interface AddTeamMemberModalProps {
  role: 'BARBER' | 'STAFF'
}

export function AddTeamMemberModal({ role }: AddTeamMemberModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    if (!formRef.current) return
    const formData = new FormData(formRef.current)
    formData.append('role', role)
    
    startTransition(async () => {
      const result = await addTeamMember(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        toast.success(`${role === 'BARBER' ? 'Barbero' : 'Personal'} agregado exitosamente`)
        setIsOpen(false)
      }
    })
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95"
      >
        <UserPlus size={18} />
        Añadir {role === 'BARBER' ? 'Barbero' : 'Personal'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111] border border-white/10 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <div className="flex justify-between items-center p-5 border-b border-white/10 bg-white/5">
                <h2 className="text-xl font-bold text-white">Nuevo {role === 'BARBER' ? 'Barbero' : 'Personal'}</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-5">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm flex items-start gap-2">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium text-gray-300 ml-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    name="fullName" 
                    required
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-base"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full bg-white text-black hover:bg-gray-200 text-base font-bold py-3.5 rounded-2xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
