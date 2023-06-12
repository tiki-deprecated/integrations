/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export interface ShopifyAppInstallRsp {
  data: {
    currentAppInstallation: {
      id: string;
    };
  };
}
