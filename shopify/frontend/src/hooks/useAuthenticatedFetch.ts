/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { AppBridgeState, ClientApplication } from "@shopify/app-bridge";

export function useAuthenticatedFetch(app: ClientApplication<AppBridgeState>) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri: string, options?: RequestInit) => {
    const response = await fetchFunction(uri, options);
    return response;
  };
}