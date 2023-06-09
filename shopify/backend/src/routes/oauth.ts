import { RouterHandler, RouterRequest } from '@tsndr/cloudflare-worker-router';
import * as Shopify from '../shopify/shopify';
import * as Tiki from '../tiki/tiki';

export const authorize: RouterHandler<Env> = async ({ req, res, env }) => {
  const {baseUrl, shop} = getVars(req)
  const apiKey = env.SHOPIFY_CLIENT_ID;
  const authUrl = Shopify.auth(shop, apiKey, baseUrl);
  res.status = 302;
  res.headers.set('location', authUrl);
};

export const token: RouterHandler<Env> = async ({ req, res, env }) => {
  const {baseUrl, shop, code} = getVars(req)
  const appId = env.SHOPIFY_CLIENT_ID;
  const secretKey = env.SHOPIFY_SECRET_KEY;
  const accessToken = await Shopify.token(shop, appId, secretKey, code!);

  const tikiAccessToken = await Tiki.loginWithTiki(shop, accessToken);
  const tikiAppId = await Tiki.createApp(tikiAccessToken, shop);
  const tikiPublicKey = await Tiki.createAppPublicKey(tikiAccessToken, tikiAppId);
  const tikiPrivateKey = await Tiki.createAppPrivateKey(tikiAccessToken, tikiAppId);

  await Shopify.saveKeysToMetafields(shop, accessToken, tikiPublicKey, tikiPrivateKey);
  await Shopify.registerWebhooks(shop, accessToken, baseUrl);

  const extensionUuid = env.SHOPIFY_APP_THEME_EXTENSION_UUID;
  const handle = 'tiki.liquid';
  const deepLinkUrl = `https://${shop}/admin/themes/current/editor?context=apps&activateAppId=${extensionUuid}/${handle}`;

  res.status = 302;
  res.headers.set('location', deepLinkUrl);
};

const getVars = (req: RouterRequest) => {
    const reqUrl = new URL(req.url);
    const baseUrl = reqUrl.hostname;
    const shop = reqUrl.searchParams.get('shop')!;
    const code = reqUrl.searchParams.get('code');
    return {baseUrl, shop, code}
}
