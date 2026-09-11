import { createClient } from '@/utils/supabase/server';
import { Scissors, ShieldAlert } from 'lucide-react';
import { PeopleTabs } from '@/components/admin/PeopleTabs';
import { AddTeamMemberModal } from '@/components/admin/AddTeamMemberModal';
import { toggleTeamMemberStatus } from '@/app/actions';

export default async function BarbersPage() {
  const supabase = await createClient();
  
  const { data: barbers, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('role', 'BARBER')
    .order('created_at', { ascending: false });

  return (
    <div className="w-full space-y-6">
      
      <PeopleTabs />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Directorio de Barberos</h1>
          <p className="text-gray-400 text-sm mt-1">
            Gestiona el equipo de barberos y su disponibilidad ({barbers?.length || 0} registrados).
          </p>
        </div>
        <div className="w-full md:w-auto">
          <AddTeamMemberModal role="BARBER" />
        </div>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3">
          <ShieldAlert />
          <p>La tabla de barberos no existe aún. Por favor crea la tabla <code>team_members</code> en Supabase.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {barbers?.map((barber) => (
            <div 
              key={barber.id} 
              className="backdrop-blur-xl bg-white/3 border border-white/8 rounded-3xl p-5 shadow-lg relative overflow-hidden group hover:bg-white/5 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shrink-0">
                  <Scissors className="w-8 h-8 text-gray-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white truncate">
                    {barber.full_name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                      barber.status === 'ACTIVE' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {barber.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/5">
                <form action={toggleTeamMemberStatus.bind(null, barber.id, barber.status)}>
                  <button type="submit" className="w-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white text-sm font-medium py-2 rounded-xl transition-colors">
                    {barber.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
                  </button>
                </form>
              </div>
            </div>
          ))}

          {(!barbers || barbers.length === 0) && (
            <div className="col-span-full py-12 text-center backdrop-blur-xl bg-white/2 border border-white/5 rounded-3xl">
              <Scissors className="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-white">No hay barberos</h3>
              <p className="text-gray-400 mt-1">Registra a tu primer barbero para empezar.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
