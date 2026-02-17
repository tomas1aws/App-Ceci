'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import StarRating from '../../../components/StarRating'
import { deleteAlfajor, fetchAlfajorById } from '../../../lib/alfajoresApi'

function formatDegustadoEn(degustadoEn) {
  if (!degustadoEn) return '—'
  const formatted = new Date(`${degustadoEn}T00:00:00`).toLocaleDateString('es-AR')
  return formatted === 'Invalid Date' ? '—' : formatted
}

export default function AlfajorDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const [alfajor, setAlfajor] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const missingId = useMemo(() => !id || typeof id !== 'string', [id])

  useEffect(() => {
    if (missingId) {
      setError('ID faltante')
      setLoading(false)
      return
    }

    async function load() {
      setLoading(true)
      setError('')

      try {
        const data = await fetchAlfajorById(id)
        if (!data) {
          setError('No encontrado')
          return
        }
        setAlfajor(data)
      } catch (err) {
        setError(err.message || 'No encontrado')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, missingId])

  async function handleDelete() {
    if (missingId) {
      setError('ID faltante')
      return
    }

    if (!window.confirm('¿Eliminar este alfajor?')) return

    setError('')
    if (process.env.NODE_ENV !== 'production') {
      console.log('EDIT/DELETE id:', id)
    }

    try {
      await deleteAlfajor(id, alfajor?.image_path)
      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <main className="p-4">Cargando...</main>
  if (error === 'No encontrado') return <main className="p-4">No encontrado</main>

  return (
    <main className="mx-auto min-h-screen max-w-2xl space-y-4 p-4">
      {error && <p className="text-red-600">{error}</p>}

      {alfajor ? (
        <>
          <img
            src={alfajor.image_path || 'https://placehold.co/600x400?text=Sin+Foto'}
            alt={alfajor.name}
            className="h-72 w-full rounded-xl object-cover"
          />
          <h1 className="text-3xl font-bold">{alfajor.name}</h1>
          <p className="text-lg text-slate-700">Marca: {alfajor.brand || 'Sin marca'}</p>
          <StarRating rating={alfajor.rating || 0} />
          <p className="whitespace-pre-line rounded bg-white p-3 shadow">{alfajor.review || 'Sin reseña'}</p>
          <p className="text-sm text-slate-500">Degustado: {formatDegustadoEn(alfajor.degustado_en)}</p>
        </>
      ) : (
        <p>No encontrado</p>
      )}

      <div className="flex gap-3">
        <Link
          href={missingId ? '#' : `/alfajor/${id}/editar`}
          aria-disabled={missingId}
          className="rounded bg-blue-600 px-4 py-2 text-white aria-disabled:pointer-events-none aria-disabled:opacity-50"
        >
          Editar
        </Link>
        <button
          onClick={handleDelete}
          disabled={missingId || !alfajor}
          className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Eliminar
        </button>
        <Link href="/" className="rounded border px-4 py-2">
          Inicio
        </Link>
      </div>
    </main>
  )
}
