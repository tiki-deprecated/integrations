import '@shopify/shopify-api/adapters/cf-worker';
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
import Env from './env';

export const shopifyApp = (env: Env) => shopifyApi({
  apiKey: env.SHOPIFY_CLIENT_ID,
  apiSecretKey: env.SHOPIFY_SECRET_KEY,
  scopes: ['read_orders', 'write_discounts'],
  hostName: 'backend.ricardolgrj.workers.dev',
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true
});