import { RouterHandler, RouterResponse, RouterRequest } from '@tsndr/cloudflare-worker-router'
import { Session, DeliveryMethod, RegisterReturn, WebhookValidation } from '@shopify/shopify-api';
import { shopifyApp } from './shopify';
import Env from './env';

export const registerWebhooks = async (session: Session, env: Env) => {
    const shopify = shopifyApp(env)

    shopify.webhooks.addHandlers({
        ORDERS_CREATE: [
            {
                deliveryMethod: DeliveryMethod.Http,
                callbackUrl: '/webhook/order_create',
            },
        ],
        DATA_REQUEST: [
            {
                deliveryMethod: DeliveryMethod.Http,
                callbackUrl: '/webhook/customers/data_request',
            },
        ],
        CUSTOMER_REDACT: [
            {
                deliveryMethod: DeliveryMethod.Http,
                callbackUrl: '/webhook/customers/redact',
            },
        ],
        SHOP_REDACT: [
            {
                deliveryMethod: DeliveryMethod.Http,
                callbackUrl: '/webhook/shop/redact',
            },
        ],
    });

    const response: RegisterReturn = await shopify.webhooks.register({
        session: session,
    });

    handleRegisterReturnErrors(response)
}

const handleRegisterReturnErrors = (response: RegisterReturn) => {
    if (!response['ORDERS_CREATE'][0].success) {
        console.log(
        `Failed to register ORDERS_CREATE webhook: ${response['ORDERS_CREATE'][0].result}`,
        );
    }
    if (!response['DATA_REQUEST'][0].success) {
        console.log(
        `Failed to register DATA_REQUEST webhook: ${response['DATA_REQUEST'][0].result}`,
        );
    }
    if (!response['CUSTOMER_REDACT'][0].success) {
        console.log(
        `Failed to register CUSTOMER_REDACT webhook: ${response['CUSTOMER_REDACT'][0].result}`,
        );
    }
    if (!response['SHOP_REDACT'][0].success) {
        console.log(
        `Failed to register SHOP_REDACT webhook: ${response['SHOP_REDACT'][0].result}`,
        );
    }
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

export const orderCreate: RouterHandler<Env> = async ({ res, req, env }) => {
    const isValid = await validate(req, res, env)
    if( !isValid ){
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
    if( !isValid ){
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
    if( !isValid ){
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
    if( !isValid ){
        res.status = 400;
        return
    }

    const shopify = shopifyApp(env)

    res.body = JSON.stringify([
        req.body,
        req.headers
    ])
}