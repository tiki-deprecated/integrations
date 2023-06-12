/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { RouterHandler } from '@tsndr/cloudflare-worker-router';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const paid: RouterHandler<Env> = async ({ res, req, env }) => {
  // TODO authenticate with TIKI
  const orderData = req.body;
  const url = 'https://postman-echo.com/post'; // TODO CHANGE TO TIKI URL

  const echo = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      // add TIKI Bearer token
      'content-type': 'application/json',
    },
    body: orderData,
  });
  console.log(await echo.text()); // REMOVE
};
