/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { Router } from '@tsndr/cloudflare-worker-router';
import * as OAuth from './routes/oauth';
import * as Order from './routes/order';
import * as Customer from './routes/customer';
import * as Shop from './routes/shop';
import * as Ui from './routes/ui';
import { ApiError, ApiConsts } from '@mytiki/worker-utils-ts';

const router = new Router<Env>();
router.cors({
  allowOrigin: '*',
  allowMethods: 'GET, PUT',
  allowHeaders: 'Content-Type, Accept',
}); // NOTE - this may not work once we need to pass an auth token. If so, use the TIKI cors stuff.

router.get(`/ui/order-discount/new`, Ui.discountOrder);
router.get(`/ui/product-discount/new`, Ui.discountProduct);

router.get(`${ApiConsts.API_LATEST}/oauth/authorize`, OAuth.authorize);
router.get(`${ApiConsts.API_LATEST}/oauth/token`, OAuth.token);
router.post(`${ApiConsts.API_LATEST}/order/paid`, Order.paid);
router.post(
  `${ApiConsts.API_LATEST}/customer/data-request`,
  Customer.dataRequest
);
router.post(`${ApiConsts.API_LATEST}/customer/redact`, Customer.redact);
router.post(`${ApiConsts.API_LATEST}/shop/redact`, Shop.redact);

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    try {
      return await router.handle(env, request, ctx);
    } catch (err) {
      let detail = 'Something went wrong';
      if (err instanceof Error) detail = err.message;
      return new ApiError.ApiError()
        .message('Uh Oh')
        .detail(detail)
        .response(500);
    }
  },
};
