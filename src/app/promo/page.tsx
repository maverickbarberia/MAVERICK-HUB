import { StampCard } from "@/components/ui/StampCard";

export default function PromoPage() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-4 bg-[#1a1a1a]">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">
            Maverick
            <span className="block text-xl font-medium text-gray-400 tracking-widest mt-1">Barbería</span>
          </h1>
          <p className="text-gray-400 mt-4">
            ¡Únete a nuestro club y obtén cortes gratis!
          </p>
        </div>

        {/* Demo view of the stamp card for the promo page */}
        <div className="opacity-80 pointer-events-none transform scale-95">
          <StampCard stampsEarned={3} />
        </div>

        <div className="pt-8 space-y-4">
          <button className="w-full bg-white text-[#1a1a1a] font-bold py-4 rounded-full text-lg shadow-lg hover:bg-gray-200 transition-colors">
            Reclamar mi primer sello
          </button>
          <p className="text-center text-xs text-gray-500">
            Al registrarte aceptas nuestros términos y condiciones.
          </p>
        </div>
      </div>
    </main>
  );
}
