/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { DiscountReq } from '../../api/discount/discount-req';
import { ShopifyMeta } from '../meta/shopify-meta';
import { API } from '@mytiki/worker-utils-ts';
import * as UUID from 'uuid';
import { ShopifyAuth } from '../auth/shopify-auth';
import { ShopifyDiscountCreate } from './shopify-discount-create';
import { ShopifyData } from '../meta/shopify-data';
import { ShopifyDiscountRsp } from './shopify-discount-rsp';
import { query, mutation } from 'gql-query-builder';

export type { ShopifyDiscountRsp };

export class ShopifyDiscount extends ShopifyMeta {
  private readonly _functionIdOrder: string;
  private readonly _functionIdProduct: string;

  constructor(shopDomain: string, env: Env) {
    super(shopDomain, env);
    this._functionIdOrder = env.FUNCTION_ID_ORDER_DISCOUNT;
    this._functionIdProduct = env.FUNCTION_ID_PRODUCT_DISCOUNT;
  }

  async createDiscount(discount: DiscountReq, appId: string): Promise<string> {
    const id = UUID.v4();
    const accessToken = await this.getToken();
    const req: ShopifyDiscountCreate = {
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
      metafields: [
        {
          key: 'type',
          namespace: ShopifyMeta.namespace,
          type: 'single_line_text_field',
          value: discount.metafields.type,
        },
        {
          key: 'tid',
          namespace: ShopifyMeta.namespace,
          type: 'single_line_text_field',
          value: id,
        },
        {
          key: 'description',
          namespace: ShopifyMeta.namespace,
          type: 'single_line_text_field',
          value: discount.metafields.description,
        },
        {
          key: 'discount_amount',
          namespace: ShopifyMeta.namespace,
          type: 'single_line_text_field',
          value: JSON.stringify(discount.metafields.discountAmount),
        },
        {
          key: 'discount_restrictions',
          namespace: ShopifyMeta.namespace,
          type: 'number_decimal',
          value: JSON.stringify(discount.metafields.discountRestrictions),
        },
        {
          key: 'products',
          namespace: ShopifyMeta.namespace,
          type: 'list.single_line_text_field',
          value: JSON.stringify(discount.metafields.products),
        },
        {
          key: 'collections',
          namespace: ShopifyMeta.namespace,
          type: 'list.single_line_text_field',
          value: JSON.stringify(discount.metafields.collections),
        },
      ],
      startsAt: discount.startsAt,
      title: discount.title,
    };
    const res = await fetch(
      `https://${this.shopDomain}/admin/api/2023-04/graphql.json`,
      {
        method: 'POST',
        headers: new API.HeaderBuilder()
          .accept(API.Consts.APPLICATION_JSON)
          .content(API.Consts.APPLICATION_JSON)
          .set(ShopifyAuth.tokenHeader, accessToken)
          .build(),
        body: JSON.stringify(
          mutation(
            {
              operation: 'discountAutomaticAppCreate',
              variables: {
                automaticAppDiscount: {
                  value: req,
                  type: 'DiscountAutomaticAppInput',
                  required: true,
                },
              },
              fields: [
                {
                  userErrors: ['message', 'field'],
                },
              ],
            },
            undefined,
            {
              operationName: 'DiscountAutomaticAppCreate',
            }
          )
        ),
      }
    );
    if (res.status !== 200) {
      const body = await res.text();
      throw new API.ErrorBuilder()
        .message(res.statusText)
        .detail(body)
        .error(res.status);
    } else {
      await this.setMetafields([
        {
          namespace: ShopifyMeta.namespace,
          key: 'discount_active',
          type: 'single_line_text_field',
          value: id,
          ownerId: appId,
        },
      ]);
      return id;
    }
  }

  async setDiscountAllowed(customer: number, id: string): Promise<void> {
    const key = 'discount_allowed';
    const cur = await this.getCustomerMetafield(customer, key);
    const allowedList: Array<string> = JSON.parse(
      cur.data.customer.metafield?.value ?? '[]'
    );
    allowedList.push(id);
    await this.setMetafields([
      {
        namespace: ShopifyMeta.namespace,
        key,
        type: 'list.single_line_text_field',
        value: JSON.stringify(allowedList),
        ownerId: `gid://shopify/Customer/${customer}`,
      },
    ]);
  }

  async getDiscountIds(
    titles: Array<string>
  ): Promise<ShopifyData<ShopifyDiscountRsp>> {
    const filter = `title:${titles.map((title) => `"${title}"`).join(' OR ')}`;
    const accessToken = await this.getToken();
    return fetch(`https://${this.shopDomain}/admin/api/2023-04/graphql.json`, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .accept(API.Consts.APPLICATION_JSON)
        .content(API.Consts.APPLICATION_JSON)
        .set(ShopifyAuth.tokenHeader, accessToken)
        .build(),
      body: JSON.stringify(
        query(
          {
            operation: 'discountNodes',
            variables: {
              query: {
                value: filter,
                type: 'String',
              },
              reverse: {
                value: true,
                type: 'Boolean',
              },
              sortKey: {
                value: 'CREATED_AT',
                type: 'DiscountSortKeys',
              },
              first: {
                value: titles.length * 2,
                type: 'Int',
              },
            },
            fields: [
              {
                nodes: [
                  {
                    operation: 'metafield',
                    variables: {
                      key: { value: 'tid', type: 'String', required: true },
                      namespace: {
                        value: ShopifyMeta.namespace,
                        type: 'String',
                      },
                    },
                    fields: ['key', 'value'],
                  },
                ],
              },
            ],
          },
          undefined,
          {
            operationName: 'DiscountNodes',
          }
        )
      ),
    })
      .then((res) => res.json())
      .then((json) => json as ShopifyData<ShopifyDiscountRsp>);
  }

  async getDiscountById(id: string): Promise<Response> {
    const accessToken = await this.getToken();
    const discountId = `gid://shopify/DiscountNode/${id}`;
    const gql = query({
      operation: 'discountNode',
      variables: {
        id: {
          value: discountId,
          type: 'ID!',
        },
      },
      fields: [
        'id',
        {
          metafield: {
            operation: 'metafield',
            variables: {
              key: { value: 'tid', type: 'String', required: true },
              namespace: {
                value: ShopifyMeta.namespace,
                type: 'String',
              },
            },
            fields: ['key', 'value'],
          },
        },
        {
          discount: {
            operation: 'discount',
            fields: {
              operation: 'DiscountAutomaticApp',
              fields: [
                'title',
                'discountClass',
                {
                  operation: 'combinesWith',
                  fields: [
                    'orderDiscounts',
                    'productDiscounts',
                    'shippingDiscounts',
                  ],
                },
                'startsAt',
                'endsAt',
              ],
              fragment: true,
            },
          },
        },
      ],
    });
    console.log(query);
    const response = await fetch(
      `https://${this.shopDomain}/admin/api/2023-04/graphql.json`,
      {
        method: 'POST',
        headers: new API.HeaderBuilder()
          .accept(API.Consts.APPLICATION_JSON)
          .content(API.Consts.APPLICATION_JSON)
          .set(ShopifyAuth.tokenHeader, accessToken)
          .build(),
        body: JSON.stringify(gql),
      }
    );
    return await response.json();
  }

  async discountUsed(customer: number, id: Array<string>): Promise<void> {
    const key = 'discount_applied';
    const cur = await this.getCustomerMetafield(customer, key);
    const appliedList: Array<string> = JSON.parse(
      cur.data.customer.metafield?.value ?? '[]'
    );
    await this.setMetafields([
      {
        namespace: ShopifyMeta.namespace,
        key,
        type: 'list.single_line_text_field',
        value: JSON.stringify(appliedList.concat(id)),
        ownerId: `gid://shopify/Customer/${customer}`,
      },
    ]);
  }
}
