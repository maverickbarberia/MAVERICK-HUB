'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

// ADMIN ACTIONS (Email/Password via Supabase Auth)
export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login/admin?message=Credenciales incorrectas.')
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}

// CLIENT ACTIONS (Document Number)
export async function loginClientAction(formData: FormData) {
  const supabase = await createClient()
  const documentNumber = formData.get('document_number') as string

  const { data: client, error } = await supabase
    .from('clients')
    .select('id')
    .eq('document_number', documentNumber)
    .single()

  if (error || !client) {
    redirect('/login/client?message=No se encontró un cliente con ese documento.')
  }

  const cookieStore = await cookies()
  cookieStore.set('client_session', client.id, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  })

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function registerClientAction(formData: FormData) {
  const supabase = await createClient()
  const documentNumber = formData.get('document_number') as string
  const fullName = formData.get('full_name') as string
  const phoneNumber = formData.get('phone_number') as string

  const { data: newClient, error } = await supabase
    .from('clients')
    .insert([
      { document_number: documentNumber, full_name: fullName, phone_number: phoneNumber }
    ])
    .select('id')
    .single()

  if (error) {
    redirect('/register/client?message=El documento ya está registrado o hubo un error.')
  }

  const cookieStore = await cookies()
  cookieStore.set('client_session', newClient.id, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  })

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signout() {
  const cookieStore = await cookies()
  const supabase = await createClient()
  
  // Sign out from Supabase Auth (for Admins)
  await supabase.auth.signOut()
  
  // Delete client session cookie (for Clients)
  cookieStore.delete('client_session')
  
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function createClientFromAdmin(formData: FormData) {
  const supabase = await createClient()
  const documentNumber = formData.get('document_number') as string
  const fullName = formData.get('full_name') as string
  const phoneNumber = formData.get('phone_number') as string

  // Verificar que el admin esté logueado (protección extra)
  const cookieStore = await cookies()
  const adminId = cookieStore.get('admin_session')?.value
  // Fallback a supabase auth si el admin sesión falla
  const { data: { user } } = await supabase.auth.getUser()

  if (!adminId && !user) {
    return { error: 'No autorizado' }
  }

  const { error } = await supabase
    .from('clients')
    .insert([
      { document_number: documentNumber, full_name: fullName, phone_number: phoneNumber }
    ])

  if (error) {
    if (error.code === '23505') {
      return { error: 'Este documento ya está registrado.' }
    }
    return { error: `Error de BD: ${error.message}` }
  }

  revalidatePath('/admin/clients')
  return { success: true }
}

export async function editClient(formData: FormData) {
  const supabase = await createClient()
  const clientId = formData.get('id') as string
  const documentNumber = formData.get('document_number') as string
  const fullName = formData.get('full_name') as string
  const phoneNumber = formData.get('phone_number') as string

  // Verificar que el admin esté logueado (protección extra)
  const cookieStore = await cookies()
  const adminId = cookieStore.get('admin_session')?.value
  // Fallback a supabase auth si el admin sesión falla
  const { data: { user } } = await supabase.auth.getUser()

  if (!adminId && !user) {
    return { error: 'No autorizado' }
  }

  const { error } = await supabase
    .from('clients')
    .update({ document_number: documentNumber, full_name: fullName, phone_number: phoneNumber })
    .eq('id', clientId)

  if (error) {
    if (error.code === '23505') {
      return { error: 'Este documento ya está registrado por otro cliente.' }
    }
    return { error: `Error de BD: ${error.message}` }
  }

  revalidatePath('/admin/clients')
  revalidatePath(`/admin/clients/${clientId}`)
  return { success: true }
}

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function addStampWithFormData(formData: FormData) {
  const supabase = await createClient() // Para autenticación normal (admin)
  const clientId = formData.get('clientId') as string
  const barberName = formData.get('barberName') as string
  const file = formData.get('proofImage') as File

  if (!clientId || !barberName || !file || file.size === 0) {
    return { error: 'Faltan datos requeridos (Cliente, Barbero o Foto).' }
  }

  // Capa 1: Verificar límite diario (Máximo 2 sellos por día)
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { data: todayStamps } = await supabase
    .from('stamp_transactions')
    .select('id')
    .eq('client_id', clientId)
    .eq('action_type', 'ADD')
    .gte('created_at', startOfDay.toISOString());

  if (todayStamps && todayStamps.length >= 2) {
    return { error: 'Límite diario alcanzado: Este cliente ya recibió 2 sellos hoy.' };
  }

  // Get current stamps
  const { data: client } = await supabase
    .from('clients')
    .select('stamps_earned')
    .eq('id', clientId)
    .single()
    
  if (!client || client.stamps_earned >= 12) {
    return { error: 'El cliente ya tiene el máximo de sellos.' }
  }

  // Crear cliente Admin para bypass RLS de Storage
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const fileExt = file.name.split('.').pop() || 'jpg'
  const fileName = `${clientId}-${Date.now()}.${fileExt}`
  
  const { error: uploadError } = await supabaseAdmin.storage
    .from('payment_proofs')
    .upload(fileName, file, { contentType: file.type })

  if (uploadError) {
    return { error: `Error subiendo foto al servidor: ${uploadError.message}` }
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from('payment_proofs')
    .getPublicUrl(fileName)
    
  const proofImageUrl = publicUrlData.publicUrl

  // Actualizar sellos
  await supabase
    .from('clients')
    .update({ stamps_earned: client.stamps_earned + 1 })
    .eq('id', clientId)

  // Capa 2: Registrar auditoría con evidencia
  const { data: { user } } = await supabase.auth.getUser()
  await supabase.from('stamp_transactions').insert({
    client_id: clientId,
    admin_id: user?.id || null,
    action_type: 'ADD',
    barber_name: barberName,
    proof_image_url: proofImageUrl
  })
  
  revalidatePath('/admin/clients')
  revalidatePath(`/admin/clients/${clientId}`)
  revalidatePath('/admin')
  
  return { success: true }
}

export async function addStampToClient(clientId: string) {
  const supabase = await createClient()
  
  // Capa 1: Verificar límite diario (Máximo 2 sellos por día)
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { data: todayStamps } = await supabase
    .from('stamp_transactions')
    .select('id')
    .eq('client_id', clientId)
    .eq('action_type', 'ADD')
    .gte('created_at', startOfDay.toISOString());

  if (todayStamps && todayStamps.length >= 2) {
    console.error("Límite diario de sellos alcanzado para el cliente:", clientId);
    return;
  }

  // Get current stamps
  const { data: client } = await supabase
    .from('clients')
    .select('stamps_earned')
    .eq('id', clientId)
    .single()
    
  if (client) {
    if (client.stamps_earned >= 12) {
      // No permitir más de 12 sellos
      return
    }
    
    await supabase
      .from('clients')
      .update({ stamps_earned: client.stamps_earned + 1 })
      .eq('id', clientId)

    // Capa 2: Registrar auditoría
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('stamp_transactions').insert({
      client_id: clientId,
      admin_id: user?.id || null,
      action_type: 'ADD'
    })
  }
  
  revalidatePath('/admin/clients')
  revalidatePath(`/admin/clients/${clientId}`)
  revalidatePath('/admin')
}

export async function removeStampFromClient(clientId: string) {
  const supabase = await createClient()
  
  // Get current stamps
  const { data: client } = await supabase
    .from('clients')
    .select('stamps_earned')
    .eq('id', clientId)
    .single()
    
  if (client && client.stamps_earned > 0) {
    await supabase
      .from('clients')
      .update({ stamps_earned: client.stamps_earned - 1 })
      .eq('id', clientId)

    // Registrar auditoría
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('stamp_transactions').insert({
      client_id: clientId,
      admin_id: user?.id || null,
      action_type: 'REMOVE'
    })
  }
  
  revalidatePath('/admin/clients')
  revalidatePath(`/admin/clients/${clientId}`)
  revalidatePath('/admin')
}

export async function redeemFreeCut(clientId: string) {
  const supabase = await createClient()
  
  // Get current stamps
  const { data: client } = await supabase
    .from('clients')
    .select('stamps_earned')
    .eq('id', clientId)
    .single()
    
  if (client && client.stamps_earned >= 12) {
    await supabase
      .from('clients')
      .update({ stamps_earned: client.stamps_earned - 12 })
      .eq('id', clientId)

    // Registrar auditoría
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('stamp_transactions').insert({
      client_id: clientId,
      admin_id: user?.id || null,
      action_type: 'REDEEM_FREE'
    })
  }
  
  revalidatePath('/admin/clients')
  revalidatePath(`/admin/clients/${clientId}`)
  revalidatePath('/admin')
}

// ==========================================
// PERSONAS (TEAM MEMBERS)
// ==========================================

export async function addTeamMember(formData: FormData) {
  const supabase = await createClient()
  const fullName = formData.get('fullName') as string
  const role = formData.get('role') as string

  if (!fullName || !role) {
    return { error: 'El nombre es obligatorio.' }
  }

  const { error } = await supabase
    .from('team_members')
    .insert({
      full_name: fullName,
      role: role,
      status: 'ACTIVE'
    })

  if (error) {
    return { error: `Error creando registro: ${error.message}` }
  }

  revalidatePath('/admin/barbers')
  revalidatePath('/admin/staff')
  return { success: true }
}

export async function toggleTeamMemberStatus(id: string, currentStatus: string) {
  const supabase = await createClient()
  
  const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  
  const { error } = await supabase
    .from('team_members')
    .update({ status: newStatus })
    .eq('id', id)
    
  if (error) {
    console.error("Error toggling status:", error.message)
    return;
  }

  revalidatePath('/admin/barbers')
  revalidatePath('/admin/staff')
}
