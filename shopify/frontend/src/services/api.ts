/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import ShopifyDiscountOptions from "./shopify-discount-options"

export const saveDiscount = async ( discountOptions: ShopifyDiscountOptions, shop:string ) => {
    const apiUrl = 'backend.ricardolgrj.workers.dev/api/latest'
    const url = `https://${apiUrl}/admin/oauth/access_token?shop=${shop}`;
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discountOptions)
    };
    const response = await fetch(url, requestOptions);
    return response.json();
}