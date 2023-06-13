import { AppBridgeProvider } from '@shopify/app-bridge-react'
import { AppProvider  } from '@shopify/polaris'

const config = {
    apiKey: '33d82ccecd1a316a4cbdb7d090735fa8',
    host: new URLSearchParams(window.location.search).get("host"),
    forceRedirect: true
};

export function DiscountProvider({ children }) {
  return <AppBridgeProvider config={ config }>
              <AppProvider locale="en-US" ianaTimezone="America/Los_Angeles">
                { children }
              </AppProvider>
         </AppBridgeProvider>
}
