import { supabaseUrl, supabaseKey } from '../../lib/supabaseClient'

function formatBody(text) {
  if (!text) return '(sin body)'
  return text.slice(0, 500)
}

function toSerializableCause(cause) {
  if (!cause) return null

  if (cause instanceof Error) {
    return {
      name: cause.name,
      message: cause.message,
      code: cause.code ?? null,
      errno: cause.errno ?? null,
      syscall: cause.syscall ?? null,
      hostname: cause.hostname ?? null,
      stackSnippet: cause.stack ? cause.stack.split('\n').slice(0, 3).join('\n') : null
    }
  }

  if (typeof cause === 'object') {
    return cause
  }

  return { value: String(cause) }
}

export default async function handler(req, res) {
  const url = `${supabaseUrl}/rest/v1/alfajores?select=*&limit=1`
  console.log('[supabase-ping] final URL:', url)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`
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
      message: error?.message || 'Unknown error',
      name: error?.name || 'Error',
      cause: toSerializableCause(error?.cause ?? null),
      stackSnippet: error?.stack ? error.stack.split('\n').slice(0, 4).join('\n') : null
    })
  }
}
