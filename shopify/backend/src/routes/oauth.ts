/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { Shopify } from '../shopify/shopify';
import { Tiki } from '../tiki/tiki';
import { ApiError } from '@mytiki/worker-utils-ts';
import { IRequest, StatusError } from 'itty-router';

export async function authorize(
  request: IRequest,
  env: Env
): Promise<Response> {
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
  const shopify = new Shopify(baseUrl, shop, env.SHOPIFY_SECRET_KEY);
  const authUrl = shopify.authorize(
    env.SHOPIFY_CLIENT_ID,
    `https://${baseUrl}/api/latest/oauth/token`,
    'install'
  );
  return new Response(null, {
    status: 302,
    headers: new Headers({
      location: authUrl,
    }),
  });
}

export async function token(request: IRequest, env: Env): Promise<Response> {
  const shop = request.params.shop;
  const code = request.params.code;
  if (shop == null || code == null) {
    throw new StatusError(
      404,
      new ApiError.ApiError()
        .message('Missing required parameters.')
        .detail('shop and code are required.')
    );
  }

  const state = request.params.nonce;
  const baseUrl = new URL(request.url).hostname;
  const shopify = new Shopify(baseUrl, shop, env.SHOPIFY_SECRET_KEY);
  const shopifyAccessToken = await shopify.grant(
    env.SHOPIFY_CLIENT_ID,
    env.SHOPIFY_SECRET_KEY,
    code
  );

  switch (state) {
    case 'install': {
      if (await shopify.isAppInstalled(request)) {
        return goHome();
      } else {
        return installApp(shop, shopify, env, shopifyAccessToken);
      }
    }
    case 'saveDiscount': {
      const base64Opt = new URL(request.url).searchParams.get('base64Opt');
      if (base64Opt) {
        return shopify.saveDiscount(base64Opt, shopifyAccessToken, env);
      }
      return new Response('Missing required parameters.', { status: 400 });
    }
    default:
      return goHome();
  }
}

const installApp = async (
  shop: string,
  shopify: Shopify,
  env: Env,
  shopifyAccessToken: string
): Promise<Response> => {
  const tiki = new Tiki(env.TIKI_URL);

  const tikiAccessToken = await tiki.login(shop, shopifyAccessToken);
  const tikiApp = await tiki.createApp(tikiAccessToken, shop);
  const tikiPublicKey = await tiki.createPublicKey(
    tikiAccessToken,
    tikiApp.appId
  );
  const tikiPrivateKey = await tiki.createPrivateKey(
    tikiAccessToken,
    tikiApp.appId
  );

  const appInstallation = await shopify.getAppInstallation(shopifyAccessToken);
  await shopify.setKeysInMetafields(
    shopifyAccessToken,
    appInstallation.data.currentAppInstallation.id,
    tikiPublicKey,
    tikiPrivateKey
  );

  await shopify.registerOrderPaidWebhook(shopifyAccessToken);

  const extensionUuid = env.SHOPIFY_APP_THEME_EXTENSION_UUID;
  const handle = 'tiki.liquid';
  const deepLinkUrl = `https://${shop}/admin/themes/current/editor?context=apps&activateAppId=${extensionUuid}/${handle}`;

  return new Response(null, {
    status: 302,
    headers: new Headers({
      location: deepLinkUrl,
    }),
  });
};

const goHome = () =>
  new Response('home', {
    status: 200,
  });
