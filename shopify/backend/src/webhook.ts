import { RouterHandler, RouterResponse, RouterRequest } from '@tsndr/cloudflare-worker-router'
import { Session, DeliveryMethod, RegisterReturn, WebhookValidation } from '@shopify/shopify-api';
import { shopifyApp } from './shopify';
import Env from './env';

export const registerWebhooks = async (shop: string, accessToken: string) => {
    const ordersPaidWebhook = {
        "webhook": {
            "address": "pubsub://projectName:topicName",
            "topic": "orders/paid",
            "format": "json"
        }
    }
    const jsonBody = JSON.stringify(ordersPaidWebhook)
    const queryUrl = `https://${shop}/admin/api/2023-04/webhooks.json`
    const webhookCreate = await fetch(queryUrl, {
        method: "POST",
        headers: {
            'accept': 'application/json',
            'X-Shopify-Access-Token': `${accessToken}`,
            'content-type': 'application/json',
        },
        body: jsonBody
    })
}

export const orderCreate: RouterHandler<Env> = async ({ res, req, env }) => {
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

    // // - get access tokens from Workers KV
    // const value = await env.TIKI.get("first-key");

    // if (value === null) {
    //   res.status = 500
    // }
    // // - get TIKI credentials from Shopify pi
    // // - authenticate with TIKI and send data
    // res.body = 'Hello World'
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