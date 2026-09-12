'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Trash2, Calendar, User, Image as ImageIcon } from 'lucide-react';

interface StampTransaction {
  id: string;
  created_at: string;
  barber_name: string | null;
  proof_image_url: string | null;
}

interface StampCardProps {
  stampsEarned: number;
  clientId?: string;
  transactions?: StampTransaction[];
  isAdmin?: boolean;
}

export function StampCard({ stampsEarned, clientId, transactions = [], isAdmin = false }: StampCardProps) {
  const totalStamps = 12;
  const stamps = Array.from({ length: totalStamps }, (_, i) => i + 1);

  const [selectedTx, setSelectedTx] = useState<StampTransaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStampClick = (index: number, isEarned: boolean) => {
    if (!isAdmin || !isEarned) return;
    if (!transactions[index]) {
      setSelectedTx({
        id: 'legacy',
        created_at: new Date().toISOString(),
        barber_name: 'Desconocido (Sello Antiguo/Manual)',
        proof_image_url: null,
      });
      return;
    }
    setSelectedTx(transactions[index]);
  };

  const handleDelete = async () => {
    if (!selectedTx || !clientId) return;
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este sello? Esta acción no se puede deshacer y borrará la evidencia.");
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      if (selectedTx.id === 'legacy') {
        const { decrementLegacyStamp } = await import('@/app/actions');
        const res = await decrementLegacyStamp(clientId);
        if (res?.error) {
          alert(res.error);
        } else {
          setSelectedTx(null);
        }
      } else {
        const { deleteStampTransaction } = await import('@/app/actions');
        const res = await deleteStampTransaction(selectedTx.id, clientId);
        if (res?.error) {
          alert(res.error);
        } else {
          setSelectedTx(null);
        }
      }
    } catch (e) {
      console.error(e);
      alert('Error borrando el sello');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md mx-auto relative group"
      >
        <div className="absolute -inset-0.5 bg-linear-to-r from-white/10 via-white/5 to-white/10 rounded-[2.5rem] blur-md opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-300" />
        
        <div className="relative backdrop-blur-3xl bg-[#0a0a0a]/90 p-6 sm:p-8 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
          
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
              
              const isClickable = isAdmin && isEarned;

              return (
                <motion.button
                  key={stampNumber}
                  type="button"
                  onClick={() => handleStampClick(index, isEarned)}
                  disabled={!isClickable}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={clsx(
                    "relative flex items-center justify-center aspect-square rounded-2xl border transition-all duration-500 overflow-hidden outline-none",
                    isClickable && "cursor-pointer hover:ring-2 hover:ring-[#C5D8AD] hover:scale-110 active:scale-95",
                    !isClickable && "cursor-default",
                    isEarned
                      ? isSpecial 
                        ? "border-[#C5D8AD]/60 bg-linear-to-br from-[#C5D8AD] via-[#8B9A7B] to-[#46533D] text-white shadow-[0_0_20px_rgba(139,154,123,0.4)] scale-105 z-10"
                        : "border-white/60 bg-linear-to-br from-gray-100 to-gray-300 text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                      : isSpecial
                        ? "border-[#8B9A7B]/30 bg-[#46533D]/20 text-[#8B9A7B]/80 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                        : "border-white/5 bg-black/40 text-gray-600 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                  )}
                >
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
                </motion.button>
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

      {/* Modal Detalles del Sello */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-[9999] bg-[#0a0a0a] overflow-y-auto overflow-x-hidden">
            <motion.div 
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="min-h-full w-full max-w-md mx-auto bg-[#0a0a0a] flex flex-col"
            >
              <div className="flex justify-between items-center p-4 sm:p-5 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Detalles del Sello
                </h3>
                <button 
                  onClick={() => setSelectedTx(null)}
                  className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 w-full pb-[calc(120px+env(safe-area-inset-bottom,0px))] p-4 sm:p-6 space-y-6">
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Calendar size={16} className="text-white/50" />
                  {new Intl.DateTimeFormat('es-CO', { 
                    dateStyle: 'long', 
                    timeStyle: 'short' 
                  }).format(new Date(selectedTx.created_at))}
                </p>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-full text-white">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Barbero que atendió</p>
                    <p className="text-white font-medium text-lg">{selectedTx.barber_name || 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon size={16} className="text-gray-400" />
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Evidencia Fotográfica</p>
                  </div>
                  {selectedTx.proof_image_url ? (
                    <a href={selectedTx.proof_image_url} target="_blank" rel="noopener noreferrer" className="block relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/10 group cursor-pointer bg-black/40 shadow-inner">
                      <img 
                        src={selectedTx.proof_image_url} 
                        alt="Evidencia" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                          const text = document.createElement('span');
                          text.className = 'text-gray-500 text-sm absolute z-0';
                          text.innerText = 'Imagen no disponible';
                          e.currentTarget.parentElement?.appendChild(text);
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-medium bg-black/60 px-4 py-2 rounded-full backdrop-blur-md">Ampliar Foto</span>
                      </div>
                    </a>
                  ) : (
                    <div className="aspect-video bg-black/30 rounded-xl flex items-center justify-center border border-dashed border-white/20">
                      <p className="text-gray-500 text-sm">Sin comprobante</p>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? 'Borrando...' : (
                      <>
                        <Trash2 size={20} />
                        <span>Eliminar este sello</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
