/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { RouterHandler, RouterRequest } from '@tsndr/cloudflare-worker-router';
import { Shopify } from '../shopify/shopify';
import { Tiki } from '../tiki/tiki';
import { ApiError } from '@mytiki/worker-utils-ts/api/api-error';

export const authorize: RouterHandler<Env> = async ({ req, res, env }) => {
  const { baseUrl, shop } = parseParams(req);
  if (shop == null) {
    res.raw = new ApiError()
      .message('Missing required parameters.')
      .detail('shop is null')
      .response(200);
    return;
  }
  const shopify = new Shopify(baseUrl, shop);
  const authUrl = shopify.authorize(env.SHOPIFY_CLIENT_ID);
  res.status = 302;
  res.headers.set('location', authUrl);
};

export const token: RouterHandler<Env> = async ({ req, res, env }) => {
  const { baseUrl, shop, code } = parseParams(req);
  if (shop == null || code == null) {
    res.raw = new ApiError()
      .message('Missing required parameters.')
      .detail('shop and code are null')
      .response(200);
    return;
  }

  const tiki = new Tiki(env.TIKI_URL);
  const shopify = new Shopify(baseUrl, shop);
  const shopifyAccessToken = await shopify.grant(
    env.SHOPIFY_CLIENT_ID,
    env.SHOPIFY_SECRET_KEY,
    code
  );

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

  res.status = 302;
  res.headers.set('location', deepLinkUrl);
};

const parseParams = (req: RouterRequest) => {
  const reqUrl = new URL(req.url);
  const baseUrl = reqUrl.hostname;
  const shop = reqUrl.searchParams.get('shop');
  const code = reqUrl.searchParams.get('code');
  return { baseUrl, shop, code };
};
