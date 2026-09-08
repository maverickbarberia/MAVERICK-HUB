'use client'

import { useState, useTransition } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { CheckCircle, ScanLine } from 'lucide-react'
import { addStampToClient } from '@/app/actions'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'

export default function AdminPage() {
  const [scannedUserId, setScannedUserId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  
  return (
    <main className="min-h-[100dvh] p-4 flex flex-col items-center">
      <div className="w-full max-w-md pt-2 space-y-6 relative z-10 mx-auto">
        
        {/* Cabecera del Escáner */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Escáner QR</h1>
          <p className="text-gray-400 text-sm mt-1">
            Escanea el código del cliente para sumar sellos.
          </p>
        </div>

        {/* Escáner de QR */}
        <div className="backdrop-blur-xl bg-white/2 border border-white/8 p-6 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] mx-auto overflow-hidden">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-black/50 flex items-center justify-center relative border border-white/5 shadow-inner">
            
            {!scannedUserId ? (
              <>
                <Scanner
                  onScan={(result) => {
                    if (result && result.length > 0) {
                      setScannedUserId(result[0].rawValue)
                    }
                  }}
                  components={{
                    finder: true,
                  }}
                />
                {/* Overlay visual para el escáner */}
                <div className="absolute inset-0 pointer-events-none border-2 border-white/10 rounded-2xl z-10 flex flex-col items-center justify-center">
                  <div className="w-48 h-48 border-2 border-dashed border-white/30 rounded-3xl opacity-50 relative">
                     <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-3xl"></div>
                     <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-3xl"></div>
                     <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-3xl"></div>
                     <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-3xl"></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 text-center flex flex-col items-center justify-center w-full h-full bg-black/80 backdrop-blur-md">
                <CheckCircle size={60} strokeWidth={1.5} className="text-green-500 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                
                <h3 className="text-white font-bold text-xl mb-2">Cliente Identificado</h3>
                <p className="text-gray-400 text-xs mb-6 break-all max-w-62.5 bg-white/5 p-3 rounded-xl border border-white/10">
                  {scannedUserId}
                </p>
                
                {/* Botón para sumar sello */}
                <button
                  onClick={() => {
                    startTransition(async () => {
                      if (scannedUserId) {
                        try {
                          await addStampToClient(scannedUserId);
                          confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 },
                            colors: ['#ffffff', '#22c55e', '#a855f7']
                          });
                          toast.success('¡Sello sumado exitosamente!');
                          setScannedUserId(null); // Resetear para el siguiente escaneo
                        } catch (error) {
                          toast.error('Hubo un error al sumar el sello.');
                        }
                      }
                    });
                  }}
                  disabled={isPending}
                  className="w-full bg-white text-black font-bold px-6 py-3.5 rounded-xl hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98] mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? 'Guardando...' : 'Sumar Sello'}
                </button>

                <button
                  onClick={() => setScannedUserId(null)}
                  className="w-full bg-transparent text-gray-400 font-medium px-6 py-3 rounded-xl hover:text-white transition-colors border border-transparent hover:border-white/10 flex items-center justify-center gap-2"
                >
                  <ScanLine size={18} />
                  Escanear otro
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  )
}
