/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { IRequest, json } from 'itty-router';
import { DiscountReq } from './discount-req';
import { Throw, API } from '@mytiki/worker-utils-ts';
import { Shopify } from '../../shopify/shopify';
import { DiscountRsp } from './discount-rsp';

export async function create(request: IRequest, env: Env): Promise<Response> {
  const token = request.headers.get(API.Consts.AUTHORIZATION);
  if (token == null) {
    throw new API.ErrorBuilder()
      .help('Check your Authorization header')
      .error(403);
  }

  const claims = await Shopify.verifySession(
    token.replace('Bearer ', ''),
    env.KEY_ID,
    env.KEY_SECRET
  );

  const body: DiscountReq = await request.json();
  guard(body);
  Throw.ifNull(claims.dest);

  const shopify = new Shopify(claims.dest as string, env);
  const rsp: DiscountRsp = {
    id: await shopify.saveDiscount(body),
  };
  const install = await shopify.getInstall();
  await shopify.setDiscountActive(
    install.data.currentAppInstallation.id,
    rsp.id
  );

  return json(rsp);
}

function guard(req: DiscountReq): void {
  Throw.ifNull(req.title, 'title');
  Throw.ifNull(req.startsAt, 'startsAt');

  Throw.ifNull(req.metafields, 'metafields');
  Throw.ifNull(req.metafields.type, 'metafields.type');
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
