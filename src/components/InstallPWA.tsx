'use client'

import { useState, useEffect } from 'react'
import { Download, X, Smartphone, Info } from 'lucide-react'
import Image from 'next/image'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

// Variable global en memoria para compartir el evento de instalación entre componentes
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // 1. Verificar si ya está ejecutándose como aplicación instalada (standalone)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true

    if (isStandalone) {
      return // Ya es app instalada, no mostrar nada
    }

    // 2. Verificar si el usuario ya descartó el aviso en esta sesión
    const isDismissed = sessionStorage.getItem('maverick_pwa_dismissed')
    if (isDismissed) {
      return
    }

    // 3. Detectar dispositivo iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(isIosDevice)

    // 4. Capturar el evento de instalación de Android Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      globalDeferredPrompt = promptEvent
      setDeferredPrompt(promptEvent)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Mostrar el banner automáticamente para facilitar la instalación
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    const handleAppInstalled = () => {
      setIsVisible(false)
      setDeferredPrompt(null)
      globalDeferredPrompt = null
    }
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    sessionStorage.setItem('maverick_pwa_dismissed', 'true')
  }

  const handleInstallClick = async () => {
    const prompt = deferredPrompt || globalDeferredPrompt
    if (prompt) {
      try {
        await prompt.prompt()
        const { outcome } = await prompt.userChoice
        if (outcome === 'accepted') {
          setIsVisible(false)
        }
        setDeferredPrompt(null)
        globalDeferredPrompt = null
      } catch (err) {
        console.error('Error al solicitar instalación PWA:', err)
        setShowInstructions(true)
      }
    } else {
      setShowInstructions(true)
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* Banner flotante de instalación */}
      <div className="fixed bottom-5 left-4 right-4 z-50 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="relative flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#09090b]/95 backdrop-blur-xl border border-zinc-700/80 shadow-[0_12px_40px_rgba(0,0,0,0.9)]">
          {/* Logo y textos */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-11 h-11 rounded-xl bg-black border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
              <Image
                src="/icon-192.png"
                alt="Maverick App"
                width={44}
                height={44}
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white tracking-wide truncate">
                Maverick Barbería
              </p>
              <p className="text-xs text-zinc-400 truncate">
                Instalar App en tu celular
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-zinc-200 active:scale-95 text-black text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              <Download size={14} className="stroke-[2.5]" />
              <span>Instalar</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 text-zinc-400 hover:text-white active:scale-90 hover:bg-zinc-800/80 rounded-xl transition-all cursor-pointer"
              title="Cerrar"
              aria-label="Cerrar aviso de instalación"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal interactivo de instrucciones */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-700 p-5 shadow-2xl">
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white">
                <Smartphone size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Instalar App Maverick</h3>
                <p className="text-xs text-zinc-400">Pasos para tu teléfono</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs text-zinc-300">
                <p>En iPhone (Safari):</p>
                <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-2">
                  <p>1. Toca el botón <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba).</p>
                  <p>2. Desliza hacia abajo y selecciona <strong>&quot;Agregar a la pantalla de inicio&quot;</strong>.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-zinc-300">
                <p className="font-semibold text-white">En Android (Google Chrome):</p>
                <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-2.5">
                  <p>1. Toca los <strong>tres puntos verticales (⋮)</strong> arriba a la derecha en Chrome.</p>
                  <p>2. Selecciona la opción <strong>&quot;Instalar aplicación&quot;</strong> (o &quot;Agregar a la pantalla principal&quot;).</p>
                  <p>3. Pulsa <strong>&quot;Instalar&quot;</strong> para confirmar.</p>
                </div>
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2 text-amber-200 text-[11px]">
                  <Info size={15} className="shrink-0 mt-0.5 text-amber-400" />
                  <span>
                    Si tenías un acceso directo anterior en tu pantalla de inicio, <strong>bórralo primero</strong> y borra la caché en Chrome para que se instale con el nuevo icono oficial.
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full mt-4 py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-zinc-200 active:scale-[0.98] transition cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  )
}
