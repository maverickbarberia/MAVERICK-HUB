'use client'

import { useState } from 'react'
import { Edit2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { editClient } from '@/app/actions'

interface EditClientModalProps {
  client: {
    id: string;
    full_name: string;
    document_number: string;
    phone_number?: string | null;
  }
}

export function EditClientModal({ client }: EditClientModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    setError(null)
    
    // Add client id to formData
    formData.append('id', client.id)

    const result = await editClient(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsPending(false)
    } else {
      setIsOpen(false)
      setIsPending(false)
      router.refresh() // Recargar la página para ver el cliente editado
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        title="Editar Cliente"
      >
        <Edit2 size={20} />
        <span>Editar</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative w-full max-w-md backdrop-blur-2xl bg-[#111] border border-white/10 p-6 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-6">Editar Cliente</h2>
            
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
                  defaultValue={client.full_name}
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
                  defaultValue={client.document_number}
                  placeholder="Ej. 12345678"
                  className="w-full bg-black/40 text-white rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-600"
                />
              </div>

              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-300 mb-1">
                  Número de Celular
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  defaultValue={client.phone_number || ''}
                  placeholder="Ej. 3001234567"
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
                {isPending ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
