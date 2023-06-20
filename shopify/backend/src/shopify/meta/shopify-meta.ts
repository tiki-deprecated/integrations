/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { ShopifyAuth } from '../auth/shopify-auth';
import { ShopifyData } from './shopify-data';
import { ShopifyCustomerRsp } from './shopify-customer-rsp';
import { API } from '@mytiki/worker-utils-ts';
import { TikiKeyCreateRsp } from '../../tiki/tiki-key-create-rsp';
import { ShopifyMetafield } from './shopify-metafield';
import { ShopifyAppInstallRsp } from './shopify-app-install-rsp';
import { ShopifyWebhook } from '../webhook/shopify-webhook';

export class ShopifyMeta extends ShopifyWebhook {
  static readonly namespace = 'mytiki';

  async setMetafields(fields: Array<ShopifyMetafield>): Promise<void> {
    const accessToken = await this.getToken();
    await fetch(`https://${this.shopDomain}/admin/api/2023-04/graphql.json`, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .accept(API.Consts.APPLICATION_JSON)
        .content(API.Consts.APPLICATION_JSON)
        .set(ShopifyAuth.tokenHeader, accessToken)
        .build(),
      body: JSON.stringify({
        query: `mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) { 
            metafields { 
              key 
              namespace 
              value 
              createdAt 
              updatedAt 
            }
            userErrors { 
              field 
              message 
              code 
            } 
          } 
        }`,
        variables: {
          metafields: JSON.stringify(fields),
        },
      }),
    });
  }

  async getCustomerMetafield(
    id: number,
    namespace: string,
    key: string
  ): Promise<ShopifyData<ShopifyCustomerRsp>> {
    const accessToken = await this.getToken();
    return fetch(`https://${this.shopDomain}/admin/api/2023-04/graphql.json`, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .accept(API.Consts.APPLICATION_JSON)
        .content(API.Consts.APPLICATION_JSON)
        .set(ShopifyAuth.tokenHeader, accessToken)
        .build(),
      body: JSON.stringify({
        query: `query Customer {
          customer(id: "gid://shopify/Customer/${id}") {
            metafield(key: "${key}", namespace: "${namespace}") {
              value
            }}}`,
      }),
    })
      .then((res) => res.json())
      .then((json) => json as ShopifyData<ShopifyCustomerRsp>);
  }

  saveKeys = async (
    appId: string,
    publicKey: TikiKeyCreateRsp,
    privateKey: TikiKeyCreateRsp
  ): Promise<void> =>
    this.setMetafields([
      {
        namespace: ShopifyMeta.namespace,
        key: 'public_key_id',
        type: 'single_line_text_field',
        value: publicKey.id,
        ownerId: appId,
      },
      {
        namespace: ShopifyMeta.namespace,
        key: 'private_key_id',
        type: 'single_line_text_field',
        value: privateKey.id,
        ownerId: appId,
      },
      {
        namespace: ShopifyMeta.namespace,
        key: 'private_key_secret',
        type: 'single_line_text_field',
        value: privateKey.secret ?? '',
        ownerId: appId,
      },
    ]);

  async getInstall(): Promise<ShopifyData<ShopifyAppInstallRsp>> {
    const accessToken = await this.getToken();
    return fetch(`https://${this.shopDomain}/admin/api/2023-04/graphql.json`, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .accept(API.Consts.APPLICATION_JSON)
        .content(API.Consts.APPLICATION_JSON)
        .set(ShopifyAuth.tokenHeader, accessToken)
        .build(),
      body: JSON.stringify({
        query: `query {
          currentAppInstallation {
            id metafields(namespace: "${ShopifyMeta.namespace}", first: 3){
              nodes {
                key
              }
          }}}`,
      }),
    })
      .then((res) => res.json())
      .then((json) => json as ShopifyData<ShopifyAppInstallRsp>);
  }
}
