'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import AlfajorForm from '../../../../components/AlfajorForm'
import { fetchAlfajorById, updateAlfajor } from '../../../../lib/alfajoresApi'

export default function EditAlfajorPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const [alfajor, setAlfajor] = useState(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
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

  async function handleUpdate(payload) {
    setError('')
    setSuccessMessage('')

    if (missingId) {
      setError('ID faltante')
      return
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('EDIT/DELETE id:', id)
    }

    try {
      const normalizedPayload = {
        name: payload.name,
        brand: payload.brand,
        rating: payload.rating,
        review: payload.review,
        degustado_en: payload.degustado_en || null,
      }

      if (payload.image_path && payload.image_path !== alfajor?.image_path) {
        normalizedPayload.image_path = payload.image_path
      }

      const updated = await updateAlfajor(id, normalizedPayload)
      setSuccessMessage('Alfajor actualizado correctamente')
      router.push(`/alfajor/${updated.id}`)
      router.refresh()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  if (loading) return <main className="p-4">Cargando...</main>
  if (error === 'No encontrado') return <main className="p-4">No encontrado</main>

  return (
    <main className="mx-auto min-h-screen max-w-xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Editar Alfajor</h1>
        <Link href={missingId ? '#' : `/alfajor/${id}`} className="text-orange-600">
          Volver
        </Link>
      </div>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      {missingId ? (
        <button
          type="button"
          disabled
          className="w-full rounded bg-orange-500 px-4 py-2 font-medium text-white opacity-50"
        >
          Guardar cambios
        </button>
      ) : (
        <>
          <AlfajorForm initialValues={alfajor || {}} onSubmit={handleUpdate} submitText="Guardar cambios" />
          {successMessage && <p className="mt-3 text-sm text-green-700">{successMessage}</p>}
        </>
      )}
    </main>
  )
}
