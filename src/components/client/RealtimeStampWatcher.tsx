'use client'

import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'

export function RealtimeStampWatcher({ clientId, initialStamps }: { clientId: string, initialStamps: number }) {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Suscribirse a cambios en la tabla clients para este clientId
    const channel = supabase
      .channel('realtime-client-stamps')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'clients',
          filter: `id=eq.${clientId}`,
        },
        (payload) => {
          const newStamps = payload.new.stamps_earned;
          
          // Si los sellos aumentaron
          if (newStamps > initialStamps) {
            
            // Lógica para Promociones Alcanzadas (4, 8 o 12 sellos)
            if (newStamps === 4 || newStamps === 8 || newStamps === 12) {
              // Animación EXAGERADA de celebración
              const duration = 3000;
              const end = Date.now() + duration;

              (function frame() {
                confetti({
                  particleCount: 5,
                  angle: 60,
                  spread: 55,
                  origin: { x: 0 },
                  colors: ['#8B9A7B', '#ffffff']
                });
                confetti({
                  particleCount: 5,
                  angle: 120,
                  spread: 55,
                  origin: { x: 1 },
                  colors: ['#8B9A7B', '#ffffff']
                });

                if (Date.now() < end) {
                  requestAnimationFrame(frame);
                }
              }());

              const promoText = newStamps === 12 ? '¡CORTE GRATIS!' : '¡50% DE DESCUENTO!';
              
              toast.success(`¡FELICIDADES! 🎉`, {
                description: `Has alcanzado tu recompensa: ${promoText}`,
                duration: 8000,
              });

            } else {
              // Animación normal para un sello regular
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ffffff', '#22c55e'] 
              });
              
              toast.success('¡Sello sumado!', {
                description: `Ahora tienes ${newStamps} sellos en tu pase.`,
                duration: 4000,
              });
            }

            // Refrescar los datos de la página
            router.refresh();
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [clientId, initialStamps, router, supabase])

  // Este componente es invisible
  return null;
}
