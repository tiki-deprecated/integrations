/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { RouterHandler } from '@tsndr/cloudflare-worker-router';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const discountOrder: RouterHandler<Env> = async ({ res }) => {
  res.status = 302;
  res.headers.set('location', 'https://some-chefs-admire.loca.lt');
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const discountProduct: RouterHandler<Env> = async ({ res }) => {
  res.status = 302;
  res.headers.set('location', 'https://some-chefs-admire.loca.lt');
};
