import Link from 'next/link'
import { useMemo, useState } from 'react'
import { supabaseConfigError, supabaseUrl, supabaseAnonKey } from '../lib/supabaseClient'

function maskKey(value) {
  if (!value) return '(vacía)'
  return `${value.slice(0, 10)}***`
}

function formatBody(text) {
  if (!text) return '(sin body)'
  return text.slice(0, 500)
}

async function runFetch(url, headers) {
  try {
    const response = await fetch(url, { method: 'GET', headers })
    const bodyText = await response.text()

    return {
      ok: response.ok,
      status: response.status,
      error: null,
      bodySnippet: formatBody(bodyText)
    }
  } catch (error) {
    return {
      ok: false,
      status: null,
      error: `${error?.name || 'Error'}: ${error?.message || 'Unknown error'}`,
      bodySnippet: null
    }
  }
}

export default function DebugPage() {
  const [restResult, setRestResult] = useState(null)
  const [storageResult, setStorageResult] = useState(null)
  const [serverResult, setServerResult] = useState(null)
  const [running, setRunning] = useState(false)

  const headers = useMemo(() => {
    if (!supabaseAnonKey) return {}
    return {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`
    }
  }, [])

  const restUrl = supabaseUrl ? `${supabaseUrl}/rest/v1/alfajores?select=*` : ''
  const storageUrl = supabaseUrl ? `${supabaseUrl}/storage/v1/bucket/alfajores` : ''

  async function runDiagnostics() {
    setRunning(true)

    if (!supabaseUrl || !supabaseAnonKey) {
      const envError = supabaseConfigError || 'Faltan variables públicas de Supabase.'
      const envFailure = { ok: false, status: null, error: envError, bodySnippet: null }
      setRestResult(envFailure)
      setStorageResult(envFailure)
      setServerResult({ ok: false, status: null, error: envError, bodySnippet: null })
      setRunning(false)
      return
    }

    const [rest, storage, server] = await Promise.all([
      runFetch(restUrl, headers),
      runFetch(storageUrl, headers),
      fetch('/api/supabase-ping')
        .then(async (response) => ({ ...(await response.json()), httpStatus: response.status }))
        .catch((error) => ({ ok: false, status: null, error: `${error.name}: ${error.message}`, bodySnippet: null }))
    ])

    setRestResult(rest)
    setStorageResult(storage)
    setServerResult(server)
    setRunning(false)
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-6 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Debug Supabase</h1>
        <Link href="/" className="text-orange-600">
          Volver
        </Link>
      </header>

      <section className="rounded-xl bg-white p-4 shadow">
        <h2 className="mb-3 text-lg font-semibold">Variables runtime (frontend)</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {supabaseUrl || '(vacía)'}
          </li>
          <li>
            <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {maskKey(supabaseAnonKey)}
          </li>
        </ul>
        {supabaseConfigError && <p className="mt-3 text-sm text-red-600">{supabaseConfigError}</p>}
      </section>

      <button
        type="button"
        onClick={runDiagnostics}
        disabled={running}
        className="rounded bg-orange-500 px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {running ? 'Probando...' : 'Correr diagnóstico'}
      </button>

      <ResultCard title="Frontend REST /rest/v1/alfajores?select=*" result={restResult} />
      <ResultCard title="Frontend Storage /storage/v1/bucket/alfajores" result={storageResult} />
      <ResultCard title="Server /api/supabase-ping" result={serverResult} />
    </main>
  )
}

function ResultCard({ title, result }) {
  return (
    <section className="rounded-xl bg-white p-4 shadow">
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      {!result && <p className="text-sm text-slate-600">Sin ejecutar.</p>}
      {result && (
        <div className="space-y-2 text-sm">
          <p>
            <strong>ok:</strong> {String(result.ok)}
          </p>
          <p>
            <strong>status:</strong> {result.status ?? '(sin respuesta)'}
          </p>
          {result.httpStatus !== undefined && (
            <p>
              <strong>httpStatus endpoint:</strong> {result.httpStatus}
            </p>
          )}
          {result.error && (
            <p className="break-all text-red-600">
              <strong>error:</strong> {result.error}
            </p>
          )}
          {result.bodySnippet && (
            <pre className="overflow-auto rounded bg-slate-100 p-2 whitespace-pre-wrap">
              <strong>body:</strong> {result.bodySnippet}
            </pre>
          )}
        </div>
      )}
    </section>
  )
}
