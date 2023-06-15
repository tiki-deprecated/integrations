/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export default interface ShopifyMetafield {
  description?: string;
  id?: string;
  key: string;
  namespace: string;
  ownerId?: string;
  type: string;
  value: string;
}
