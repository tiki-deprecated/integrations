/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { IRequest } from 'itty-router';
import { DiscountReq } from './discount-req';

export async function create(request: IRequest, env: Env): Promise<Response> {
  const body: DiscountReq = await request.json();

  // validate session token

  // save discount

  return new Response(null, {
    status: 200,
  });
}

/**
 * from RG on 6/14
 *
 * async saveDiscount(
 *         base64Opt: string,
 *         shopifyAccessToken: string,
 *         env: Env
 *     ): Promise<Response> {
 *         let functionId, metaFieldkey;
 *         const options = JSON.parse(decodeBase64(base64Opt));
 *         const discountType = options.get('discountType');
 *         const title = options.get('title');
 *         const description = options.get('description');
 *         const startsAt = options.get('startsAt');
 *         const combinesWith = options.get('combinesWith');
 *         const metaFields: ShopifyDiscountMetafields = options.get('metaFields');
 *         const endsAt = options.get('endsAt');
 *         const id = options.get('id');
 *         // TODO ADD ERROR CONTROL FOR MISSING PROPERTIES
 *         switch (discountType) {
 *             case 'order':
 *                 functionId = env.SHOPIFY_ORDER_DISCOUNT_FUNCTION_ID;
 *                 metaFieldkey = 'orderDiscountOptions';
 *                 break;
 *             case 'product':
 *                 functionId = env.SHOPIFY_PRODUCT_DISCOUNT_FUNCTION_ID;
 *                 metaFieldkey = 'productDiscountOptions';
 *                 break;
 *             default:
 *                 return new Response(`Invalid discount type: ${discountType}`, {
 *                     status: 400,
 *                 });
 *         }
 *         const vars: ShopifyDiscountCreateReq = {
 *             automaticAppDiscount: {
 *                 combinesWith,
 *                 endsAt,
 *                 functionId,
 *                 metafields: [
 *                     {
 *                         description,
 *                         key: metaFieldkey,
 *                         namespace: 'tiki_options',
 *                         type: 'json',
 *                         value: JSON.stringify(metaFields),
 *                     },
 *                 ],
 *                 startsAt,
 *                 title,
 *             },
 *         };
 *         if (id) {
 *             (vars as ShopifyDiscountUpdateReq).id = id;
 *         }
 *         const query =
 *             '{"query": ' +
 *             'mutation discountAutomaticAppCreate($automaticAppDiscount: DiscountAutomaticAppInput!) { ' +
 *             'discountAutomaticAppCreate(automaticAppDiscount: $automaticAppDiscount) { ' +
 *             '  automaticAppDiscount { ' +
 *             JSON.stringify(vars) +
 *             '  } ' +
 *             '  userErrors { ' +
 *             '    field ' +
 *             '    message ' +
 *             '  } ' +
 *             '}' +
 *             '}';
 *         const functionResponse: Response = await fetch(
 *             `https://${this.shopDomain}/admin/api/2023-04/graphql.json`,
 *             {
 *                 method: 'POST',
 *                 headers: new ApiHeaders.HeaderBuilder()
 *                     .accept(ApiHeaders.APPLICATION_JSON)
 *                     .content(ApiHeaders.APPLICATION_JSON)
 *                     .set(Shopify.tokenHeader, shopifyAccessToken)
 *                     .build(),
 *                 body: query,
 *             }
 *         );
 *         const functionResult: ShopifyAutomaticAppDiscountRsp =
 *             await functionResponse.json();
 *         return new Response(JSON.stringify(functionResult), { status: 200 });
 *     }
 */
