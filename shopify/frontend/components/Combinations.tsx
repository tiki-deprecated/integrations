import { CombinationCard, DiscountClass } from "@shopify/discount-app-components";
import React, { useState } from "react";

export const CombinationsCard = () => {
    const [combinesWith, setCombinesWith] = useState({
      orderDiscounts: false,
      productDiscounts: false,
      shippingDiscounts: false,
    });
  
    return (
      <CombinationCard
        combinableDiscountTypes={{
          value: combinesWith,
          onChange: setCombinesWith,
        }}
        combinableDiscountCounts={{
          orderDiscountsCount: 0,
          productDiscountsCount: 3,
          shippingDiscountsCount: 0,
        }}
        discountClass={DiscountClass.Product}
        discountDescriptor=""
      />
    );
  }