'use client'

import { useState, useRef, useTransition, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, User, Loader2, AlertCircle } from 'lucide-react'
import { addStampWithEvidence } from '@/app/actions'
import { createClient } from '@/utils/supabase/client'

interface AddStampModalProps {
  clientId: string;
  onSuccess?: () => void;
}

export function AddStampModal({ clientId, onSuccess }: AddStampModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [barbers, setBarbers] = useState<{ id: string, full_name: string }[]>([])
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (isOpen) {
      const fetchBarbers = async () => {
        const supabase = createClient()
        const { data } = await supabase
          .from('team_members')
          .select('id, full_name')
          .eq('role', 'BARBER')
          .eq('status', 'ACTIVE')
          
        if (data) setBarbers(data)
      }
      fetchBarbers()
    }
  }, [isOpen])

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
    const barberName = formData.get('barberName') as string
    const file = formData.get('proofImage') as File
    
    if (!barberName || !file || file.size === 0) {
      setError('Debes ingresar el nombre del barbero y subir la foto.')
      return
    }

    startTransition(async () => {
      try {
        const supabase = createClient()
        
        // 1. Subir a Storage directamente desde el cliente
        const fileExt = file.name.split('.').pop() || 'jpg'
        const fileName = `${clientId}-${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('payment_proofs')
          .upload(fileName, file, { contentType: file.type })

        if (uploadError) {
          setError(`Error subiendo foto: ${uploadError.message}`)
          return
        }

        const { data: publicUrlData } = supabase.storage
          .from('payment_proofs')
          .getPublicUrl(fileName)
          
        const proofImageUrl = publicUrlData.publicUrl

        // 2. Llamar al servidor para registrar el sello y auditoría
        const result = await addStampWithEvidence(clientId, barberName, proofImageUrl)
        
        if (result?.error) {
          setError(result.error)
        } else {
          setIsOpen(false)
          setPreviewUrl(null)
          if (onSuccess) onSuccess()
        }
      } catch (err: any) {
        setError('Ocurrió un error inesperado al procesar el sello.')
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
              className="bg-[#111] border border-white/10 w-full max-w-sm max-h-[85dvh] rounded-3xl shadow-2xl relative flex flex-col overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 sm:p-5 border-b border-white/10 bg-white/5 shrink-0">
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

              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                <div className="overflow-y-auto p-4 sm:p-6 scroll-smooth space-y-4 sm:space-y-5 flex-1">
                  <input type="hidden" name="clientId" value={clientId} />
                
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm flex items-start gap-2 shrink-0">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="barberName" className="text-sm font-medium text-gray-300 ml-1">Barbero que atendió</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-500" />
                    </div>
                    <select 
                      id="barberName"
                      name="barberName" 
                      required
                      defaultValue=""
                      className="w-full bg-black border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-base text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all appearance-none"
                    >
                      <option value="" disabled className="text-gray-500">Selecciona el barbero...</option>
                      {barbers.map(b => (
                        <option key={b.id} value={b.full_name}>{b.full_name}</option>
                      ))}
                    </select>
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
              </div>

              <div className="p-4 sm:p-5 border-t border-white/10 bg-black shrink-0">
                  <button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full bg-white text-black hover:bg-gray-200 text-lg font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
