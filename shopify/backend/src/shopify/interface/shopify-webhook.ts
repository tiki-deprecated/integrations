/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export default interface ShopifyWebhook {
  address: string;
  topic: string;
  format: 'json' | 'xml';
}
