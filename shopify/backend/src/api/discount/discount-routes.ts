/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { IRequest } from 'itty-router';
import { DiscountReq } from './discount-req';

export async function create(request: IRequest, env: Env): Promise<Response> {
  const body: DiscountReq = await request.json();

  return new Response(null, {
    status: 200,
  });
}
