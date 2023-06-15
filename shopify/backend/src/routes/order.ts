/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { IRequest } from 'itty-router';
import { Shopify } from '../shopify/shopify';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function paid(request: IRequest, env: Env): Promise<Response> {
  const shopify = new Shopify('', '', env.SHOPIFY_SECRET_KEY);
  const success = await shopify.verifyWebhook(request);
  console.log(`verified: ${success}`);

  return new Response(null, {
    status: 200,
  });
}
