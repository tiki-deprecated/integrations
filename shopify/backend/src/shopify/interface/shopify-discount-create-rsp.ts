/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import ShopifyAutomaticAppDiscountRsp from './shopify-automatic-app-discount-rsp';

export default interface ShopifyDiscountAutomaticAppCreateRsp {
  userErrors: any[];
  automaticAppDiscount: ShopifyAutomaticAppDiscountRsp;
}
