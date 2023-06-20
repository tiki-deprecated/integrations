import { CombinationCard, DiscountClass } from "@shopify/discount-app-components";
import React, { useCallback, useState } from "react";

export const CombinationsCard = ({onChange}) => {
    const [combinesWith, setCombinesWith] = useState({
      orderDiscounts: false,
      productDiscounts: false,
      shippingDiscounts: false,
    });

    const onChangeCallback = useCallback (
        (value) => {
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
        discountClass={DiscountClass.Product}
        discountDescriptor=""
      />
    );
  }