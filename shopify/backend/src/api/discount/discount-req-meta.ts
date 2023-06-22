/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { DiscountReqAmount } from './discount-req-amount';
import { DiscountReqRestrictions } from './discount-req-restrictions';

export interface DiscountReqMeta {
  type: 'product' | 'order';
  description: string;
  discountAmount: DiscountReqAmount;
  discountRestrictions: DiscountReqRestrictions;
  products: Array<string>;
  collections: Array<string>;
}
