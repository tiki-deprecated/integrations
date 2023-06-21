import React from 'react'
import { useAppBridge } from '@shopify/app-bridge-react/useAppBridge'
import { Redirect } from '@shopify/app-bridge/actions'

import { useForm, useField, SubmitResult } from '@shopify/react-form'
import { AppliesTo, RequirementType, SummaryCard } from '@shopify/discount-app-components'
import { LegacyCard, Layout, Page, PageActions, TextField } from '@shopify/polaris'

import { DiscountReq } from '../../../interface/discount-req'
import {
    MinReqsCard,
    ActiveDatesCard,
    DiscountAmount,
    MaxUsageCard,
    CombinationsCard,
    ErrorBanner,
    AppliesToChoices,
    TitleAndDescription,
    SummarySection
} from '../../../components'
import { useAuthenticatedFetch } from '../../../hooks/useAuthenticatedFetch'

export function DiscountOrderCreate() {

    const app = useAppBridge();
    const redirect = Redirect.create(app);
    const authenticatedFetch = useAuthenticatedFetch(app);

    const {
        fields: {
            title,
            startsAt,
            endsAt,
            description,
            discountType,
            discountValue,
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
            endsAt: useField<Date | null>(null),
            description: useField(''),
            discountType: useField<'percentage' | 'amount'>('amount'),
            discountValue: useField(0.00),
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
            const response = await authenticatedFetch("/api/discount", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    discount
                }),
            });
            const data = (await response.text());
            debugger
            redirect.dispatch(Redirect.Action.ADMIN_SECTION, {
                name: Redirect.ResourceType.Discount,
            });
            return { status: "success" }
        },
    })

    return (
        <Page
            title="Create an Order Discount"
            primaryAction={{
                content: 'Save',
                onAction: submit,
            }}
        >
            <Layout>
                <ErrorBanner submitErrors={submitErrors} />
                <Layout.Section>
                    <form onSubmit={submit}>
                        <LegacyCard>
                            <LegacyCard.Section title="Title">
                                <TitleAndDescription onChange={(values) => {
                                    title.value = values.title
                                    description.value = values.description
                                }} />
                            </LegacyCard.Section>
                            <LegacyCard.Section title="Value">
                                <DiscountAmount
                                    onChange={({ type, value }) => {
                                        if (type !== undefined) {
                                            discountType.value = type
                                        }
                                        if (value !== undefined) {
                                            discountValue.value = value
                                        }
                                    }}
                                />
                            </LegacyCard.Section>
                        </LegacyCard>
                        <MinReqsCard
                            appliesTo={AppliesTo.Order}
                            type={RequirementType.None}
                            subTotal={minValue.value}
                            qty={minQty.value}
                            onChange={({ type, value, qty }) => {
                                switch (type) {
                                    case RequirementType.Quantity:
                                        minQty.value = qty
                                        minValue.value = 0
                                        break;
                                    case RequirementType.Subtotal:
                                        minValue.value = value
                                        minQty.value = 0
                                        break;
                                    case RequirementType.None:
                                        minValue.value = 0
                                        minQty.value = 0
                                        break;
                                }
                            }}
                        />
                        <MaxUsageCard onChange={({ total, once }) => {
                            maxUse.value = total ? total : 0
                            onePerUser.value = once === true
                        }} />
                        <CombinationsCard onChange={(combinations) => {
                            orderDiscounts.value = combinations.orderDiscounts
                            productDiscounts.value = combinations.productDiscounts
                            shippingDiscounts.value = combinations.shippingDiscounts
                        }} />
                        <ActiveDatesCard
                            onChange={(s: string, e: string) => {
                                startsAt.value = new Date(s)
                                endsAt.value = e ? new Date(e) : null
                            }}
                            startsAt={startsAt.value.toUTCString()}
                            endsAt={endsAt.value ? endsAt.value.toUTCString : ''} />
                    </form>
                </Layout.Section>
                <Layout.Section secondary>
                        <LegacyCard>
                            <LegacyCard.Section title="Title">
                                <p>Title: {title.value}</p>
                                <p>Description: {description.value}</p>
                            </LegacyCard.Section>
                            <LegacyCard.Section title="Value">
                                <p>Discount Type: {discountType.value}</p>
                                <p>Discount Value: {discountType.value === 'amount' ? '$':''} {discountValue.value}{discountType.value === 'percentage' ? '%':''}</p>
                            </LegacyCard.Section>
                            <LegacyCard.Section title="Minimum Requirements">
                                <p>{minValue ? `Minimum value:${minValue}` : ''}</p>
                                <p>{minQty ? `Minimum quantity:${minQty}` : ''}</p>
                            </LegacyCard.Section>
                            <LegacyCard.Section title="Max Usage">
                                <p>Once per customer? </p>
                                <p>{onePerUser ? 'Yes': 'No'}</p>
                            </LegacyCard.Section>
                        </LegacyCard>
                        <LegacyCard>
                            <LegacyCard.Section title="Combines with">
                                <p>Order Discounts: {orderDiscounts.value ? 'Yes': 'No'}</p>
                                <p>Product Discounts: {productDiscounts.value ? 'Yes': 'No'}</p>
                                <p>Shipping Discounts: {shippingDiscounts.value ? 'Yes': 'No'}</p>
                            </LegacyCard.Section>
                            <LegacyCard.Section title="Active dates">
                                <p>Starts at: {startsAt.value.toLocaleTimeString()}</p>
                                <p>{endsAt.value ? `Ends at: ${endsAt.value!.toLocaleDateString()}`: ''}</p>
                            </LegacyCard.Section>
                        </LegacyCard>
                </Layout.Section>
                <Layout.Section>
                    <PageActions
                        primaryAction={{
                            content: 'Save discount',
                            onAction: submit,
                        }}
                    />
                </Layout.Section>
            </Layout>
        </Page>
    )
}
