import { Layout, Banner } from "@shopify/polaris"
import React from "react"

export function ErrorBanner({submitErrors}){
 return submitErrors.length > 0
  ? (
    <Layout.Section>
        <Banner status="critical">
            <p>There were some issues with your form submission:</p>
            <ul>
                {submitErrors.map(({ message, field }, index) => {
                  return (
                        <li key={`${message}${index}`}>
                            {field?.join('.') ?? ''} {message}
                        </li>
                  )
                })}
            </ul>
        </Banner>
    </Layout.Section>
    )
  : null
}