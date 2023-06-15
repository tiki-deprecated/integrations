/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { Shopify } from '../shopify/shopify';
import { ApiError } from '@mytiki/worker-utils-ts';
import { IRequest, StatusError } from 'itty-router';
import { encodeBase64 } from '../helpers/base64';

export async function save(request: IRequest, env: Env): Promise<Response> {
  const shop = request.params.shop;
  const baseUrl = new URL(request.url).hostname;
  if (shop == null) {
    throw new StatusError(
      404,
      new ApiError.ApiError()
        .message('Missing required parameters.')
        .detail('shop is required.')
    );
  }
  const base64Opt = encodeBase64(JSON.stringify(await request.json()));
  const shopify = new Shopify(baseUrl, shop, env.SHOPIFY_SECRET_KEY);
  const authUrl = shopify.authorize(
    env.SHOPIFY_CLIENT_ID,
    `https://${baseUrl}/api/latest/oauth/token?base64Opt=${base64Opt}`,
    'saveDiscount'
  );
  return new Response(null, {
    status: 302,
    headers: new Headers({
      location: authUrl,
    }),
  });
}
