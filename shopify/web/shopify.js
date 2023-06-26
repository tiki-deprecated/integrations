import { BillingInterval, LATEST_API_VERSION } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-04";

const DB_PATH = `${process.cwd()}/database.sqlite`;

const shopify = shopifyApp({
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources,
    billing: undefined,
  },
  auth: {
    path: "/api/latest/oauth/authorize",
    callbackPath: "/api/latest/oauth/token",
  },
  sessionStorage: new SQLiteSessionStorage(DB_PATH),
});

export default shopify;
