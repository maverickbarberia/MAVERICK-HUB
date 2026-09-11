import { createClient } from '@/utils/supabase/server';
import { Search, UserCircle, Crown, Users } from 'lucide-react';
import { AddClientModal } from '@/components/admin/AddClientModal';
import { AddStampModal } from '@/components/admin/AddStampModal';
import { PeopleTabs } from '@/components/admin/PeopleTabs';
import Link from 'next/link';

export default async function ClientsPage() {
  const supabase = await createClient();
  
  // Fetch clients sorted by recently created
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="w-full space-y-6">
      
      {/* Cabecera */}
      <PeopleTabs />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Directorio de Clientes</h1>
            <p className="text-gray-400 text-sm mt-1">
              Gestiona la fidelidad de tus clientes ({clients?.length || 0} registrados).
            </p>
          </div>
          <div className="md:hidden">
            <AddClientModal />
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Buscador */}
          <div className="relative max-w-sm w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-white/5 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all sm:text-sm"
              placeholder="Buscar por documento o nombre..."
            />
          </div>
          
          <div className="hidden md:block">
            <AddClientModal />
          </div>
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {clients?.map((client) => {
          const isFreeCut = client.stamps_earned >= 10;
          const isDiscount = client.stamps_earned >= 5 && client.stamps_earned < 10;
          
          return (
            <div 
              key={client.id} 
              className="backdrop-blur-xl bg-white/3 border border-white/8 rounded-3xl p-5 shadow-lg relative overflow-hidden group hover:bg-white/5 transition-all"
            >
              {/* Highlight if they have a reward pending */}
              {isFreeCut && (
                <div className="absolute top-0 right-0 bg-green-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10 flex items-center gap-1">
                  <Crown size={12} /> CORTE GRATIS
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <UserCircle className="w-8 h-8 text-gray-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link href={`/admin/clients/${client.id}`} className="block hover:opacity-80 transition-opacity">
                    <h3 className="text-lg font-bold text-white truncate">
                      {client.full_name}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">
                      Doc: {client.document_number}
                    </p>
                  </Link>
                  
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isFreeCut ? 'bg-green-500' : isDiscount ? 'bg-yellow-500' : 'bg-white'}`}
                        style={{ width: `${Math.min((client.stamps_earned / 10) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-400 w-10 text-right">
                      {client.stamps_earned}/10
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de acción rápida */}
              <div className="mt-5 pt-4 border-t border-white/5 flex gap-2">
                <Link 
                  href={`/admin/clients/${client.id}`}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2 rounded-xl transition-colors text-center inline-block leading-loose"
                >
                  Detalles
                </Link>
                {!isFreeCut && (
                  <div className="flex-[1.5]">
                    <AddStampModal clientId={client.id} />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {(!clients || clients.length === 0) && (
          <div className="col-span-full py-12 text-center backdrop-blur-xl bg-white/2 border border-white/5 rounded-3xl">
            <Users className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-white">No hay clientes</h3>
            <p className="text-gray-400 mt-1">Los clientes aparecerán aquí cuando se registren.</p>
          </div>
        )}
      </div>

    </div>
  );
}
