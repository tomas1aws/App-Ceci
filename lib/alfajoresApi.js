import { supabase, assertSupabaseEnv } from './supabaseClient'

function getSupabaseClient() {
  assertSupabaseEnv()

  if (!supabase) {
    throw new Error('No se pudo inicializar el cliente de Supabase.')
  }

  return supabase
}

export async function fetchAlfajores() {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from('alfajores')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function fetchAlfajorById(id) {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from('alfajores')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createAlfajor(payload) {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from('alfajores')
    .insert(payload)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateAlfajor(id, payload) {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from('alfajores')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function deleteAlfajor(id) {
  const client = getSupabaseClient()
  const { error } = await client.from('alfajores').delete().eq('id', id)
  if (error) throw error
}

export async function uploadImage(file) {
  const client = getSupabaseClient()
  const fileName = `${Date.now()}-${file.name}`
  const { error } = await client.storage.from('alfajores').upload(fileName, file)

  if (error) throw error

  const { data } = client.storage.from('alfajores').getPublicUrl(fileName)
  return data.publicUrl
}
