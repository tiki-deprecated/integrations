/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import * as OAuth from './routes/oauth';
import * as Order from './routes/order';
import * as Customer from './routes/customer';
import * as Shop from './routes/shop';
import * as Discount from './routes/discount';
import { ApiError, ApiConsts } from '@mytiki/worker-utils-ts';
import { Router, error, createCors } from 'itty-router';

const { preflight, corsify } = createCors({
  methods: ['GET', 'POST'],
  origins: ['*'],
  // headers: {
  //   'Access-Control-Allow-Credentials': true,
  // },
});
const router = Router();
router
  .all('*', preflight)
  .get(`${ApiConsts.API_LATEST}/oauth/authorize`, OAuth.authorize)
  .get(`${ApiConsts.API_LATEST}/oauth/token`, OAuth.token)
  .post(`${ApiConsts.API_LATEST}/order/paid`, Order.paid)
  .post(`${ApiConsts.API_LATEST}/customer/data-request`, Customer.dataRequest)
  .post(`${ApiConsts.API_LATEST}/customer/redact`, Customer.redact)
  .post(`${ApiConsts.API_LATEST}/shop/redact`, Shop.redact)
  .post(`${ApiConsts.API_LATEST}/discount/order`, Discount.order)
  .post(`${ApiConsts.API_LATEST}/discount/product`, Discount.product)
  .all('*', () => error(404, new ApiError.ApiError().message('Not Found')));

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return await router
      .handle(request, env, ctx)
      .catch((err) => {
        let detail = 'Something went wrong';
        if (err instanceof Error) detail = err.message;
        return error(
          500,
          new ApiError.ApiError().message('Uh Oh').detail(detail)
        );
      })
      .then(corsify);
  },
};
