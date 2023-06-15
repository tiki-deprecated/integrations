/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import ShopifyTokenRsp from './interface/shopify-token-rsp';
import ShopifyAppInstallRsp from './interface/shopify-app-install-rsp';
import ShopifyMetafield from './interface/shopify-metafield';
import ShopifyDiscountUpdateReq from './interface/shopify-discount-update-req';
import { TikiKeyCreateRsp } from '../tiki/tiki-key-create-rsp';
import { ApiHeaders } from '@mytiki/worker-utils-ts';
import { ShopifyWebhookReq } from './interface/shopify-webhook-req';
import ShopifyDiscountCreateReq from './interface/shopify-discount-create-req';
import ShopifyAutomaticAppDiscountRsp from './interface/shopify-automatic-app-discount-rsp';
import ShopifyDiscountOptions from './interface/shopify-discount-options';
import { decodeBase64 } from '../helpers/base64';

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

  authorize = (clientId: string, redirectUri: string, state?: string): string =>
    `https://${this.shopDomain}/admin/oauth/authorize?` +
    `client_id=${clientId}&` +
    `scope=${Shopify.scope}&` +
    `state=${state}&` +
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

  async isAppInstalled(request: Request): Promise<boolean> {
    // TODO
    return true;
  }

  async saveDiscount(
    base64Opt: string,
    shopifyAccessToken: string,
    env: Env
  ): Promise<Response> {
    let functionId, metaFieldkey;
    const options = JSON.parse(decodeBase64(base64Opt));
    const discountType = options.get('discountType');
    const title = options.get('title');
    const description = options.get('description');
    const startsAt = options.get('startsAt');
    const combinesWith = options.get('combinesWith');
    const metaFields: ShopifyDiscountOptions = options.get('metaFields');
    const endsAt = options.get('endsAt');
    const id = options.get('id');
    // TODO ADD ERROR CONTROL FOR MISSING PROPERTIES
    switch (discountType) {
      case 'order':
        functionId = env.SHOPIFY_ORDER_DISCOUNT_FUNCTION_ID;
        metaFieldkey = 'orderDiscountOptions';
        break;
      case 'product':
        functionId = env.SHOPIFY_PRODUCT_DISCOUNT_FUNCTION_ID;
        metaFieldkey = 'productDiscountOptions';
        break;
      default:
        return new Response(`Invalid discount type: ${discountType}`, {
          status: 400,
        });
    }
    const vars: ShopifyDiscountCreateReq = {
      automaticAppDiscount: {
        combinesWith,
        endsAt,
        functionId,
        metafields: [
          {
            description,
            key: metaFieldkey,
            namespace: 'tiki_options',
            type: 'json',
            value: JSON.stringify(metaFields),
          },
        ],
        startsAt,
        title,
      },
    };
    if (id) {
      (vars as ShopifyDiscountUpdateReq).id = id;
    }
    const query =
      '{"query": ' +
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
      '}';
    const functionResponse: Response = await fetch(
      `https://${this.shopDomain}/admin/api/2023-04/graphql.json`,
      {
        method: 'POST',
        headers: new ApiHeaders.HeaderBuilder()
          .accept(ApiHeaders.APPLICATION_JSON)
          .content(ApiHeaders.APPLICATION_JSON)
          .set(Shopify.tokenHeader, shopifyAccessToken)
          .build(),
        body: query,
      }
    );
    const functionResult: ShopifyAutomaticAppDiscountRsp =
      await functionResponse.json();
    return new Response(JSON.stringify(functionResult), { status: 200 });
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
