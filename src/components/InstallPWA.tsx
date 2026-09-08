'use client'

import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'

// Interface para el evento de instalación que no viene por defecto en TS
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    // Escuchar el evento que indica que la app se puede instalar
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir que Chrome muestre su propio prompt pequeño
      e.preventDefault()
      // Guardar el evento para dispararlo luego
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Detectar si ya está instalada (Standalone mode)
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback si el navegador no dispara el evento o ya está instalada
      alert("Para instalar la app:\n\nToca los 3 puntos (⋮) arriba a la derecha en Chrome y selecciona 'Instalar aplicación' o 'Añadir a pantalla de inicio'.\n\nSi usas iPhone, toca 'Compartir' y luego 'Agregar a inicio'.");
      return;
    }

    // Mostrar el prompt nativo
    deferredPrompt.prompt()
    
    // Esperar a que el usuario responda
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setIsInstallable(false)
    }
    
    setDeferredPrompt(null)
  }

  // Comentar esto para que el botón SIEMPRE aparezca y sirva de guía si el prompt nativo falla
  // if (!isInstallable) return null

  return (
    <button
      onClick={handleInstallClick}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] ${isInstallable ? 'animate-bounce' : ''}`}
    >
      <Download size={20} />
      Instalar App
    </button>
  )
}
