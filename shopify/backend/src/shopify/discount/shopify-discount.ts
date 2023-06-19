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
          key: 'id',
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
          key: 'discount_type',
          namespace: ShopifyMeta.namespace,
          type: 'single_line_text_field',
          value: discount.metafields.discountType,
        },
        {
          key: 'discount_value',
          namespace: ShopifyMeta.namespace,
          type: 'number_decimal',
          value: discount.metafields.discountValue.toString(),
        },
        {
          key: 'purchase_type',
          namespace: ShopifyMeta.namespace,
          type: 'single_line_text_field',
          value: discount.metafields.purchaseType,
        },
        {
          key: 'applies_to',
          namespace: ShopifyMeta.namespace,
          type: 'list.single_line_text_field',
          value: JSON.stringify(discount.metafields.appliesTo),
        },
        {
          key: 'min_value',
          namespace: ShopifyMeta.namespace,
          type: 'number_decimal',
          value: discount.metafields.minValue.toString(),
        },
        {
          key: 'min_qty',
          namespace: ShopifyMeta.namespace,
          type: 'number_integer',
          value: discount.metafields.minQty.toString(),
        },
        {
          key: 'max_use',
          namespace: ShopifyMeta.namespace,
          type: 'number_integer',
          value: discount.metafields.maxUse.toString(),
        },
        {
          key: 'once_per_user',
          namespace: ShopifyMeta.namespace,
          type: 'boolean',
          value: discount.metafields.onePerUser.toString(),
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
    const cur = await this.getCustomerMetafield(
      customer,
      ShopifyMeta.namespace,
      key
    );
    const allowedList: Array<string> = JSON.parse(
      cur.data.customer.metafield?.value ?? '[]'
    );
    allowedList.push(id);
    await this.setMetafields([
      {
        namespace: ShopifyMeta.namespace,
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
  //     ShopifyMeta.namespace,
  //     key
  //   );
  //   const appliedList: Array<string> = JSON.parse(
  //     cur.data.customer.metafield?.value ?? '[]'
  //   );
  //   await this.setMetafields([
  //     {
  //       namespace: ShopifyMeta.namespace,
  //       key,
  //       description: 'Tracks TIKI discounts used by this customer',
  //       type: 'list.single_line_text_field',
  //       value: JSON.stringify(appliedList.concat(id)),
  //       ownerId: `gid://shopify/Customer/${customer}`,
  //     },
  //   ]);
  // }
}
