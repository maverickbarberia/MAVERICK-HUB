'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface StampCardProps {
  stampsEarned: number;
}

export function StampCard({ stampsEarned }: StampCardProps) {
  const totalStamps = 12;
  const stamps = Array.from({ length: totalStamps }, (_, i) => i + 1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md mx-auto relative group"
    >
      {/* Glow de fondo para la tarjeta */}
      <div className="absolute -inset-0.5 bg-linear-to-r from-white/10 via-white/5 to-white/10 rounded-[2.5rem] blur-md opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-300" />
      
      <div className="relative backdrop-blur-3xl bg-[#0a0a0a]/90 p-6 sm:p-8 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
        
        {/* Efectos de luz interna */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full filter blur-[60px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8B9A7B]/5 rounded-full filter blur-[60px] pointer-events-none mix-blend-screen" />
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-gray-400 tracking-[0.25em] uppercase mb-2">
            Pase Maverick
          </h2>
          <div className="h-0.5 w-12 bg-linear-to-r from-transparent via-[#8B9A7B]/50 to-transparent" />
        </div>
        
        <div className="grid grid-cols-4 gap-3 sm:gap-4 relative z-10">
          {stamps.map((stampNumber, index) => {
            const isEarned = stampNumber <= stampsEarned;
            const isDiscount = stampNumber === 4 || stampNumber === 8;
            const isFreeCut = stampNumber === 12;
            const isSpecial = isDiscount || isFreeCut;

            return (
              <motion.div
                key={stampNumber}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={clsx(
                  "relative flex items-center justify-center aspect-square rounded-2xl border transition-all duration-500 overflow-hidden",
                  isEarned
                    ? isSpecial 
                      ? "border-[#C5D8AD]/60 bg-linear-to-br from-[#C5D8AD] via-[#8B9A7B] to-[#46533D] text-white shadow-[0_0_20px_rgba(139,154,123,0.4)] scale-105 z-10"
                      : "border-white/60 bg-linear-to-br from-gray-100 to-gray-300 text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    : isSpecial
                      ? "border-[#8B9A7B]/30 bg-[#46533D]/20 text-[#8B9A7B]/80 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                      : "border-white/5 bg-black/40 text-gray-600 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                )}
              >
                {/* Overlay brillo al estar ganado */}
                {isEarned && (
                  <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                )}

                {isDiscount ? (
                  <span className={clsx(
                    "font-black text-[13px] sm:text-[15px] relative z-10 tracking-tighter",
                    isEarned ? "drop-shadow-md text-white" : ""
                  )}>50%</span>
                ) : isFreeCut ? (
                  <span className={clsx(
                    "font-black text-[9px] sm:text-[10px] leading-[1.1] text-center px-1 relative z-10 uppercase tracking-wide",
                    isEarned ? "drop-shadow-md text-white" : ""
                  )}>Corte<br/>Gratis</span>
                ) : (
                  <Image 
                    src={isEarned ? "/logo-icon-dark.png" : "/logo-icon-light.png"} 
                    alt="Sello" 
                    width={40} 
                    height={20}
                    className={clsx(
                      "w-[60%] h-auto object-contain transition-all duration-500",
                      isEarned ? "drop-shadow-sm opacity-100 scale-110" : "opacity-30 grayscale"
                    )}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10 text-center relative z-10">
          <p className="text-sm font-medium text-gray-400 flex items-center justify-center gap-2">
            {stampsEarned >= 12 
              ? <span className="text-transparent bg-clip-text bg-linear-to-r from-[#C5D8AD] to-[#8B9A7B] font-black tracking-widest uppercase animate-pulse">¡Corte Gratis Desbloqueado!</span>
              : <>Te faltan <span className="text-white font-black text-base px-1 bg-white/10 rounded-md py-0.5 min-w-6 inline-block">{12 - stampsEarned}</span> sellos para tu corte gratis.</>}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
