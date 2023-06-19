/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { ShopifyMetafield } from '../meta/shopify-metafield';
import { ShopifyCombine } from './shopify-combine';

export interface ShopifyDiscountCreate {
  combinesWith: ShopifyCombine;
  endsAt?: Date;
  functionId: string;
  metafields: Array<ShopifyMetafield>;
  startsAt: Date;
  title: string;
}
