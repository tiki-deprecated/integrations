/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export interface DiscountReqRestrictions {
  minValue: number;
  minQty: number;
  maxUse: number;
  onePerUser: boolean;
}
