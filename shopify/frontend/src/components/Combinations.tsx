import { CombinationCard, DiscountClass } from "@shopify/discount-app-components";
import React, { useCallback, useState } from "react";

export interface Combinations {
    orderDiscounts: boolean
    productDiscounts: boolean
    shippingDiscounts: boolean
}

export const CombinationsCard = ({onChange = console.log, discountClass = DiscountClass.Product}) => {
    const [combinesWith, setCombinesWith] = useState({
      orderDiscounts: false,
      productDiscounts: false,
      shippingDiscounts: false,
    });

    const onChangeCallback = useCallback (
        (value: Combinations) => {
            onChange(value)
            setCombinesWith(value)
        },
        [combinesWith]
    )
  
    return (
      <CombinationCard
        combinableDiscountTypes={{
          value: combinesWith,
          onChange: onChangeCallback,
        }}
        discountClass={discountClass}
        discountDescriptor=""
      />
    );
  }