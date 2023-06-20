import { RequirementType, MinimumRequirementsCard, AppliesTo, DiscountMethod } from "@shopify/discount-app-components";
import { CurrencyCode } from "@shopify/react-i18n";
import React from "react";
import { useState } from "react";

export const MinReqsCard = ({appliesTo, type, subTotal, qty, onChange}) => {
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