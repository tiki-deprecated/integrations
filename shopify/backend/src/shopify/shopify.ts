/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import ShopifyTokenRsp from './interface/shopify-token-rsp';
import ShopifyAppInstallRsp from './interface/shopify-app-install-rsp';
import ShopifyMetafield from './interface/shopify-metafield';
import { TikiKeyCreateRsp } from '../tiki/tiki-key-create-rsp';
import { ApiHeaders, ApiError } from '@mytiki/worker-utils-ts';
import { ShopifyWebhookReq } from './interface/shopify-webhook-req';
import { StatusError } from 'itty-router';

export type { ShopifyAppInstallRsp, ShopifyWebhookReq, ShopifyMetafield };

export class Shopify {
  static readonly tokenHeader = 'X-Shopify-Access-Token';
  static readonly scope = 'read_orders,write_discounts';
  static readonly signHeader = 'X-Shopify-Hmac-SHA256';
  static readonly namespaceKeys = 'tiki_keys';
  private _accessToken: string | null = null;
  shopDomain: string;
  secretKey: string;
  tokenStore: KVNamespace;

  constructor(shopDomain: string, secretKey: string, tokenStore: KVNamespace) {
    this.shopDomain = shopDomain;
    this.secretKey = secretKey;
    this.tokenStore = tokenStore;
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
  ): Promise<void> {
    const url =
      `https://${this.shopDomain}/admin/oauth/access_token?` +
      `client_id=${clientId}&` +
      `client_secret=${clientSecret}&` +
      `code=${code}&`;
    const token = await fetch(url, {
      method: 'POST',
      headers: new ApiHeaders.HeaderBuilder()
        .content(ApiHeaders.APPLICATION_JSON)
        .build(),
    })
      .then((res) => res.json())
      .then((json) => (json as ShopifyTokenRsp).access_token);
    await this.tokenStore.put(this.shopDomain, token);
  }

  async getToken(): Promise<string> {
    if (this._accessToken == null) {
      this._accessToken = await this.tokenStore.get(this.shopDomain);
    }
    if (this._accessToken == null) {
      throw new StatusError(
        403,
        new ApiError.ApiError()
          .message('Invalid access token')
          .help('Try /api/latest/oauth/authorize')
      );
    }
    return this._accessToken;
  }

  async registerWebhook(webhook: ShopifyWebhookReq): Promise<void> {
    const accessToken = await this.getToken();
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

  registerOrderPaidWebhook = (baseUrl: string): Promise<void> =>
    this.registerWebhook({
      webhook: {
        address: `https://${baseUrl}/api/latest/order/paid`,
        topic: 'orders/paid',
        format: 'json',
      },
    });

  async getAppInstallation(): Promise<ShopifyAppInstallRsp> {
    const accessToken = await this.getToken();
    return fetch(`https://${this.shopDomain}/admin/api/2023-04/graphql.json`, {
      method: 'POST',
      headers: new ApiHeaders.HeaderBuilder()
        .accept(ApiHeaders.APPLICATION_JSON)
        .content(ApiHeaders.APPLICATION_JSON)
        .set(Shopify.tokenHeader, accessToken)
        .build(),
      body: `{"query" : "query {currentAppInstallation{id metafields(namespace: \\"${Shopify.namespaceKeys}\\", first: 3){nodes{key}}}}"}`,
    })
      .then((res) => res.json())
      .then((json) => json as ShopifyAppInstallRsp);
  }

  setKeysInMetafields = async (
    appId: string,
    publicKey: TikiKeyCreateRsp,
    privateKey: TikiKeyCreateRsp
  ) =>
    this.setMetafields([
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

  private async setMetafields(fields: Array<ShopifyMetafield>): Promise<void> {
    const accessToken = await this.getToken();
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
}
