/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { SummaryCard, DiscountMethod } from "@shopify/discount-app-components";

export interface DiscountSummaryProps{
    startsAt: string
    endsAt: string
}

export function DiscountSummary({startsAt, endsAt}: DiscountSummaryProps) {
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