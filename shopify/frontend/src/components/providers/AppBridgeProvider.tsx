/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import React, { useMemo, useState } from 'react'
import { To, useLocation, useNavigate } from 'react-router-dom'
import { Provider } from '@shopify/app-bridge-react'
import { Banner, Layout, Page } from '@shopify/polaris'
import { AppConfigV2 } from '@shopify/app-bridge'

// eslint-disable-next-line react/prop-types
export function AppBridgeProvider (props: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const history = useMemo(
    () => ({
      replace: (path: To) => {
        navigate(path, { replace: true })
      }
    }),
    [navigate]
  )

  const routerConfig = useMemo(
    () => ({ history, location }),
    [history, location]
  )

  const [appBridgeConfig] = useState(() => {
    const host = new URLSearchParams(location.search).get('host')
    const apiKey = process.env.SHOPIFY_API_KEY
    return {
      host,
      apiKey,
      forceRedirect: true
    } as AppConfigV2
  })

  if (!process.env.SHOPIFY_API_KEY || !appBridgeConfig.host) {
    const bannerProps = !process.env.SHOPIFY_API_KEY
      ? {
          title: 'Missing Shopify API Key',
          children: (
            <>
              Your app is running without the SHOPIFY_API_KEY environment
              variable. Please ensure that it is set when running or building
              your React app.
            </>
          )
        }
      : {
          title: 'Missing host query argument',
          children: (
            <>
              Your app can only load if the URL has a <b>host</b> argument.
              Please ensure that it is set, or access your app using the
              Partners Dashboard <b>Test your app</b> feature
            </>
          )
        }

    return (
      <Page narrowWidth>
        <Layout>
          <Layout.Section>
            <div style={{ marginTop: '100px' }}>
              <Banner {...bannerProps} status="critical" />
            </div>
          </Layout.Section>
        </Layout>
      </Page>
    )
  }

  return (
    <Provider config={appBridgeConfig} router={routerConfig}>
      {props.children}
    </Provider>
  )
}
