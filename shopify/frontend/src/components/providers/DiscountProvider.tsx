import { AppProvider } from '@shopify/discount-app-components'
import '@shopify/discount-app-components/build/esm/styles.css'
import React from 'react'

export function DiscountProvider({ children }) {
  return <AppProvider locale="en-US" ianaTimezone="America/Toronto">{children}</AppProvider>
}