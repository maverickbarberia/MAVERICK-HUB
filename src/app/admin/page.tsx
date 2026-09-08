import { createClient } from '@/utils/supabase/server';
import { Users, ScanLine, Crown } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  // Fetch clients
  const { data: clients } = await supabase
    .from('clients')
    .select('stamps_earned');

  const totalClients = clients?.length || 0;
  const totalStamps = clients?.reduce((acc, client) => acc + (client.stamps_earned || 0), 0) || 0;
  const clientsWithRewards = clients?.filter(c => c.stamps_earned >= 10).length || 0;

  return (
    <div className="w-full space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Bienvenido al panel de control de MAVERICK HUB.
          </p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Clientes */}
        <div className="backdrop-blur-xl bg-white/3 border border-white/8 rounded-3xl p-6 shadow-lg relative overflow-hidden group hover:bg-white/5 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Users size={28} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Clientes</p>
              <p className="text-3xl font-bold text-white">{totalClients}</p>
            </div>
          </div>
        </div>

        {/* Sellos Entregados */}
        <div className="backdrop-blur-xl bg-white/3 border border-white/8 rounded-3xl p-6 shadow-lg relative overflow-hidden group hover:bg-white/5 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 text-white rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <ScanLine size={28} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Sellos Entregados</p>
              <p className="text-3xl font-bold text-white">{totalStamps}</p>
            </div>
          </div>
        </div>

        {/* Clientes con Premio */}
        <div className="backdrop-blur-xl bg-white/3 border border-white/8 rounded-3xl p-6 shadow-lg relative overflow-hidden group hover:bg-white/5 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 text-green-400 rounded-2xl border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              <Crown size={28} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Premios Pendientes</p>
              <p className="text-3xl font-bold text-white">{clientsWithRewards}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions / Accesos Rápidos */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/scanner" className="backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-6 shadow-lg transition-all flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white text-black rounded-2xl group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <ScanLine size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Escanear QR</h3>
                <p className="text-gray-400 text-sm">Suma sellos a tus clientes</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/clients" className="backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-6 shadow-lg transition-all flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/10 text-white rounded-2xl group-hover:scale-105 transition-transform border border-white/10">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Directorio</h3>
                <p className="text-gray-400 text-sm">Gestiona tus clientes</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
}
