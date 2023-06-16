import React, { useCallback, useState } from "react";
import { AppliesTo } from "../groups/AppliesTo";
import { DiscountAmount } from "../groups/DiscountAmount";
import { MaxDiscountUse } from "../groups/MaxDiscountUse";
import { MinimumRequirements } from "../groups/MinimumRequirements";
import { PurchaseType } from "../groups/PurchaseType";
import { Page, VerticalStack, Divider } from '@shopify/polaris';
import { saveDiscount } from '../services/api;

import ShopifyDiscountMetafields from "../../../backend/src/shopify/interface/shopify-discount-metafields";

export default function DiscountPage({ smUp, options }) {
    let shop = 'tiki-dev-store.shopify.com'
    let metafields: ShopifyDiscountMetafields = options

    const updateDiscountAmount = ({type, value}) => {
        metafields.discountType = type
        metafields.discountValue = value
    };

    const updatePurchaseType = ({type}) => {
        metafields.purchaseType = type
    }

    const updateAppliesTo = (appliesTo: string[]) => {
        metafields.appliesTo = appliesTo
    }

    const updateMinimumRequirements = ({minQty, minAmount}) => {
        metafields.minQty = minQty
        metafields.minValue = minAmount
    }

    const updateMaxDiscountUse = ({numericLimit, choiceList}) => {
        metafields.maxUse = numericLimit
        metafields.onePerUser = choiceList.indexOf("one-per-user") !== -1 
    }

    const save = async (options: ShopifyDiscountMetafields) => {
        saveDiscount(options, '')
    }

    return (
    <Page
        divider
        title="Order Discount" 
        primaryAction={{ 
            content: "Save",
            onAction: () => saveDiscount(options, shop)
        }}
        >
        <VerticalStack gap={{ xs: "8", sm: "4" }}>
            < DiscountAmount onChange={ updateDiscountAmount } />
            {smUp ? <Divider /> : null}
            < PurchaseType onChange={ updatePurchaseType }/>
            {smUp ? <Divider /> : null}
            < AppliesTo onChange={ updateAppliesTo }/>
            {smUp ? <Divider /> : null}
            < MinimumRequirements onChange={ updateMinimumRequirements }/>
            {smUp ? <Divider /> : null}
            < MaxDiscountUse onChange={ updateMaxDiscountUse }/>
        </VerticalStack>
    </Page>
    )
}

// discountType product/order
// title 
// description 
// startsAt
// endsAt
// combinesWith
// id=[]
