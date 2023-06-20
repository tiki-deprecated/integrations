import { SummaryCard, DiscountMethod } from "@shopify/discount-app-components";
import React from "react";


export function DiscountSummary({startsAt, endsAt}) {
    return (
        <SummaryCard
            header={{
                discountMethod: DiscountMethod.Automatic,
                discountDescriptor: '',
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
                startDate: startsAt,
                endDate: endsAt
            }} 
            performance={{
            isEditing: false
            }}                    
        /> 
    )
}