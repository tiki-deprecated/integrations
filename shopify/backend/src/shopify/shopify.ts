import { CurrentAppInstallationResp } from './interface'
import { AccessTokenResponse } from './interface'

export const auth = (shop: string, apiKey: string) => {
    const scopes = 'read_orders,write_discounts'
    const redirectUri = `https://backend.ricardolgrj.workers.dev/auth/callback`
    return `https://${shop}/admin/oauth/authorize?` +
        `client_id=${apiKey}&` +
        `scope=${scopes}&` +
        `redirect_uri=${redirectUri}`
}

export const token = async (shop: string, appId: string, secretKey: string, code: string) => {
    const accessCodeUrl = `https://${shop}/admin/oauth/access_token?` +
        `client_id=${appId}` +
        `&client_secret=${secretKey}` +
        `&code=${code}` +
        `&grant_options[]=per-user`

    const accessCodeUrlResp = await fetch(accessCodeUrl, {
        method: "POST",
        headers: {
            "content-type": "application/json;charset=UTF-8",
        },
    });

    const { access_token }: AccessTokenResponse = await accessCodeUrlResp.json()
    return access_token
}
    
export const registerWebhooks = async (shop: string, accessToken: string, baseUrl: string) => {
    const ordersPaidWebhook = {
        "webhook": {
            "address": `https://${baseUrl}/webhook/order/paid`,
            "topic": "orders/paid",
            "format": "json"
        }
    }
    const jsonBody = JSON.stringify(ordersPaidWebhook)
    const queryUrl = `https://${shop}/admin/api/2023-04/webhooks.json`
    await fetch(queryUrl, {
        method: "POST",
        headers: {
            'accept': 'application/json',
            'X-Shopify-Access-Token': `${accessToken}`,
            'content-type': 'application/json',
        },
        body: jsonBody
    })
}

export const saveKeysToMetafields = async (shop: String, shopifyAccessToken: String, tikiPrivateKey: String, tikiPublicKey: String): Promise<void> => {
    const queryUrl = `https://${shop}/admin/api/2023-04/graphql.json`
    const query = `{"query" : "query {currentAppInstallation{id}}"}`
    const appIdQuery = await fetch(queryUrl, {
        method: "POST",
        headers: {
            'accept': 'application/json',
            'X-Shopify-Access-Token': `${shopifyAccessToken}`,
            'content-type': 'application/json',
        },
        body: query
    })
    let { data }: CurrentAppInstallationResp = await appIdQuery.json()
    let appId = data.currentAppInstallation.id
    const mutationQuery = `{"query" : "mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) { ` +
        'metafieldsSet(metafields: $metafields) { metafields { key namespace value createdAt updatedAt }' +
        'userErrors { field message code } } }",' +
        '"variables": {' +
            '"metafields": [' +
            '{' +
                '"namespace": "tiki_keys",' +
                '"key": "tiki_public_key",' +
                '"type": "single_line_text_field",' +
                `"value": "${tikiPublicKey}",` +
                `"ownerId": "${appId}"` +
            '},' +
            '{' +
                '"namespace": "tiki_keys",' +
                '"key": "tiki_private_key",' +
                '"type": "single_line_text_field",' +
                `"value": "${tikiPrivateKey}",` +
                `"ownerId": "${appId}"` +
            '}]}}'
    await fetch(queryUrl, {
        method: "POST",
        headers: {
            'accept': 'application/json',
            'X-Shopify-Access-Token': `${shopifyAccessToken}`,
            'content-type': 'application/json',
        },
        body: mutationQuery
    })
}