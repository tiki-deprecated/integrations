/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { UsageLimitsCard } from "@shopify/discount-app-components";
import { useCallback } from "react";
import { useState } from "react";

export const MaxUsageCard = ({onChange = console.log}) => {
    const [totalUsageLimit, setTotalUsageLimit] = useState<number | null>(null);
    const [oncePerCustomer, setOncePerCustomer] = useState<boolean>(false);
  
    const totalUsageUpdate = useCallback(
        (value: number) => {
            setTotalUsageLimit(value)
            onChange({totalUsage: value})
        },
        [totalUsageLimit]
    )

    const oncePerCustomerUpdate = useCallback(
        (value: boolean) => {
            setOncePerCustomer(value)
            onChange({oncePerCustomer: value})
        },
        [oncePerCustomer]
    )

    return (
      <UsageLimitsCard
        totalUsageLimit={{
          value: totalUsageLimit,
          onChange: totalUsageUpdate,
        }}
        oncePerCustomer={{
          value: oncePerCustomer,
          onChange: oncePerCustomerUpdate,
        }}
      />
    )};