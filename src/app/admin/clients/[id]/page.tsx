import { createClient } from '@/utils/supabase/server';
import { StampCard } from '@/components/ui/StampCard';
import Link from 'next/link';
import { ArrowLeft, UserCircle, Crown } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function ClientDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!client) {
    notFound();
  }

  const isFreeCut = client.stamps_earned >= 10;

  return (
    <div className="w-full max-w-lg mx-auto space-y-6 pt-4">
      
      {/* Botón de regreso */}
      <Link 
        href="/admin/clients"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Volver a Clientes</span>
      </Link>

      {/* Tarjeta de Resumen del Cliente */}
      <div className="backdrop-blur-xl bg-white/3 border border-white/8 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
        {isFreeCut && (
          <div className="absolute top-0 right-0 bg-green-500 text-black text-xs font-bold px-4 py-1.5 rounded-bl-xl z-10 flex items-center gap-1 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <Crown size={14} /> CORTE GRATIS DISPONIBLE
          </div>
        )}
        
        <div className="p-4 bg-white/5 rounded-full border border-white/10 mb-4 shadow-inner">
          <UserCircle className="w-12 h-12 text-gray-300" />
        </div>
        
        <h1 className="text-2xl font-bold text-white tracking-tight">{client.full_name}</h1>
        <p className="text-gray-400 text-sm mt-1">Doc: {client.document_number}</p>
        <p className="text-gray-500 text-xs mt-4 uppercase tracking-widest">
          Registrado: {new Date(client.created_at).toLocaleDateString('es-ES')}
        </p>
      </div>

      {/* Tarjeta de Sellos (Reutilizada del Dashboard) */}
      <div className="py-4">
        <StampCard stampsEarned={client.stamps_earned} />
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-3 pt-2">
        <button className="flex-1 bg-white text-black hover:bg-gray-200 text-base font-bold py-3.5 rounded-2xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]">
          +1 Sello
        </button>
        {isFreeCut && (
          <button className="flex-1 bg-green-500 text-black hover:bg-green-400 text-base font-bold py-3.5 rounded-2xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] active:scale-[0.98]">
            Canjear Corte
          </button>
        )}
      </div>

    </div>
  );
}
