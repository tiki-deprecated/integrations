/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { Shopify } from '../../shopify/shopify';
import { Tiki } from '../../tiki/tiki';
import { ApiError } from '@mytiki/worker-utils-ts';
import { IRequest, StatusError } from 'itty-router';

export async function authorize(
  request: IRequest,
  env: Env
): Promise<Response> {
  const shop = request.query.shop as string;
  const baseUrl = new URL(request.url).hostname;
  if (shop == null) {
    throw new StatusError(
      404,
      new ApiError.ApiError()
        .message('Missing required parameters.')
        .detail('shop is required.')
    );
  }
  const shopify = new Shopify(shop, env);
  const authUrl = shopify.authorize(
    `https://${baseUrl}/api/latest/oauth/token`
  );
  return new Response(null, {
    status: 302,
    headers: new Headers({
      location: authUrl,
    }),
  });
}

export async function token(request: IRequest, env: Env): Promise<Response> {
  const shop = request.query.shop as string;
  const code = request.query.code as string;
  const baseUrl = new URL(request.url).hostname;
  if (shop == null || code == null) {
    throw new StatusError(
      404,
      new ApiError.ApiError()
        .message('Missing required parameters.')
        .detail('shop and code are required.')
    );
  }

  const shopify = new Shopify(shop, env);
  await shopify.grant(code);
  const appInstallation = await shopify.getAppInstallation();
  const keys = appInstallation.data.metafields?.nodes;
  if (keys === undefined || keys.length < 3) {
    await onInstall(
      new Tiki(env),
      shopify,
      appInstallation.data.currentAppInstallation.id,
      baseUrl
    );
  }

  return new Response(null, {
    status: 302,
    headers: new Headers({
      location: `https://${shop}/apps/${env.KEY_ID}`,
    }),
  });
}

async function onInstall(
  tiki: Tiki,
  shopify: Shopify,
  installId: string,
  baseUrl: string
): Promise<void> {
  const shopifyAccessToken = await shopify.getToken();
  const tikiAccessToken = await tiki.login(
    shopify.shopDomain,
    shopifyAccessToken
  );
  const tikiApp = await tiki.createApp(tikiAccessToken, shopify.shopDomain);
  const tikiPublicKey = await tiki.createPublicKey(
    tikiAccessToken,
    tikiApp.appId
  );
  const tikiPrivateKey = await tiki.createPrivateKey(
    tikiAccessToken,
    tikiApp.appId
  );
  await shopify.setKeysInMetafields(installId, tikiPublicKey, tikiPrivateKey);
  await shopify.registerOrderPaidWebhook(baseUrl);
}
