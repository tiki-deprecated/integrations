/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export interface DiscountReqMeta {
  type: 'product' | 'order';
  description: string;
  discountType: 'percentage' | 'amount';
  discountValue: number;
  purchaseType: 'one-time' | 'subscription' | 'both';
  appliesTo: Array<string>;
  minValue: number;
  minQty: number;
  maxUse: number;
  onePerUser: boolean;
  products: Array<string>;
  collections: Array<string>;
}
