/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import * as Verify from './__fixtures__/verify';
import { Shopify } from '../shopify/shopify';

describe('Shopify Verification Tests', function () {
  test('Verify Webhook', async () => {
    const shopify = new Shopify('dummmy', 'dummy', Verify.secret);
    const signature = await Verify.signedHeader();
    const request = new Request('https://shopify-test.mytiki.com', {
      method: 'POST',
      body: Verify.webhook,
      headers: new Headers({
        'X-Shopify-Hmac-SHA256': signature,
      }),
    });
    const success = await shopify.verifyWebhook(request);
    expect(success);
  });

  test('Verify OAuth', async () => {
    const shopify = new Shopify('dummmy', 'dummy', Verify.secret);
    const signedQuery = await Verify.signedQuery();
    const request = new Request(
      `https://shopify-test.mytiki.com/?${signedQuery}`
    );
    const success = await shopify.verifyOAuth(request);
    expect(success);
  });
});
