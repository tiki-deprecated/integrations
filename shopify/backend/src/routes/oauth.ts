import { RouterHandler } from '@tsndr/cloudflare-worker-router'
import * as Shopify from '../shopify/shopify'
import * as Tiki from '../tiki/tiki'

export const authorize: RouterHandler<Env> = async ({ req, res, env }) => {
    const reqUrl = new URL(req.url)
    const shop = reqUrl.searchParams.get('shop')!
    const apiKey = env.SHOPIFY_CLIENT_ID
    const authUrl = Shopify.auth(shop, apiKey)
    res.status = 302
    res.headers.set('location', authUrl)
}

export const token: RouterHandler<Env> = async ({ req, res, env }) => {
    const reqUrl = new URL(req.url)
    const baseUrl = reqUrl.hostname
    const code = reqUrl.searchParams.get('code')!
    const shop = reqUrl.searchParams.get('shop')!
    const appId = env.SHOPIFY_CLIENT_ID
    const secretKey = env.SHOPIFY_SECRET_KEY
    const accessToken = await Shopify.token(shop, appId, secretKey, code)

    const tikiAccessToken = await Tiki.loginWithTiki(shop, accessToken)
    const tikiAppId = await Tiki.createApp(tikiAccessToken, shop)
    const tikiPublicKey = await Tiki.createAppPublicKey(tikiAccessToken, tikiAppId)
    const tikiPrivateKey = await Tiki.createAppPrivateKey(tikiAccessToken, tikiAppId)

    await Shopify.saveKeysToMetafields(shop, accessToken, tikiPublicKey, tikiPrivateKey)
    await Shopify.registerWebhooks(shop, accessToken, baseUrl)

    const extensionUuid = env.SHOPIFY_APP_THEME_EXTENSION_UUID
    const handle = 'tiki.liquid'
    const deepLinkUrl = `https://${shop}/admin/themes/current/editor?context=apps&activateAppId=${extensionUuid}/${handle}`

    res.status = 302
    res.headers.set('location', deepLinkUrl)
}
