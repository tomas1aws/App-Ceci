function formatBody(text) {
  if (!text) return '(sin body)'
  return text.slice(0, 500)
}

export default async function handler(req, res) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({
      ok: false,
      status: null,
      bodySnippet: null,
      error: 'Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en el entorno del servidor.'
    })
  }

  const url = `${supabaseUrl}/rest/v1/alfajores?select=*&limit=1`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`
      }
    })

    const bodyText = await response.text()

    return res.status(200).json({
      ok: response.ok,
      status: response.status,
      bodySnippet: formatBody(bodyText),
      error: null
    })
  } catch (error) {
    return res.status(200).json({
      ok: false,
      status: null,
      bodySnippet: null,
      error: `${error?.name || 'Error'}: ${error?.message || 'Unknown error'}`
    })
  }
}
