import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { useAppBridge } from "@shopify/app-bridge-react";

export function useAuthenticatedFetch() {
  const app = useAppBridge();
  const fetchFunction = authenticatedFetch(app);

  return async (uri: RequestInfo, options?: RequestInit | undefined) => {
    const response = await fetchFunction(uri, options);
    return response;
  };
}
