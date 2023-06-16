/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { IRequest, StatusError } from 'itty-router';
import { DiscountReq } from './discount-req';
import { ApiError } from '@mytiki/worker-utils-ts';
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
  throwIfNull(req.title, 'title');
  throwIfNull(req.type, 'discountType');
  throwIfNull(req.description, 'description');
  throwIfNull(req.startsAt, 'startsAt');

  throwIfNull(req.metafields, 'metafields');
  throwIfNull(req.metafields.discountType, 'metafields.discountType');
  throwIfNull(req.metafields.appliesTo, 'metafields.appliesTo');
  throwIfNull(req.metafields.maxUse, 'metafields.maxUse');
  throwIfNull(req.metafields.minQty, 'metafields.minQtq');
  throwIfNull(req.metafields.minValue, 'metafields.minValue');
  throwIfNull(req.metafields.discountValue, 'metafields.discountValue');
  throwIfNull(req.metafields.onePerUser, 'metafields.onePerUser');
  throwIfNull(req.metafields.purchaseType, 'metafields.purchaseType');

  throwIfNull(req.combinesWith, 'combinesWith');
  throwIfNull(req.combinesWith.orderDiscounts, 'combinesWith.orderDiscounts');
  throwIfNull(
    req.combinesWith.productDiscounts,
    'combinesWith.productDiscounts'
  );
  throwIfNull(
    req.combinesWith.shippingDiscounts,
    'combinesWith.shippingDiscounts'
  );
}

// TODO move into ts helpers
function throwIfNull(param: unknown, name?: string): void {
  if (param == null) {
    const properties: Map<string, string> = new Map();
    properties.set(name ?? 'param', String(param));
    throw new StatusError(
      400,
      new ApiError.ApiError()
        .message('Missing required parameter')
        .properties(properties)
    );
  }
}
