import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function buildEnvError() {
  const missing = []

  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  if (missing.length === 0) return ''

  return `Configuración incompleta de Supabase. Faltan: ${missing.join(', ')}. Definilas en .env.local (local) y en Vercel (Production/Preview).`
}

export const supabaseConfigError = buildEnvError()

export const supabase = supabaseConfigError
  ? null
  : createClient(supabaseUrl, supabaseAnonKey)

export function assertSupabaseEnv() {
  if (supabaseConfigError) {
    throw new Error(supabaseConfigError)
  }
}

export { supabaseUrl, supabaseAnonKey }
