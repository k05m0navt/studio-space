import { BookingForm } from '@/components/booking-form'
import { getMessages } from 'next-intl/server'

export default async function BookPage({ params: { locale } }: { params: { locale: string } }) {
  const messages = await getMessages({ locale })
  let serviceRates = null;
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? `