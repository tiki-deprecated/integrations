/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export interface DiscountReqAmount {
  discountType: 'percentage' | 'amount';
  discountValue: number;
}
