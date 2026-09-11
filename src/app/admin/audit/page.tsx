import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AuditPage() {
  const supabase = await createClient()

  // Proteger ruta
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login/admin')
  }

  // Obtener historial cruzando con la tabla clients
  const { data: transactions, error } = await supabase
    .from('stamp_transactions')
    .select(`
      id,
      action_type,
      created_at,
      admin_id,
      barber_name,
      proof_image_url,
      clients (
        full_name,
        document_number
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  const actionLabels: Record<string, string> = {
    'ADD': 'Agregó Sello (+1)',
    'REMOVE': 'Quitó Sello (-1)',
    'REDEEM_50': 'Canjeó 50% Dcto.',
    'REDEEM_FREE': 'Canjeó Corte Gratis (-12)',
  }

  const actionColors: Record<string, string> = {
    'ADD': 'text-green-400 bg-green-400/10 border-green-400/20',
    'REMOVE': 'text-red-400 bg-red-400/10 border-red-400/20',
    'REDEEM_50': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    'REDEEM_FREE': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Auditoría de Sellos</h1>
        <p className="text-sm text-gray-400">Últimos 100 movimientos</p>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-white/5 text-gray-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Fecha y Hora</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Barbero</th>
                <th className="px-6 py-4 font-medium">Acción</th>
                <th className="px-6 py-4 font-medium">Evidencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {!transactions || transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No hay transacciones registradas aún. Asegúrate de haber creado la tabla en Supabase.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  // Tipado seguro para la relación
                  const client = Array.isArray(tx.clients) ? tx.clients[0] : tx.clients;
                  
                  return (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Intl.DateTimeFormat('es-CO', { 
                          dateStyle: 'medium', 
                          timeStyle: 'short' 
                        }).format(new Date(tx.created_at))}
                      </td>
                      <td className="px-6 py-4">
                        {client ? (
                          <div>
                            <p className="font-medium text-white">{client.full_name}</p>
                            <p className="text-xs text-gray-500">C.C. {client.document_number}</p>
                          </div>
                        ) : (
                          <span className="text-gray-500">Cliente eliminado</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300 font-medium">
                          {tx.barber_name || <span className="text-gray-600 italic">N/A</span>}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${actionColors[tx.action_type] || 'text-gray-400 bg-gray-400/10 border-gray-400/20'}`}>
                          {actionLabels[tx.action_type] || tx.action_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {tx.proof_image_url ? (
                          <a 
                            href={tx.proof_image_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 text-sm"
                          >
                            Ver Foto
                          </a>
                        ) : (
                          <span className="text-gray-600 text-sm italic">Sin soporte</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
