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
            // ¡Magia! Lanzar confeti en el dispositivo del cliente
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.5 },
              colors: ['#ffffff', '#eab308', '#22c55e'] // Blanco, Oro, Verde
            });
            
            toast.success('¡Nuevo sello agregado a tu pase!', {
              description: `Ahora tienes ${newStamps} sellos.`,
              duration: 5000,
            });

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
