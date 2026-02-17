import '../styles/globals.css'

export const metadata = {
  title: 'App-Ceci · Biblioteca de Alfajores',
  description: 'Biblioteca de alfajores App-Ceci',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

export const viewport = {
  themeColor: '#f97316',
}
