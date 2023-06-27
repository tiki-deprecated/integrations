/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { DiscountMethod, SummaryCard } from "@shopify/discount-app-components"

export function SummarySection({title = "", startsAt = "", endsAt = undefined}){
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
                startDate: startsAt,
                endDate: endsAt ?? undefined
            }} 
            performance={{
            isEditing: false
            }}                    
        />
    )
}