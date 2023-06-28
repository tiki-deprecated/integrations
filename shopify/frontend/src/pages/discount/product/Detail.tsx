/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { DiscountReq } from '../../../interface/discount-req'
import { useAppBridge } from '@shopify/app-bridge-react/useAppBridge'
import { Redirect } from '@shopify/app-bridge/actions'
import { useAuthenticatedFetch } from '../../../hooks/useAuthenticatedFetch'
import { Page, Layout, PageActions, Card } from '@shopify/polaris'

export function DiscountProductDetail() {

    const discount: DiscountReq = {
        "title": "Test Title",
        "startsAt": new Date("2023-06-20T10:54:12.959Z"),
        "endsAt": new Date("2024-06-20T10:54:12.959Z"),
        "metafields": {
            "type": "order",
            "description": "test description",
            "discountType": "amount",
            "discountValue": 10,
            "minValue": 100,
            "minQty": 0,
            "maxUse": 0,
            "onePerUser": true,
            "products": [],
            "collections": []
        },
        "combinesWith": {
            "orderDiscounts": false,
            "productDiscounts": false,
            "shippingDiscounts": false
        }
    }
    
    const app = useAppBridge();
    const redirect = Redirect.create(app);
    const authenticatedFetch = useAuthenticatedFetch(app);

    const duplicateDiscount = () => console.log(discount)

    return (
        <Page
        title="Product Discount"
        primaryAction={{
            content: 'Duplicate',
            onAction: duplicateDiscount,
        }}
    >
        <Layout>
            <Layout.Section>
                    <Card>
                        <Card.Section title="Title">
                            <p>Title: {discount.title}</p>
                            <p>Description: {discount.metafields.description}</p>
                        </Card.Section>
                        <Card.Section title="Value">
                            <p>Discount Type: {discount.metafields.discountType}</p>
                            <p>Discount Value: {discount.metafields.discountType === 'amount' ? '$':''} {discount.metafields.discountValue}{discount.metafields.discountType === 'percentage' ? '%':''}</p>
                        </Card.Section>
                        <Card.Section title="Minimum Requirements">
                            <p>{discount.metafields.minValue ? `Minimum value:${discount.metafields.minValue}` : ''}</p>
                            <p>{discount.metafields.minQty ? `Minimum quantity:${discount.metafields.minQty}` : ''}</p>
                        </Card.Section>
                        <Card.Section title="Max Usage">
                            <p>Once per customer? </p>
                            <p>{discount.metafields.onePerUser ? 'Yes': 'No'}</p>
                        </Card.Section>
                    </Card>
                    <Card>
                        <Card.Section title="Combines with">
                            <p>Order Discounts: {discount.combinesWith.orderDiscounts ? 'Yes': 'No'}</p>
                            <p>Product Discounts: {discount.combinesWith.productDiscounts ? 'Yes': 'No'}</p>
                            <p>Shipping Discounts: {discount.combinesWith.shippingDiscounts ? 'Yes': 'No'}</p>
                        </Card.Section>
                        <Card.Section title="Active dates">
                            <p>Starts at: {discount.startsAt.toLocaleTimeString()}</p>
                            <p>{discount.endsAt ? `Ends at: ${discount.endsAt.toLocaleDateString()}`: ''}</p>
                        </Card.Section>
                    </Card>
            </Layout.Section>
            <Layout.Section>
                <PageActions
                    primaryAction={{
                        content: 'Duplicate',
                        onAction: duplicateDiscount,
                    }}
                />
            </Layout.Section>
        </Layout>
    </Page>
    )
}
