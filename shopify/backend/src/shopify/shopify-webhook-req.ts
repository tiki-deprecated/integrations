/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export interface ShopifyWebhook {
  address: string;
  topic: string;
  format: 'json' | 'xml';
}

export interface ShopifyWebhookReq {
  webhook: ShopifyWebhook;
}
