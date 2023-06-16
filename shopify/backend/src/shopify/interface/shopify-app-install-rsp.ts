/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export default interface ShopifyAppInstallRsp {
  data: {
    currentAppInstallation: {
      id: string;
    };
  };
}
