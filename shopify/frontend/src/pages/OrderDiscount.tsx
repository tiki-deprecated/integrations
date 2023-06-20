import React from 'react'
import { useParams } from 'react-router'

import { useForm, useField, SubmitResult } from '@shopify/react-form'
import { DiscountMethod, PurchaseType, SummaryCard, } from '@shopify/discount-app-components'
import { LegacyCard, Layout, Page, PageActions } from '@shopify/polaris'

import { DiscountReq } from '../interface/discount-req'
import { PurchaseTypeSection, 
    MinReqsCard, 
    ActiveDatesCard, 
    DiscountAmount, 
    MaxUsageCard, 
    CombinationsCard,
    ErrorBanner } from '../components'
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch'


export function OrderDiscount () {
  
  const { id } = useParams();
  const authenticatedFetch = useAuthenticatedFetch()

  const saveDiscount = async (discount: DiscountReq) : Promise<SubmitResult> => {
      
      console.log(discount)
      let response = authenticatedFetch('', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
          discount
          })
      })
  
      const data = response
  
      console.log(data)
      debugger
      //TODO HANDLE ERRORS
      return { status: 'success' }
  }

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
            type: 'order',
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
      return await saveDiscount(discount)
    }
  })

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
                            <ActiveDatesCard onChange={console.log} startsAt={startsAt} endsAt={endsAt}/>
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
