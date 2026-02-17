import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AlfajorForm from '../../components/AlfajorForm'
import { fetchAlfajorById, updateAlfajor } from '../../lib/alfajoresApi'

export default function EditAlfajorPage() {
  const router = useRouter()
  const { id } = router.query
  const [alfajor, setAlfajor] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    async function load() {
      try {
        const data = await fetchAlfajorById(id)
        setAlfajor(data)
      } catch (err) {
        setError(err.message)
      }
    }

    load()
  }, [id])

  async function handleUpdate(payload) {
    await updateAlfajor(id, payload)
    router.push(`/alfajores/${id}`)
  }

  if (error) return <main className="p-4 text-red-600">{error}</main>
  if (!alfajor) return <main className="p-4">Cargando...</main>

  return (
    <main className="mx-auto min-h-screen max-w-xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Editar Alfajor</h1>
        <Link href={`/alfajores/${id}`} className="text-orange-600">
          Volver
        </Link>
      </div>
      <AlfajorForm initialValues={alfajor} onSubmit={handleUpdate} submitText="Guardar cambios" />
    </main>
  )
}
