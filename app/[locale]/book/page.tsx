import { BookingForm } from '@/components/booking-form'
import { getMessages } from 'next-intl/server'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function BookPage(props: PageProps) {
  const params = await props.params
  const locale = params.locale
  const messages = await getMessages({ locale })

  let serviceRates = null
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`
    const url = new URL('/api/settings/services', base).toString()
    const res = await fetch(url, { cache: 'no-store' })
    if (res.ok) {
      const json = await res.json()
      if (json?.success) serviceRates = json.data
    }
  } catch (err) {
    console.error(messages?.['book.loadError'] ?? 'Failed to load service settings on server:', err)
  }

  return <BookingForm serviceRates={serviceRates} />
} 