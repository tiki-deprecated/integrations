/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { RequirementType, MinimumRequirementsCard, AppliesTo, DiscountMethod } from "@shopify/discount-app-components";
import { CurrencyCode } from "@shopify/react-i18n";
import { useState } from "react";

export const MinReqsCard = ({appliesTo = AppliesTo.Products, type = RequirementType.None, subTotal = 0, qty = 0 , onChange = console.log}) => {
    const [requirementType, setRequirementType] = useState(type);
    const [subtotal, setSubtotal] = useState(subTotal);
    const [quantity, setQuantity] = useState(qty);
    return (
    <MinimumRequirementsCard
        appliesTo={appliesTo}
        currencyCode={CurrencyCode.Usd}
        requirementType={{
            value: requirementType,
            onChange: (type: RequirementType) => {
                setRequirementType(type)
                onChange({
                    type,
                    value: subtotal,
                    qty: quantity 
                })
            }
        }}
        subtotal={{
            value: subtotal,
            onChange: (value: number) => {
                setSubtotal(value)
                onChange({
                    type: requirementType,
                    value,
                    qty: quantity 
                })
            }
        }}
        quantity={{
            value: quantity,
            onChange: (qty: number) => {
                setQuantity(qty)
                onChange({
                    value: subtotal,
                    type: requirementType,
                    qty
                })
            }
        }}
        discountMethod={DiscountMethod.Automatic}
        isRecurring
    />
    )};