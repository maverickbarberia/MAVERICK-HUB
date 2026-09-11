'use client'

import { useState, useRef, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, User, Loader2, AlertCircle } from 'lucide-react'
import { addStampWithEvidence } from '@/app/actions'

interface AddStampModalProps {
  clientId: string;
}

export function AddStampModal({ clientId }: AddStampModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    if (!formRef.current) return
    const formData = new FormData(formRef.current)
    
    startTransition(async () => {
      const result = await addStampWithEvidence(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setIsOpen(false)
        setPreviewUrl(null)
      }
    })
  }

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex-[1.5] flex bg-white text-black hover:bg-gray-200 text-base font-bold py-3.5 rounded-2xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98] items-center justify-center gap-2"
      >
        <Camera size={20} />
        +1 Sello
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111] border border-white/10 w-full max-w-sm max-h-[90dvh] rounded-3xl shadow-2xl relative flex flex-col"
            >
              <div className="flex justify-between items-center p-5 border-b border-white/10 bg-white/5 shrink-0">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Camera size={20} className="text-green-400" />
                  Evidencia de Pago
                </h2>
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto p-6 scroll-smooth">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  <input type="hidden" name="clientId" value={clientId} />
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm flex items-start gap-2">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Barbero que atendió</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-500" />
                    </div>
                    <input 
                      type="text" 
                      name="barberName" 
                      required
                      placeholder="Ej. Juan, Carlos..."
                      className="w-full bg-black border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-base text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Foto del Comprobante</label>
                  
                  <div className="relative w-full aspect-video bg-black border-2 border-dashed border-white/20 rounded-2xl overflow-hidden group hover:border-white/40 transition-colors">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 group-hover:text-gray-400 transition-colors">
                        <Camera size={32} className="mb-2" />
                        <span className="text-sm font-medium">Tomar o subir foto</span>
                      </div>
                    )}
                    
                    <input 
                      type="file" 
                      name="proofImage" 
                      accept="image/*" 
                      capture="environment"
                      required
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full bg-white text-black hover:bg-gray-200 text-lg font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Registrar Sello'
                  )}
                </button>
              </form>
            </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
