// Provider for manual testing the UI, without app bridge connection
import { AppProvider } from "@shopify/polaris"

export function PureTestProvider({ children }) {
    return <AppProvider locale="en-US" ianaTimezone="America/Los_Angeles">{children}</AppProvider>
}