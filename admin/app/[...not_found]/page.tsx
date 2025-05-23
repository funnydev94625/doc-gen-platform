"use client"

import { notFound } from 'next/navigation'

export default function CatchAllNotFound() {
  // This will trigger the not-found.tsx file
  notFound()
}
