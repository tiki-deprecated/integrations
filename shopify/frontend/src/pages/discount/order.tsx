import { useForm, useField } from '@shopify/react-form'
import { PurchaseTypeSection } from '../../components/PurchaseTypeSecion'
import { MinReqsCard } from '../../components/MinReqsCard'
import { ActiveDatesCard } from '../../components/ActiveDatesCard'
import {
  DiscountMethod,
  PurchaseType,
  SummaryCard,
} from '@shopify/discount-app-components'
import {
  Banner,
  LegacyCard,
  Layout,
  Page,
  PageActions
} from '@shopify/polaris'

import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'
import { DiscountAmount } from '../../components/DiscountAmount'
import { MaxUsageCard } from '../../components/MaxUsage'
import { CombinationsCard } from '../../components/Combinations'
import React from 'react'
import { DiscountReq } from '../../interface/discount-req'
import { ErrorBanner } from '../../components/ErrorBanner'

const saveDiscountUrl = ""

export default function OrderDiscount () {
  const authenticatedFetch = useAuthenticatedFetch()

  const {
    fields: {
        title,
        startsAt,
        endsAt,
        type,
        description,
        discountType,
        discountValue,
        purchaseType,
        appliesTo,
        minValue,
        minQty,
        maxUse,
        onePerUser,
        products,
        collections,
        orderDiscounts,
        productDiscounts,
        shippingDiscounts,
    },
    submit,
    submitting,
    dirty,
    submitErrors
  } = useForm({
    fields: {
        title: useField(''),
        startsAt: useField(new Date()),
        endsAt: useField(undefined),
        type: useField(''),
        description: useField(''),
        discountType: useField<'percentage' | 'amount'>('amount'),
        discountValue: useField(0.00),
        purchaseType: useField<"one-time" | "subscription" | "both">('both'),
        appliesTo: useField([]),
        minValue: useField(0.00),
        minQty: useField(0),
        maxUse: useField(0),
        onePerUser: useField(true),
        products: useField([]),
        collections: useField([]),
        orderDiscounts: useField(false),
        productDiscounts: useField(false),
        shippingDiscounts: useField(false),
    },
    onSubmit: async (form) => {
      const discount: DiscountReq = {
        title: form.title,
        startsAt: form.startsAt,
        endsAt: form.endsAt,
        metafields: {
            type: 'product',
            description: form.description,
            discountType: form.discountType,
            discountValue: form.discountValue,
            purchaseType: form.purchaseType,
            appliesTo: form.appliesTo,
            minValue: form.minValue,
            minQty: form.minQty,
            maxUse: form.maxUse,
            onePerUser: form.onePerUser,
            products: form.products,
            collections: form.collections,
        },   
        combinesWith: {
            orderDiscounts: form.orderDiscounts,
            productDiscounts: form.productDiscounts,
            shippingDiscounts: form.shippingDiscounts
        },
      }

      let response = await authenticatedFetch(saveDiscountUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            discount
          })
        })

      const data = (await response.json()).data

      console.log(data)
      //TODO HANDLE ERRORS
      return { status: 'success' }
    }
  })

  const errorBanner =
        submitErrors.length > 0
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

  return (
        <Page
            title="Create Order Discount"
            primaryAction={{
              content: 'Save',
              onAction: submit,
              disabled: !dirty,
              loading: submitting
            }}
        >
            <Layout>
                <ErrorBanner submitErrors={ submitErrors } />
                <Layout.Section>
                    <form onSubmit={submit}>
                            <LegacyCard>
                                <LegacyCard.Section title="Value">
                                    <DiscountAmount onChange={console.log}/>
                                </LegacyCard.Section>
                                <LegacyCard.Section title="Purchase Type">
                                    <PurchaseTypeSection purchaseType={{value: PurchaseType.Both, onChange: console.log}} />
                                </LegacyCard.Section>
                            </LegacyCard>
                            <MinReqsCard />
                            <MaxUsageCard />
                            <CombinationsCard />
                            <ActiveDatesCard />
                        </form>
                    </Layout.Section>
                <Layout.Section secondary>
                    { /* TODO dynamic fields */ }
                    <SummaryCard
                        header={{
                            discountMethod: DiscountMethod.Automatic,
                            discountDescriptor: title.value,
                            appDiscountType: 'TIKI',
                            isEditing: false 
                        }}
                        minimumRequirements={{
                            requirementType: '',
                            subtotal: 0,
                            quantity: 0,
                        }}
                        usageLimits={{
                            oncePerCustomer: true,
                            totalUsageLimit: 0
                        }}
                        activeDates={{
                            startDate: startsAt.value,
                            endDate: endsAt.value
                        }} 
                        performance={{
                        isEditing: false
                        }}                    />
                </Layout.Section>
                <Layout.Section>
                    <PageActions
                        primaryAction={{
                            content: 'Save discount',
                            onAction: submit,
                            disabled: !dirty,
                            loading: submitting
                        }}
                    />
                </Layout.Section>
            </Layout>
        </Page>
  )
}
