/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { IRequest } from 'itty-router';
import { DiscountReq } from './discount-req';
import { Throw } from '@mytiki/worker-utils-ts';
import { Shopify } from '../../shopify/shopify';

export async function create(request: IRequest, env: Env): Promise<Response> {
  // validate session token
  const body: DiscountReq = await request.json();
  guard(body);

  const shop = 'tiki-dev-store.myshopify.com';
  const shopify = new Shopify(shop, env);
  await shopify.saveDiscount(body);

  return new Response(null, {
    status: 200,
  });
}

function guard(req: DiscountReq): void {
  Throw.ifNull(req.title, 'title');
  Throw.ifNull(req.type, 'discountType');
  Throw.ifNull(req.description, 'description');
  Throw.ifNull(req.startsAt, 'startsAt');

  Throw.ifNull(req.metafields, 'metafields');
  Throw.ifNull(req.metafields.discountType, 'metafields.discountType');
  Throw.ifNull(req.metafields.appliesTo, 'metafields.appliesTo');
  Throw.ifNull(req.metafields.maxUse, 'metafields.maxUse');
  Throw.ifNull(req.metafields.minQty, 'metafields.minQtq');
  Throw.ifNull(req.metafields.minValue, 'metafields.minValue');
  Throw.ifNull(req.metafields.discountValue, 'metafields.discountValue');
  Throw.ifNull(req.metafields.onePerUser, 'metafields.onePerUser');
  Throw.ifNull(req.metafields.purchaseType, 'metafields.purchaseType');

  Throw.ifNull(req.combinesWith, 'combinesWith');
  Throw.ifNull(req.combinesWith.orderDiscounts, 'combinesWith.orderDiscounts');
  Throw.ifNull(
    req.combinesWith.productDiscounts,
    'combinesWith.productDiscounts'
  );
  Throw.ifNull(
    req.combinesWith.shippingDiscounts,
    'combinesWith.shippingDiscounts'
  );
}
