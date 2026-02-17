import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function LegacyAlfajorDetailRedirect() {
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (!id) return
    router.replace(`/alfajor/${id}`)
  }, [id, router])

  return <main className="p-4">Redirigiendo...</main>
}
