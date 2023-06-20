/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { IRequest } from 'itty-router';
import { Shopify } from '../../shopify/shopify';
import { CustomerDiscount } from './customer-discount';

export async function dataRequest(): Promise<Response> {
  return new Response(null, {
    status: 200,
  });
}

export async function redact(): Promise<Response> {
  return new Response(null, {
    status: 200,
  });
}

export async function discount(request: IRequest, env: Env): Promise<Response> {
  const body: CustomerDiscount = await request.json();
  const shopify = new Shopify(body.shop, env);
  await shopify.setDiscountAllowed(body.customerId, body.discountId);
  return new Response(null, {
    status: 201,
  });
}
