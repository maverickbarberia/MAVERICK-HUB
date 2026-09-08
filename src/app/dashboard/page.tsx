import { StampCard } from "@/components/ui/StampCard";
import QRCode from "react-qr-code";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { signout } from "@/app/actions";
import { cookies } from "next/headers";
import { LogOut } from "lucide-react";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const clientId = cookieStore.get('client_session')?.value;

  if (!clientId) {
    redirect('/login/client');
  }

  const supabase = await createClient();

  // Obtener perfil del cliente
  const { data: profile } = await supabase
    .from('clients')
    .select('full_name, stamps_earned')
    .eq('id', clientId)
    .single();

  if (!profile) {
    // Si la cookie existe pero el cliente ya no, cerramos sesión
    redirect('/login/client');
  }

  const userName = profile.full_name || "Cliente";
  const stampsEarned = profile.stamps_earned || 0;

  return (
    <main className="min-h-screen p-4 flex flex-col items-center">
      <div className="w-full max-w-md pt-8 space-y-6">
        
        {/* Cabecera del Usuario con Glassmorphism */}
        <div className="backdrop-blur-xl bg-white/3 border border-white/8 rounded-3xl p-6 shadow-2xl relative flex flex-col items-center">
          <form action={signout} className="absolute right-4 top-4">
            <button 
              type="submit" 
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors border border-white/5"
              title="Cerrar Sesión"
            >
              <LogOut size={18} />
            </button>
          </form>
          
          <h1 className="text-3xl font-bold text-white tracking-tight mt-2 text-center">Hola, {userName}</h1>
          <p className="text-gray-400 text-sm mt-2 text-center max-w-62.5">
            Muestra este código a tu barbero para sumar un sello.
          </p>
        </div>

        {/* Código QR Premium */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.6)] mx-auto w-fit flex flex-col items-center justify-center">
          <div className="bg-white p-4 rounded-2xl shadow-inner border border-gray-200">
            <QRCode 
              value={clientId} 
              size={200}
              bgColor="#ffffff"
              fgColor="#0a0a0a"
              level="Q"
            />
          </div>
          <div className="mt-6 flex items-center gap-3 opacity-60 w-full justify-center">
            <div className="h-px w-12 bg-linear-to-r from-transparent to-white/50"></div>
            <span className="text-white text-[0.65rem] tracking-[0.4em] uppercase font-light whitespace-nowrap">
              Tu Pase MAVERICK
            </span>
            <div className="h-px w-12 bg-linear-to-l from-transparent to-white/50"></div>
          </div>
        </div>

        {/* Tarjeta de Sellos */}
        <div className="pt-2 pb-8">
          <StampCard stampsEarned={stampsEarned} />
        </div>

      </div>
    </main>
  );
}
