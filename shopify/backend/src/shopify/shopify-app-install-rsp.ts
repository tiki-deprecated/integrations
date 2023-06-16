/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { ShopifyAppInstall } from './shopify-app-install';
import { ShopifyNodes } from './shopify-nodes';
import { ShopifyMetafield } from './shopify-metafield';

export interface ShopifyAppInstallRsp {
  currentAppInstallation: ShopifyAppInstall;
  metafields?: ShopifyNodes<ShopifyMetafield>;
}
