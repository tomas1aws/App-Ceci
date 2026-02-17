import { supabase } from './supabaseClient'

export async function fetchAlfajores() {
  const { data, error } = await supabase
    .from('alfajores')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function fetchAlfajorById(id) {
  const { data, error } = await supabase
    .from('alfajores')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createAlfajor(payload) {
  const { data, error } = await supabase
    .from('alfajores')
    .insert(payload)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateAlfajor(id, payload) {
  const { data, error } = await supabase
    .from('alfajores')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function deleteAlfajor(id) {
  const { error } = await supabase.from('alfajores').delete().eq('id', id)
  if (error) throw error
}

export async function uploadImage(file) {
  const fileName = `${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from('alfajores').upload(fileName, file)

  if (error) throw error

  const { data } = supabase.storage.from('alfajores').getPublicUrl(fileName)
  return data.publicUrl
}
