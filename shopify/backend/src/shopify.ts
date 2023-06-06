import '@shopify/shopify-api/adapters/cf-worker';
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
import Env from './env';

export const shopifyApp = (env: Env) => shopifyApi({
  apiKey: env.SHOPIFY_CLIENT_ID, //'33d82ccecd1a316a4cbdb7d090735fa8',
  apiSecretKey: env.SHOPIFY_SECRET_KEY, //'4a606e64092dd10501ce90c232aee402',
  scopes: ['read_orders', 'write_discounts'],
  hostName: 'backend.ricardolgrj.workers.dev',
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true
});