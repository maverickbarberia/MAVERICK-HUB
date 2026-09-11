'use client'

import Image from 'next/image'
import Link from 'next/link'
import { User, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-4 relative z-10 overflow-x-clip">
      
      {/* Luz de fondo sutil y dinámica */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-white/5 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="w-full max-w-md flex flex-col items-center relative z-10">
        
        {/* LOGO Animado */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 w-full flex justify-center"
        >
          <div className="relative w-[85vw] max-w-[320px] sm:max-w-90 h-35 sm:h-45 overflow-hidden flex items-center justify-center">
            <video 
              src="/promo.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
              style={{ WebkitTransform: "translateZ(0)" }} // Fix for some iOS Safari rendering issues
              className="absolute w-full h-full object-cover object-center mix-blend-screen drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] pointer-events-none"
            />
          </div>
        </motion.div>

        {/* Línea Separadora Minimalista */}
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
          className="w-32 h-px bg-linear-to-r from-transparent via-white/30 to-transparent mb-8"
        />

        {/* Botones de Acceso */}
        <div className="w-full space-y-4 px-4 sm:px-0">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link 
              href="/login/client" 
              className="group relative flex items-center justify-between w-full bg-white text-black px-6 py-4 rounded-2xl hover:bg-gray-200 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="bg-black text-white p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <User size={20} />
                </div>
                <span className="font-bold text-lg tracking-wide">Soy Cliente</span>
              </div>
              <span className="text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all duration-300">
                →
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link 
              href="/login/admin" 
              className="group flex items-center justify-between w-full bg-transparent text-white border border-white/10 hover:border-white/30 px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-white/5 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/5 p-2.5 rounded-xl group-hover:bg-white/10 transition-colors">
                  <ShieldCheck size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <span className="font-medium tracking-wide text-gray-300 group-hover:text-white transition-colors">
                  Soy Administrador
                </span>
              </div>
              <span className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                →
              </span>
            </Link>
          </motion.div>

        </div>

        {/* Link de Registro */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500">
            ¿No tienes una cuenta?{' '}
            <Link href="/register/client" className="text-white font-bold hover:underline underline-offset-4 decoration-white/30 transition-all">
              Regístrate aquí
            </Link>
          </p>
        </motion.div>

      </div>
    </main>
  )
}
