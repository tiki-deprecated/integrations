/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { RouterHandler } from '@tsndr/cloudflare-worker-router';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const dataRequest: RouterHandler<Env> = async ({ res, req, env }) => {
  res.body = JSON.stringify([req.body, req.headers]);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const redact: RouterHandler<Env> = async ({ res, req, env }) => {
  res.body = JSON.stringify([req.body, req.headers]);
};
