import { BookingForm } from '@/components/booking-form'
import { getMessages } from 'next-intl/server'

export default async function BookPage(props: any) {
  const { params } = await props
  const locale = params?.locale ?? 'en'
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