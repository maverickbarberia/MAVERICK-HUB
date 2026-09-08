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

  const { data: newClient, error } = await supabase
    .from('clients')
    .insert([
      { document_number: documentNumber, full_name: fullName }
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
      { document_number: documentNumber, full_name: fullName }
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
