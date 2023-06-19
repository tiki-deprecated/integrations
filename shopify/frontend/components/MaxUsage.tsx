import { RecurringPaymentType, UsageLimitsCard } from "@shopify/discount-app-components";
import React from "react";
import { useState } from "react";

export const MaxUsageCard = () => {
    const [totalUsageLimit, setTotalUsageLimit] = useState(null);
    const [oncePerCustomer, setOncePerCustomer] = useState(false);
    const [recurringPaymentType, setRecurringPaymentType] = useState(
      RecurringPaymentType.AllPayments
    );
    const [recurringPaymentsLimit, setRecurringPaymentsLimit] = useState("");
  
    return (
      <UsageLimitsCard
        totalUsageLimit={{
          value: totalUsageLimit,
          onChange: setTotalUsageLimit,
        }}
        oncePerCustomer={{
          value: oncePerCustomer,
          onChange: setOncePerCustomer,
        }}
      />
    )};