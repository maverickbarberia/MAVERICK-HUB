'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClientFromAdmin } from '@/app/actions'

export function AddClientModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    setError(null)
    
    const result = await createClientFromAdmin(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsPending(false)
    } else {
      setIsOpen(false)
      setIsPending(false)
      router.refresh() // Recargar la página para ver el nuevo cliente
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-white text-black font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95"
      >
        <Plus size={18} />
        <span className="hidden sm:inline">Nuevo Cliente</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative w-full max-w-md backdrop-blur-2xl bg-white/5 border border-white/10 p-6 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-6">Agregar Nuevo Cliente</h2>
            
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-1">
                  Nombre Completo
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-black/40 text-white rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-600"
                />
              </div>

              <div>
                <label htmlFor="document_number" className="block text-sm font-medium text-gray-300 mb-1">
                  Número de Documento
                </label>
                <input
                  id="document_number"
                  name="document_number"
                  type="text"
                  required
                  placeholder="Ej. 12345678"
                  className="w-full bg-black/40 text-white rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-600"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Guardando...' : 'Crear Cliente'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
