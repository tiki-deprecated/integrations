import { RouterHandler } from '@tsndr/cloudflare-worker-router'
import Env from './env';
import { AccessTokenResponse } from '@shopify/shopify-api';
import { registerWebhooks } from './webhook';
import { shopifyApp } from './shopify';

export const auth: RouterHandler<Env> = async ({ req, res, env }) => {
    const shop = req.query.shop
    const api_key = env.SHOPIFY_CLIENT_ID
    const scopes = 'read_orders,write_discounts'
    const redirect_uri = `https://backend.ricardolgrj.workers.dev/auth/callback`
    const authUrl = `https://${shop}/admin/oauth/authorize?` +
        `client_id=${api_key}&` +
        `scope=${scopes}&` +
        `redirect_uri=${redirect_uri}`
    res.status = 302
    res.headers.set('location', authUrl)
}

export const authCallback: RouterHandler<Env> = async ({ req, res, env }) => {
    const shopify = shopifyApp(env)
    const code = req.query.code
    const shop = req.query.shop

    const accessCodeUrl = `https://${shop}/admin/oauth/access_token?` +
        `client_id=${env.SHOPIFY_CLIENT_ID}` +
        `&client_secret=${env.SHOPIFY_SECRET_KEY}` +
        `&code=${code}` +
        `&grant_options[]=per-user`

    const accessCodeUrlResp = await fetch(accessCodeUrl, {
        method: "POST",
        headers: {
            "content-type": "application/json;charset=UTF-8",
        },
    });

    const { access_token }: AccessTokenResponse = await accessCodeUrlResp.json()
    const tikiAccessToken = await loginWithTiki(shop, access_token)
    const tikiAppId = await createApp(tikiAccessToken, shop)
    const tikiPublicKey = await createAppPublicKey(tikiAccessToken, tikiAppId)
    const tikiPrivateKey = await createAppPrivateKey(tikiAccessToken, tikiAppId)

    //await saveKeysToMetafields(access_token, tikiPublicKey, tikiPrivateKey)
    
    shopify.session.customAppSession
    registerWebhooks(shop, access_token)

    // deeplink redirect
    // `https://${shop}/admin/themes/current/editor?` +
    // `context=apps` +
    // `&activateAppId=${uuid}` +
    // `/tiki.liquid` +
}

const loginWithTiki = async (shop: string, shopify_token: string): Promise<String> => {
    const loginReq: TikiLoginReq = {
        'grant_type': 'urn:ietf:params:oauth:grant-type:token-exchange',
        'client_id': shop,
        'subject_token': shopify_token,
        'subject_token_type': 'urn:mytiki:params:oauth:token-type:shopify',
        'scope': 'auth'
    }
    const url = 'https://auth.l0.mytiki.com/api/latest/oauth/token'
    const formBody = Object.entries(loginReq).map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value)).join('&')
    const tikiLoginResponse = await fetch(url, {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
        },
        body: formBody
    })
    const { access_token }: TikiLoginResp = await tikiLoginResponse.json()
    return access_token
}

const createApp = async (tikiAccessToken: String, shop: String): Promise<String> => {
    const createAppUrl = 'https://auth.l0.mytiki.com/api/latest/app'
    const createAppJsonReq = JSON.stringify({
        'name': shop
    })
    const createAppResponse: Response = await fetch(createAppUrl, {
        method: "POST",
        headers: {
            'accept': 'application/json',
            'authorization': `Bearer ${tikiAccessToken}`,
            'content-type': 'application/json',
        },
        body: createAppJsonReq
    })
    const { appId }: TikiCreateAppResp = await createAppResponse.json()
    return appId
}

const createAppPrivateKey = async (tikiAccessToken: String, appId: String): Promise<String> => {

    const createKeysUrl = `https://auth.l0.mytiki.com/api/latest/app/${appId}/key`
    const createKeysResponse = await fetch(createKeysUrl, {
        method: "POST",
        headers: {
            'accept': 'application/json',
            'authorization': `Bearer ${tikiAccessToken}`,
            'content-type': 'application/json',
        }
    })
    const { secret }: TikiCreateKeysResp = await createKeysResponse.json()
    return secret
}

const createAppPublicKey = async (tikiAccessToken: String, appId: String): Promise<String> => {

    const createKeysUrl = `https://auth.l0.mytiki.com/api/latest/app/${appId}/key`
    const createKeysResponse = await fetch(createKeysUrl, {
        method: "POST",
        headers: {
            'accept': 'application/json',
            'authorization': `Bearer ${tikiAccessToken}`,
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            'public': true
        })
    })
    const { id }: TikiCreateKeysResp = await createKeysResponse.json()
    return id
}

const saveKeysToMetafields = async (shop: String, shopifyAccessToken: String, tikiPrivateKey: String, tikiPublicKey: String): Promise<String> => {
    const queryUrl = `https://${shop}.myshopify.com/admin/api/2023-04/graphql.json`
    const appIdQuery = await fetch(queryUrl, {
        method: "POST",
        headers: {
            'accept': 'application/json',
            'X-Shopify-Access-Token': `${shopifyAccessToken}`,
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            query: `{
                products
              }
            `
        })
    })
    console.log(appIdQuery.status)
    console.log(await appIdQuery.json())

}


interface TikiLoginReq {
    grant_type: String,
    client_id: String,
    subject_token: String,
    subject_token_type: String,
    scope: String,
}

interface TikiLoginResp {
    access_token: String,
    refresh_token: String,
    scope: String,
    token_type: String,
    expires_in: Number
}

interface TikiCreateAppResp {
    appId: String,
    name: String,
    orgId: String,
    modified: String,
    created: String
}

interface TikiCreateKeysResp {
    id: String,
    created: String,
    isPublic: boolean,
    secret: String,
    public: boolean
}
