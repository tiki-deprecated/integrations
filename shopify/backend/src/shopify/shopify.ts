/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { ShopifyTokenRsp } from './shopify-token-rsp';
import { ShopifyMetafield } from './shopify-metafield';
import { ShopifyAppInstallRsp } from './shopify-app-install-rsp';
import { TikiKeyCreateRsp } from '../tiki/tiki-key-create-rsp';
import { API, JWT } from '@mytiki/worker-utils-ts';
import { ShopifyWebhookReq } from './shopify-webhook-req';
import { ShopifyData } from './shopify-data';
import { ShopifyDiscount } from './shopify-discount';
import { DiscountReq } from '../api/discount/discount-req';
import { ShopifyJwt } from './shopify-jwt';
import { ShopifyCustomerRsp } from './shopify-customer-rsp';
import * as UUID from 'uuid';
import { DiscountReqMeta } from '../api/discount/discount-req-meta';

export type { ShopifyAppInstallRsp, ShopifyWebhookReq, ShopifyMetafield };

export class Shopify {
  static readonly tokenHeader = 'X-Shopify-Access-Token';
  static readonly scope =
    'read_orders,write_discounts,read_customers,write_customers';

  static readonly signHeader = 'X-Shopify-Hmac-SHA256';
  static readonly namespace = 'mytiki';
  private _accessToken: string | null = null;

  private readonly _keyId: string;
  private readonly _secretKey: string;
  private readonly _tokenStore: KVNamespace;
  private readonly _functionIdOrder: string;
  private readonly _functionIdProduct: string;
  readonly shopDomain: string;

  constructor(shopDomain: string, env: Env) {
    this.shopDomain = shopDomain;
    this._keyId = env.KEY_ID;
    this._secretKey = env.KEY_SECRET;
    this._tokenStore = env.KV_STORE;
    this._functionIdOrder = env.FUNCTION_ID_ORDER_DISCOUNT;
    this._functionIdProduct = env.FUNCTION_ID_PRODUCT_DISCOUNT;
  }

  authorize = (redirectUri: string): string =>
    `https://${this.shopDomain}/admin/oauth/authorize?` +
    `client_id=${this._keyId}&` +
    `scope=${Shopify.scope}&` +
    `redirect_uri=${redirectUri}`;

  async grant(code: string): Promise<void> {
    const url =
      `https://${this.shopDomain}/admin/oauth/access_token?` +
      `client_id=${this._keyId}&` +
      `client_secret=${this._secretKey}&` +
      `code=${code}&`;
    const token = await fetch(url, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .content(API.Consts.APPLICATION_JSON)
        .build(),
    })
      .then((res) => res.json())
      .then((json) => (json as ShopifyTokenRsp).access_token);
    await this._tokenStore.put(this.shopDomain, token);
  }

  async getToken(): Promise<string> {
    if (this._accessToken == null) {
      this._accessToken = await this._tokenStore.get(this.shopDomain);
    }
    if (this._accessToken == null) {
      throw new API.ErrorBuilder()
        .message('Invalid access token')
        .help('Try /api/latest/oauth/authorize')
        .error(403);
    }
    return this._accessToken;
  }

  registerOrderPaidWebhook = (baseUrl: string): Promise<void> =>
    this.registerWebhook({
      webhook: {
        address: `https://${baseUrl}/api/latest/order/paid`,
        topic: 'orders/paid',
        format: 'json',
      },
    });

  async getInstall(): Promise<ShopifyData<ShopifyAppInstallRsp>> {
    const accessToken = await this.getToken();
    return fetch(`https://${this.shopDomain}/admin/api/2023-04/graphql.json`, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .accept(API.Consts.APPLICATION_JSON)
        .content(API.Consts.APPLICATION_JSON)
        .set(Shopify.tokenHeader, accessToken)
        .build(),
      body: JSON.stringify({
        query: `query {
          currentAppInstallation {
            id metafields(namespace: "${Shopify.namespace}", first: 3){
              nodes {
                key
              }
          }}}`,
      }),
    })
      .then((res) => res.json())
      .then((json) => json as ShopifyData<ShopifyAppInstallRsp>);
  }

  saveKeys = async (
    appId: string,
    publicKey: TikiKeyCreateRsp,
    privateKey: TikiKeyCreateRsp
  ) =>
    this.setMetafields([
      {
        namespace: Shopify.namespace,
        key: 'public_key_id',
        type: 'single_line_text_field',
        value: publicKey.id,
        ownerId: appId,
      },
      {
        namespace: Shopify.namespace,
        key: 'private_key_id',
        type: 'single_line_text_field',
        value: privateKey.id,
        ownerId: appId,
      },
      {
        namespace: Shopify.namespace,
        key: 'private_key_secret',
        type: 'single_line_text_field',
        value: privateKey.secret ?? '',
        ownerId: appId,
      },
    ]);

  async verifyWebhook(request: Request): Promise<boolean> {
    const req = request.clone();
    const signature = req.headers.get(Shopify.signHeader) ?? '';
    const signatureBytes = Uint8Array.from(atob(signature), (c) =>
      c.charCodeAt(0)
    );
    const body = await req.text();
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

  verifySession = async (jwt: string): Promise<ShopifyJwt> =>
    Shopify.verifySession(jwt, this._keyId, this._secretKey);

  static async verifySession(
    jwt: string,
    id: string,
    secret: string
  ): Promise<ShopifyJwt> {
    const alg = {
      name: 'HMAC',
      hash: 'SHA-256',
    };
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      alg,
      false,
      ['verify']
    );
    const claims = await JWT.decode(jwt, key, {
      algorithm: alg,
      claims: ['dest', 'iss', 'aud', 'exp'],
      aud: [id],
      clockSkew: 60,
    });
    return {
      iss: claims.get('iss') as string,
      sub: claims.get('sub') as string,
      dest: claims.get('dest') as string,
      nbf: new Date((claims.get('nbf') as number) * 1000),
      exp: new Date((claims.get('exp') as number) * 1000),
      aud: claims.get('aud') as string,
    };
  }

  async saveDiscount(discount: DiscountReq): Promise<string> {
    const id = UUID.v4();
    const accessToken = await this.getToken();
    const req: ShopifyDiscount = {
      combinesWith: {
        orderDiscounts: discount.combinesWith.orderDiscounts,
        productDiscounts: discount.combinesWith.productDiscounts,
        shippingDiscounts: discount.combinesWith.shippingDiscounts,
      },
      endsAt: discount.endsAt,
      functionId:
        discount.metafields.type === 'order'
          ? this._functionIdOrder
          : this._functionIdProduct,
      metafields: this.discountToMetafield(id, discount.metafields),
      startsAt: discount.startsAt,
      title: discount.title,
    };
    return fetch(`https://${this.shopDomain}/admin/api/2023-04/graphql.json`, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .accept(API.Consts.APPLICATION_JSON)
        .content(API.Consts.APPLICATION_JSON)
        .set(Shopify.tokenHeader, accessToken)
        .build(),
      body: JSON.stringify({
        query: `mutation DiscountAutomaticAppCreate{
          discountAutomaticAppCreate(automaticAppDiscount: ${JSON.stringify(
            req
          )}){
            userErrors {
              field
              message
            }
          }}`,
      }),
    }).then(async (res) => {
      if (res.status !== 200) {
        const body = await res.text();
        throw new API.ErrorBuilder()
          .message(res.statusText)
          .detail(body)
          .error(res.status);
      } else {
        return id;
      }
    });
  }

  setDiscountActive = async (
    appId: string,
    discountId: string
  ): Promise<void> =>
    this.setMetafields([
      {
        namespace: Shopify.namespace,
        key: 'discount_active',
        type: 'single_line_text_field',
        value: discountId,
        ownerId: appId,
      },
    ]);

  async setDiscountAllowed(customer: number, id: string): Promise<void> {
    const key = 'discount_allowed';
    const cur = await this.getCustomerMetafield(
      customer,
      Shopify.namespace,
      key
    );
    const allowedList: Array<string> = JSON.parse(
      cur.data.customer.metafield?.value ?? '[]'
    );
    allowedList.push(id);
    await this.setMetafields([
      {
        namespace: Shopify.namespace,
        key,
        description: 'Tracks TIKI discounts allowed for this customer',
        type: 'list.single_line_text_field',
        value: JSON.stringify(allowedList),
        ownerId: `gid://shopify/Customer/${customer}`,
      },
    ]);
  }

  // async discountUsed(customer: number, id: Array<string>): Promise<void> {
  //   const key = 'discount_applied';
  //   const cur = await this.getCustomerMetafield(
  //     customer,
  //     Shopify.namespace,
  //     key
  //   );
  //   const appliedList: Array<string> = JSON.parse(
  //     cur.data.customer.metafield?.value ?? '[]'
  //   );
  //   await this.setMetafields([
  //     {
  //       namespace: Shopify.namespace,
  //       key,
  //       description: 'Tracks TIKI discounts used by this customer',
  //       type: 'list.single_line_text_field',
  //       value: JSON.stringify(appliedList.concat(id)),
  //       ownerId: `gid://shopify/Customer/${customer}`,
  //     },
  //   ]);
  // }

  private async verify(
    signature: ArrayBuffer,
    data: ArrayBuffer
  ): Promise<boolean> {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(this._secretKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    return await crypto.subtle.verify('HMAC', cryptoKey, signature, data);
  }

  private async setMetafields(fields: Array<ShopifyMetafield>): Promise<void> {
    const accessToken = await this.getToken();
    await fetch(`https://${this.shopDomain}/admin/api/2023-04/graphql.json`, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .accept(API.Consts.APPLICATION_JSON)
        .content(API.Consts.APPLICATION_JSON)
        .set(Shopify.tokenHeader, accessToken)
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

  private async getCustomerMetafield(
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
        .set(Shopify.tokenHeader, accessToken)
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

  private discountToMetafield = (id: string, req: DiscountReqMeta) => [
    {
      key: 'type',
      namespace: Shopify.namespace,
      type: 'single_line_text_field',
      value: req.type,
    },
    {
      key: 'id',
      namespace: Shopify.namespace,
      type: 'single_line_text_field',
      value: id,
    },
    {
      key: 'description',
      namespace: Shopify.namespace,
      type: 'single_line_text_field',
      value: req.description,
    },
    {
      key: 'discount_type',
      namespace: Shopify.namespace,
      type: 'single_line_text_field',
      value: req.discountType,
    },
    {
      key: 'discount_value',
      namespace: Shopify.namespace,
      type: 'number_decimal',
      value: req.discountValue.toString(),
    },
    {
      key: 'purchase_type',
      namespace: Shopify.namespace,
      type: 'single_line_text_field',
      value: req.purchaseType,
    },
    {
      key: 'applies_to',
      namespace: Shopify.namespace,
      type: 'list.single_line_text_field',
      value: JSON.stringify(req.appliesTo),
    },
    {
      key: 'min_value',
      namespace: Shopify.namespace,
      type: 'number_decimal',
      value: req.minValue.toString(),
    },
    {
      key: 'min_qty',
      namespace: Shopify.namespace,
      type: 'number_integer',
      value: req.minQty.toString(),
    },
    {
      key: 'max_use',
      namespace: Shopify.namespace,
      type: 'number_integer',
      value: req.maxUse.toString(),
    },
    {
      key: 'once_per_user',
      namespace: Shopify.namespace,
      type: 'boolean',
      value: req.onePerUser.toString(),
    },
    {
      key: 'products',
      namespace: Shopify.namespace,
      type: 'list.single_line_text_field',
      value: JSON.stringify(req.products),
    },
    {
      key: 'collections',
      namespace: Shopify.namespace,
      type: 'list.single_line_text_field',
      value: JSON.stringify(req.collections),
    },
  ];

  private async registerWebhook(webhook: ShopifyWebhookReq): Promise<void> {
    const accessToken = await this.getToken();
    await fetch(`https://${this.shopDomain}/admin/api/2023-04/webhooks.json`, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .accept(API.Consts.APPLICATION_JSON)
        .content(API.Consts.APPLICATION_JSON)
        .set(Shopify.tokenHeader, accessToken)
        .build(),
      body: JSON.stringify(webhook),
    });
  }
}
