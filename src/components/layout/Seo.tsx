import Head from 'next/head'
import { useRouter } from 'next/router'
import { company } from '@/lib/site'

export default function Seo({ title, description = company.description }: { title?: string; description?: string }) {
  const { asPath } = useRouter()
  const url = company.url + (asPath.split(/[?#]/)[0] || '/')
  const full = title ? `${title} | FACTRA` : `FACTRA 팩트라 — ${company.tagline}`
  return (
    <Head>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="FACTRA" />
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${company.url}/og.jpg`} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}
