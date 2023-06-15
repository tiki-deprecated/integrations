/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import ShopifyAppDiscountTypeRsp from './shopify-app-discount-type-rsp';
import ShopifyCombinesWith from './shopify-combines-with';

export default interface ShopifyAutomaticAppDiscountRsp {
  discountId: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  status: string;
  appDiscountType: ShopifyAppDiscountTypeRsp;
  combinesWith: ShopifyCombinesWith;
}
