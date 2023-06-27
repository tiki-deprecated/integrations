/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import {
  Card,
  Page,
  Layout,
  TextContainer,
  Stack,
  Link,
  Heading
} from '@shopify/polaris'
import { TitleBar } from '@shopify/app-bridge-react'

export function HomePage () {
  return (
    <Page narrowWidth>
      <TitleBar title="TIKI" />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Stack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="center"
            >
              <Stack.Item fill>
                <TextContainer spacing="loose">
                  <Heading>Welcome to the TIKI app 🎉</Heading>
                  <p>
                    Lorem ipsum dolor sit amet {' '}
                    <Link url="https://polaris.shopify.com/" external>
                      Polaris design system
                    </Link>
                    ,{' '}
                    <Link url="https://shopify.dev/api/admin-graphql" external>
                      Shopify Admin API
                    </Link>
                    , and{' '}
                    <Link
                      url="https://shopify.dev/apps/tools/app-bridge"
                      external
                    >
                      App Bridge
                    </Link>{' '}
                    UI library and components.
                  </p>
                  <p>
                    Ready to go? Start by configuring your app.{' '}
                  </p>
                  <p>
                    Learn more about building out with TIKI in{' '}
                    <Link
                      url="https://shopify.dev/apps/getting-started/add-functionality"
                      external
                    >
                      this Shopify tutorial
                    </Link>{' '}
                    📚{' '}
                  </p>
                </TextContainer>
              </Stack.Item>
            </Stack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
