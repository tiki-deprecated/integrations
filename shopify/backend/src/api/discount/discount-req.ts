/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { DiscountReqCombine } from './discount-req-combine';
import { DiscountReqMeta } from './discount-req-meta';

export interface DiscountReq {
  discountType: string;
  title: string;
  description: string;
  startsAt: Date;
  combinesWith: DiscountReqCombine;
  metaFields: DiscountReqMeta;
  endsAt?: string;
  id?: string;
}
