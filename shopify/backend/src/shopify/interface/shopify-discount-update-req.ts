/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */
import ShopifyDiscountCreateReq from './shopify-discount-create-req';

export default interface ShopifyDiscountUpdateReq
  extends ShopifyDiscountCreateReq {
  id: string;
}
