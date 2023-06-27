/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { AppProvider } from '@shopify/discount-app-components'
import '@shopify/discount-app-components/build/esm/styles.css'
import React from 'react'

export function DiscountProvider(props: {children: React.ReactNode}) {
  return <AppProvider locale="en-US" ianaTimezone="America/Toronto">{props.children}</AppProvider>
}