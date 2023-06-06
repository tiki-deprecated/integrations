import { RouterHandler } from '@tsndr/cloudflare-worker-router'
import Env from './env';
import { shopifyApp } from './shopify'
import { registerWebhooks } from './webhook';
import { AccessTokenResponse } from '@shopify/shopify-api';


export const auth: RouterHandler<Env> = async ({ req, env }) => {
    console.log('auth start')

    const shopify = shopifyApp(env)

    const { searchParams }: URL = new URL(req.url);
    const shop = shopify.utils.sanitizeShop(searchParams.get('shop')!, true)!

    console.log(shop)
    let result = await shopify.auth.begin({
        shop: shop,
        callbackPath: '/auth/callback',
        isOnline: true,
        rawRequest: req,
    });
    console.log('auth done')
    console.log(result)
}

export const authCallback: RouterHandler<Env> = async ({ req, res, env }) => {
    const code = req.query.code
    const shop = req.query.shop

    const accessCodeUrl = `https://${shop}/admin/oauth/access_token?` +
        `client_id=${env.SHOPIFY_CLIENT_ID}` +
        `&client_secret=${env.SHOPIFY_SECRET_KEY}` +
        `&code=${code}`
    const accessCodeUrlResp = await fetch(accessCodeUrl, {
        method: "POST",
        headers: {
            "content-type": "application/json;charset=UTF-8",
        },
    });
    const { access_token }: AccessTokenResponse = await accessCodeUrlResp.json()

    env.TIKI.put(shop, access_token)

    const tiki_code = await env.TIKI.get(shop)
    console.log(tiki_code)
    console.log(access_token)
}