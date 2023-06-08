import { RouterHandler, RouterResponse, RouterRequest } from '@tsndr/cloudflare-worker-router'
import { Session, DeliveryMethod, RegisterReturn, WebhookValidation } from '@shopify/shopify-api';
import { shopifyApp } from './shopify';
import Env from './env';

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

export const orderPaid: RouterHandler<Env> = async ({ res, req, env }) => {

    // TODO authenticate with TIKI
    const orderData = req.body
    const url = 'https://postman-echo.com/post' // TODO CHANGE TO TIKI URL

    const echo = await fetch(url, {
        method: "POST",
        headers: {
            'accept': 'application/json',
            // add TIKI Bearer token
            'content-type': 'application/json',
        },
        body: orderData
    })
    console.log(await echo.text()) // REMOVE
}

export const dataRequest: RouterHandler<Env> = async ({ res, req, env }) => {
    const isValid = await validate(req, res, env)
    if (!isValid) {
        res.status = 400;
        return
    }

    const shopify = shopifyApp(env)

    res.body = JSON.stringify([
        req.body,
        req.headers
    ])
}

export const customerRedact: RouterHandler<Env> = async ({ res, req, env }) => {
    const isValid = await validate(req, res, env)
    if (!isValid) {
        res.status = 400;
        return
    }

    const shopify = shopifyApp(env)

    res.body = JSON.stringify([
        req.body,
        req.headers
    ])
}

export const shopRedact: RouterHandler<Env> = async ({ res, req, env }) => {
    const isValid = await validate(req, res, env)
    if (!isValid) {
        res.status = 400;
        return
    }

    const shopify = shopifyApp(env)

    res.body = JSON.stringify([
        req.body,
        req.headers
    ])
}

const validate = async (req: RouterRequest, res: RouterResponse, env: Env) => {
    const shopify = shopifyApp(env)
    const { valid } = await shopify.webhooks.validate({
        rawBody: req.body as string,
        rawRequest: req,
        rawResponse: res,
    });
    return valid
}