/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export default interface ShopifyDiscountOptions {
  discountType: string;
  discountValue: number;
  purchaseType: string;
  appliesTo: string[];
  minValue: number;
  minQty: number;
  maxUse: number;
  onePerUser: boolean;
}
