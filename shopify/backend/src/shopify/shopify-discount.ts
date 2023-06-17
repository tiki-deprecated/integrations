/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { ShopifyMetafield } from './shopify-metafield';
import { ShopifyCombine } from './shopify-combine';

export interface ShopifyDiscount {
  combinesWith: ShopifyCombine;
  endsAt?: Date;
  functionId: string;
  metafields: Array<ShopifyMetafield>;
  startsAt: Date;
  title: string;
}
