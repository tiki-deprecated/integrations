/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export interface ShopifyDiscountCreateRsp {
  discountAutomaticAppCreate: DiscountAutomaticAppCreateRsp;
}

export interface DiscountAutomaticAppCreateRsp {
  userErrors: any[];
  automaticAppDiscount: AutomaticAppDiscountRsp;
}

export interface AutomaticAppDiscountRsp {
  discountId: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  status: string;
  appDiscountType: AppDiscountTypeRsp;
  combinesWith: CombinesWith;
}

export interface AppDiscountTypeRsp {
  appKey: string;
  functionId: string;
}

export interface CombinesWith {
  orderDiscounts: boolean;
  productDiscounts: boolean;
  shippingDiscounts: boolean;
}
