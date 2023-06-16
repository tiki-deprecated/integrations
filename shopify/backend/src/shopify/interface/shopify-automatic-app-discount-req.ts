/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import ShopifyMetafield from './shopify-metafield';
import ShopifyCombinesWith from './shopify-combines-with';

export default interface ShopifyAutomaticAppDiscountReq {
  combinesWith: ShopifyCombinesWith;
  endsAt?: string;
  functionId: string;
  metafields: ShopifyMetafield[];
  startsAt: string;
  title: string;
}
