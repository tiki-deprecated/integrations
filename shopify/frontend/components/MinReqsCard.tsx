import { RequirementType, MinimumRequirementsCard, AppliesTo, DiscountMethod } from "@shopify/discount-app-components";
import { CurrencyCode } from "@shopify/react-i18n";
import React from "react";
import { useState } from "react";

export const MinReqsCard = () => {
    const [requirementType, setRequirementType] = useState(RequirementType.None);
    const [subtotal, setSubtotal] = useState("");
    const [quantity, setQuantity] = useState("");
    return (
    <MinimumRequirementsCard
        appliesTo={AppliesTo.Products}
        currencyCode={CurrencyCode.Cad}
        requirementType={{
        value: requirementType,
        onChange: setRequirementType,
        }}
        subtotal={{
        value: subtotal,
        onChange: setSubtotal,
        }}
        quantity={{
        value: quantity,
        onChange: setQuantity,
        }}
        discountMethod={DiscountMethod.Code}
        isRecurring
    />
    )};