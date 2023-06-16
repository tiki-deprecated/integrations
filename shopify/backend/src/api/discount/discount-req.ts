/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { DiscountReqCombine } from './discount-req-combine';
import { DiscountReqMeta } from './discount-req-meta';

export interface DiscountReq {
  type: 'product' | 'order';
  title: string;
  description: string;
  startsAt: Date;
  combinesWith: DiscountReqCombine;
  metafields: DiscountReqMeta;
  endsAt?: Date;
  id?: string;
}
