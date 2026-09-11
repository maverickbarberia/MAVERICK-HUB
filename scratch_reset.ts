import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function resetClient() {
  console.log('Buscando cliente 12345678...');
  const { data: client, error: searchError } = await supabase
    .from('clients')
    .select('id')
    .eq('document_number', '12345678')
    .single();
    
  if (searchError || !client) {
    console.error('Error buscando cliente:', searchError);
    return;
  }
  
  const clientId = client.id;
  console.log('Cliente encontrado:', clientId);
  
  console.log('Reseteando sellos a 0...');
  await supabase.from('clients').update({ stamps_earned: 0 }).eq('id', clientId);
  
  console.log('Borrando transacciones y fotos...');
  const { data: txs } = await supabase.from('stamp_transactions').select('proof_image_url').eq('client_id', clientId);
  
  if (txs && txs.length > 0) {
    for (const tx of txs) {
      if (tx.proof_image_url) {
        try {
          const url = new URL(tx.proof_image_url);
          const parts = url.pathname.split('/payment_proofs/');
          if (parts.length > 1) {
            await supabase.storage.from('payment_proofs').remove([parts[1]]);
          }
        } catch (e) {}
      }
    }
  }
  
  await supabase.from('stamp_transactions').delete().eq('client_id', clientId);
  
  console.log('¡Cliente reseteado con éxito!');
}

resetClient();
