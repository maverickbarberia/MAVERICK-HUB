import clsx from 'clsx';
import Image from 'next/image';

interface StampCardProps {
  stampsEarned: number;
}

export function StampCard({ stampsEarned }: StampCardProps) {
  // We have 10 stamps in total
  const totalStamps = 10;
  const stamps = Array.from({ length: totalStamps }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-md mx-auto backdrop-blur-2xl bg-white/3 p-6 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/8 relative overflow-hidden">
      
      {/* Decorative Glow inside the card */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full filter blur-2xl pointer-events-none" />
      
      <h2 className="text-lg font-bold text-center mb-6 text-white tracking-[0.2em] uppercase">
        Fidelidad
      </h2>
      
      <div className="grid grid-cols-5 gap-3 sm:gap-4 relative z-10">
        {stamps.map((stampNumber) => {
          const isEarned = stampNumber <= stampsEarned;
          const isDiscount = stampNumber === 5;
          const isFreeCut = stampNumber === 10;

          return (
            <div
              key={stampNumber}
              className={clsx(
                "relative flex items-center justify-center aspect-square rounded-full border-[1.5px] transition-all duration-500 overflow-hidden shadow-inner",
                isEarned
                  ? "border-white bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-[1.02]"
                  : "border-white/10 bg-black/40 text-gray-500 opacity-60"
              )}
            >
              {isDiscount ? (
                <span className="font-black text-sm relative z-10">15%</span>
              ) : isFreeCut ? (
                <span className="font-black text-[9px] sm:text-[10px] leading-tight text-center px-1 relative z-10">Corte<br/>Gratis</span>
              ) : (
                <Image 
                  src={isEarned ? "/logo-icon-dark.png" : "/logo-icon-light.png"} 
                  alt="Sello MAV" 
                  width={40} 
                  height={20}
                  className="w-[65%] h-auto object-contain transition-all duration-300"
                />
              )}
              
              {/* Checkmark overlay for earned special stamps */}
              {isEarned && (isDiscount || isFreeCut) && (
                <div className="absolute inset-0 bg-white/95 rounded-full flex items-center justify-center z-20">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 pt-4 border-t border-white/5 text-center">
        <p className="text-sm font-medium text-gray-400">
          {stampsEarned >= 10 
            ? <span className="text-white font-bold tracking-wide">¡Felicidades! Tienes un corte gratis.</span>
            : <>Te faltan <span className="text-white font-bold">{10 - stampsEarned}</span> sellos para tu corte gratis.</>}
        </p>
      </div>
    </div>
  );
}
