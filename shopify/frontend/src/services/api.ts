/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import ShopifyDiscountOptions from "./shopify-discount-options"

export const saveDiscount = async ( discountOptions: ShopifyDiscountOptions, shop:string ) => {
    const apiUrl = 'backend.ricardolgrj.workers.dev/api/latest'
    const url = `https://${apiUrl}/discount?shop=${shop}`;
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discountOptions)
    };
    const response = await fetch(url, requestOptions);
    return response.json();
}

export const getProducts = async ( search: string ) => {
    const apiUrl = 'backend.ricardolgrj.workers.dev/api/latest'
    const url = `https://${apiUrl}/products?s=${search}`;
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    const response = await fetch(url, requestOptions);
    return response.json();
}

export const geCollections = async ( search: string ) => {
    const apiUrl = 'backend.ricardolgrj.workers.dev/api/latest'
    const url = `https://${apiUrl}/collections?s=${search}`;
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    const response = await fetch(url, requestOptions);
    return response.json();
}