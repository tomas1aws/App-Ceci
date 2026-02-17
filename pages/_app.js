import Head from 'next/head'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f97316" />
        <meta name="description" content="Biblioteca de alfajores App-Ceci" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
