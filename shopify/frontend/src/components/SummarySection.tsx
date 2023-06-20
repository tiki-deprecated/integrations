import { DiscountMethod, SummaryCard } from "@shopify/discount-app-components"
import { TextField, VerticalStack } from "@shopify/polaris"
import React, { useState } from "react"

export function SummarySection({title, startsAt, endsAt}){
    return (
        <SummaryCard
            header={{
                discountMethod: DiscountMethod.Automatic,
                discountDescriptor: title,
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
                endDate: endsAt?.value ?? undefined
            }} 
            performance={{
            isEditing: false
            }}                    
        />
    )
}