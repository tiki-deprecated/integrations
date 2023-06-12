/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { ShopifyTokenRsp } from './shopify-token-rsp';
import {
  APPLICATION_JSON,
  HeaderBuilder,
} from '@mytiki/worker-utils-ts/api/api-headers';
import { ShopifyWebhookReq } from './shopify-webhook-req';
import { ShopifyAppInstallRsp } from './shopify-app-install-rsp';
import { ShopifyMetafield } from './shopify-metafield';
import { TikiKeyCreateRsp } from '../tiki/tiki-key-create-rsp';

export type { ShopifyAppInstallRsp, ShopifyWebhookReq, ShopifyMetafield };

export class Shopify {
  static readonly tokenHeader = 'X-Shopify-Access-Token';
  static readonly scope = 'read_orders,write_discounts';
  shopDomain: string;
  baseUrl: string;

  constructor(baseUrl: string, shopDomain: string) {
    this.baseUrl = baseUrl;
    this.shopDomain = shopDomain;
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
      headers: new HeaderBuilder().content(APPLICATION_JSON).build(),
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
      headers: new HeaderBuilder()
        .accept(APPLICATION_JSON)
        .content(APPLICATION_JSON)
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
      headers: new HeaderBuilder()
        .accept(APPLICATION_JSON)
        .content(APPLICATION_JSON)
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
      headers: new HeaderBuilder()
        .accept(APPLICATION_JSON)
        .content(APPLICATION_JSON)
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
}
