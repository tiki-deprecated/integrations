/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { ShopifyTokenRsp } from './shopify-token-rsp';
import { ApiHeaders } from '@mytiki/worker-utils-ts';
import { ShopifyWebhookReq } from './shopify-webhook-req';
import { ShopifyAppInstallRsp } from './shopify-app-install-rsp';
import { ShopifyMetafield } from './shopify-metafield';
import { TikiKeyCreateRsp } from '../tiki/tiki-key-create-rsp';
import { CombinesWith } from './shopify-discount-create-rsp';
import { ShopifyDiscountOptions } from './shopify-discount-options'
import { ShopifyDiscountUpdateReq } from './shopify_discount_create_req'

export type { ShopifyAppInstallRsp, ShopifyWebhookReq, ShopifyMetafield };

export class Shopify {
    static readonly tokenHeader = 'X-Shopify-Access-Token';
    static readonly scope = 'read_orders,write_discounts';
    static readonly signHeader = 'X-Shopify-Hmac-SHA256';
    shopDomain: string;
    baseUrl: string;
    secretKey: string;

    constructor(baseUrl: string, shopDomain: string, secretKey: string) {
        this.baseUrl = baseUrl;
        this.shopDomain = shopDomain;
        this.secretKey = secretKey;
    }

    authorize = (clientId: string, redirectUri: string): string =>
        `https://${this.shopDomain}/admin/oauth/authorize?` +
        `client_id=${clientId}&` +
        `scope=${Shopify.scope}&` +
        `redirect_uri=${redirectUri}`;

    async grant(
        clientId: string,
        clientSecret: string,
        code: string
    ): Promise<string> {
        const url =
            `https://${this.shopDomain}/admin/oauth/access_token?` +
            `client_id=${clientId}` +
            `&client_secret=${clientSecret}` +
            `&code=${code}` +
            `&grant_options[]=per-user`;
        return fetch(url, {
            method: 'POST',
            headers: new ApiHeaders.HeaderBuilder()
                .content(ApiHeaders.APPLICATION_JSON)
                .build(),
        })
            .then((res) => res.json())
            .then((json) => (json as ShopifyTokenRsp).access_token);
    }

    async registerWebhook(
        accessToken: string,
        webhook: ShopifyWebhookReq
    ): Promise<void> {
        await fetch(`https://${this.shopDomain}/admin/api/2023-04/webhooks.json`, {
            method: 'POST',
            headers: new ApiHeaders.HeaderBuilder()
                .accept(ApiHeaders.APPLICATION_JSON)
                .content(ApiHeaders.APPLICATION_JSON)
                .set(Shopify.tokenHeader, accessToken)
                .build(),
            body: JSON.stringify(webhook),
        });
    }

    registerOrderPaidWebhook = (accessToken: string): Promise<void> =>
        this.registerWebhook(accessToken, {
            webhook: {
                address: `https://${this.baseUrl}/api/latest/order/paid`,
                topic: 'orders/paid',
                format: 'json',
            },
        });

    getAppInstallation = async (
        accessToken: string
    ): Promise<ShopifyAppInstallRsp> =>
        fetch(`https://${this.shopDomain}/admin/api/2023-04/graphql.json`, {
            method: 'POST',
            headers: new ApiHeaders.HeaderBuilder()
                .accept(ApiHeaders.APPLICATION_JSON)
                .content(ApiHeaders.APPLICATION_JSON)
                .set(Shopify.tokenHeader, accessToken)
                .build(),
            body: `{"query" : "query {currentAppInstallation{id}}"}`,
        })
            .then((res) => res.json())
            .then((json) => json as ShopifyAppInstallRsp);

    async setMetafields(
        accessToken: string,
        fields: Array<ShopifyMetafield>
    ): Promise<void> {
        const query =
            `{"query" : "mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) { ` +
            'metafieldsSet(metafields: $metafields) { metafields { key namespace value createdAt updatedAt }' +
            'userErrors { field message code } } }",' +
            '"variables": {' +
            `"metafields": ${JSON.stringify(fields)} }}`;
        await fetch(`https://${this.shopDomain}/admin/api/2023-04/graphql.json`, {
            method: 'POST',
            headers: new ApiHeaders.HeaderBuilder()
                .accept(ApiHeaders.APPLICATION_JSON)
                .content(ApiHeaders.APPLICATION_JSON)
                .set(Shopify.tokenHeader, accessToken)
                .build(),
            body: query,
        });
    }

    setKeysInMetafields = async (
        accessToken: string,
        appId: string,
        publicKey: TikiKeyCreateRsp,
        privateKey: TikiKeyCreateRsp
    ) =>
        this.setMetafields(accessToken, [
            {
                namespace: 'tiki_keys',
                key: 'public_key_id',
                type: 'single_line_text_field',
                value: publicKey.id,
                ownerId: appId,
            },
            {
                namespace: 'tiki_keys',
                key: 'private_key_id',
                type: 'single_line_text_field',
                value: privateKey.id,
                ownerId: appId,
            },
            {
                namespace: 'tiki_keys',
                key: 'private_key_secret',
                type: 'single_line_text_field',
                value: privateKey.secret ?? '',
                ownerId: appId,
            },
        ]);

    async verifyWebhook(request: Request): Promise<boolean> {
        const signature = request.headers.get(Shopify.signHeader) ?? '';
        const signatureBytes = Uint8Array.from(atob(signature), (c) =>
            c.charCodeAt(0)
        );
        const body = await request.text();
        return this.verify(signatureBytes, new TextEncoder().encode(body));
    }

    async verifyOAuth(request: Request): Promise<boolean> {
        const url = new URL(request.url);
        const params = url.searchParams;
        const signature = params.get('hmac') ?? '';
        params.delete('hmac');
        params.sort();

        const match = signature.match(/.{1,2}/g);
        if (match == null) return false;
        const signatureBytes = Uint8Array.from(
            match.map((byte) => parseInt(byte, 16))
        );

        return this.verify(
            signatureBytes,
            new TextEncoder().encode(params.toString())
        );
    }

    async createOrderDiscount(
        title: string,
        description: string,
        startsAt: string,
        combinesWith: CombinesWith,
        metaFields: ShopifyDiscountOptions,
        accessToken: string,
        endsAt?: string,
        id?: string,
    ): Promise<void> {
        const functionId = '01G6M10DHVKQGAR0VZMD4D3V78';
        let vars = {
            automaticAppDiscount: {
                combinesWith,
                endsAt,
                functionId,
                metafields: [
                    {
                        description,
                        key: 'orderDiscountOptions',
                        namespace: 'tiki_options',
                        'type': 'json',
                        'value': JSON.stringify(metaFields)
                    }
                ],
                startsAt,
                title
            },
        }
        if ( id ) {
            (vars as ShopifyDiscountUpdateReq).id = id
        }
        const query = '{"query": ' +
            'mutation discountAutomaticAppCreate($automaticAppDiscount: DiscountAutomaticAppInput!) { ' +
            'discountAutomaticAppCreate(automaticAppDiscount: $automaticAppDiscount) { ' +
            '  automaticAppDiscount { ' +
            JSON.stringify(vars) +
            '  } ' +
            '  userErrors { ' +
            '    field ' +
            '    message ' +
            '  } ' +
            '}' +
            '}'
        await fetch(`https://${this.shopDomain}/admin/api/2023-04/graphql.json`, {
            method: 'POST',
            headers: new ApiHeaders.HeaderBuilder()
                .accept(ApiHeaders.APPLICATION_JSON)
                .content(ApiHeaders.APPLICATION_JSON)
                .set(Shopify.tokenHeader, accessToken)
                .build(),
            body: query,
        });
    }

    private async verify(
        signature: ArrayBuffer,
        data: ArrayBuffer
    ): Promise<boolean> {
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(this.secretKey),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        );
        return await crypto.subtle.verify('HMAC', cryptoKey, signature, data);
    }
}
