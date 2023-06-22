/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { TikiTokenRsp } from './tiki-token-rsp';
import { TikiTokenExReq } from './tiki-token-ex-req';
import { TikiAppCreateRsp } from './tiki-app-create-rsp';
import { TikiAppCreateReq } from './tiki-app-create-req';
import { TikiKeyCreateRsp } from './tiki-key-create-rsp';
import { TikiKeyCreateReq } from './tiki-key-create-req';
import { API } from '@mytiki/worker-utils-ts';
import { TikiTokenAdminReq } from './tiki-token-admin-req';
import { TikiLicenseRsp } from './tiki-license-rsp';
import { TikiLicenseReq } from './tiki-license-req';
import { TikiRegistryRsp } from './tiki-registry-rsp';

export type { TikiKeyCreateRsp, TikiAppCreateRsp };

export class Tiki {
  static readonly authUrl = 'https://auth.l0.mytiki.com/api/latest';
  static readonly indexUrl = 'https://index.l0.mytiki.com/api/latest';
  static readonly registryUrl = 'https://registry.l0.mytiki.com/api/latest';
  static readonly storageUrl = 'https://bucket.storage.l0.mytiki.com';

  static readonly grantType = 'urn:ietf:params:oauth:grant-type:token-exchange';
  static readonly tokenType = 'urn:mytiki:params:oauth:token-type:shopify';
  static readonly scope = 'auth';
  clientId: string;
  clientSecret: string;

  constructor(env: Env) {
    this.clientId = env.ADMIN_ID;
    this.clientSecret = env.ADMIN_SECRET;
  }

  async login(shopDomain: string, shopifyToken: string): Promise<string> {
    const req: TikiTokenExReq = {
      grant_type: Tiki.grantType,
      client_id: shopDomain,
      subject_token: shopifyToken,
      subject_token_type: Tiki.tokenType,
      scope: Tiki.scope,
    };
    return fetch(`${Tiki.authUrl}/oauth/token`, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .content(API.Consts.APPLICATION_FORM_URL)
        .build(),
      body: new URLSearchParams(req),
    })
      .then((res) => res.json())
      .then((json) => (json as TikiTokenRsp).access_token);
  }

  async createApp(
    accessToken: string,
    shopDomain: string
  ): Promise<TikiAppCreateRsp> {
    const req: TikiAppCreateReq = {
      name: shopDomain,
    };
    return fetch(`${Tiki.authUrl}/app`, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .accept(API.Consts.APPLICATION_JSON)
        .authorization(`Bearer ${accessToken}`)
        .content(API.Consts.APPLICATION_JSON)
        .build(),
      body: JSON.stringify(req),
    })
      .then((res) => res.json())
      .then((json) => json as TikiAppCreateRsp);
  }

  async createKey(
    accessToken: string,
    appId: string,
    isPublic: boolean
  ): Promise<TikiKeyCreateRsp> {
    const req: TikiKeyCreateReq = {
      isPublic,
    };
    return fetch(`${Tiki.authUrl}/app/${appId}/key`, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .accept(API.Consts.APPLICATION_JSON)
        .authorization(`Bearer ${accessToken}`)
        .content(API.Consts.APPLICATION_JSON)
        .build(),
      body: JSON.stringify(req),
    })
      .then((res) => res.json())
      .then((json) => json as TikiKeyCreateRsp);
  }

  async admin(): Promise<string> {
    const req: TikiTokenAdminReq = {
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: 'registry:internal:read index:internal:read',
    };
    return fetch(`${Tiki.authUrl}/oauth/token`, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .content(API.Consts.APPLICATION_FORM_URL)
        .build(),
      body: new URLSearchParams(req),
    })
      .then((res) => res.json())
      .then((json) => (json as TikiTokenRsp).access_token);
  }

  async license(
    accessToken: string,
    ptr: string,
    app: string
  ): Promise<TikiLicenseRsp> {
    const req: TikiLicenseReq = {
      ptrs: [ptr],
    };
    return fetch(`${Tiki.indexUrl}/license/${app}`, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .authorization(`Bearer ${accessToken}`)
        .content(API.Consts.APPLICATION_JSON)
        .build(),
      body: JSON.stringify(req),
    })
      .then((res) => res.json())
      .then((json) => json as TikiLicenseRsp);
  }

  async registry(accessToken: string, address: string, app: string) {
    return fetch(`${Tiki.registryUrl}/address/${address}?app-id=${app}`, {
      method: 'GET',
      headers: new API.HeaderBuilder()
        .authorization(`Bearer ${accessToken}`)
        .content(API.Consts.APPLICATION_JSON)
        .build(),
    })
      .then((res) => res.json())
      .then((json) => json as TikiRegistryRsp);
  }

  async pubkey(address: string, app: string): Promise<ArrayBuffer> {
    return fetch(`${Tiki.storageUrl}/${app}/${address}/public.key`, {
      method: 'GET',
      headers: new API.HeaderBuilder().build(),
    }).then((res) => res.arrayBuffer());
  }

  async verify(
    key: ArrayBuffer,
    signature: ArrayBuffer,
    data: ArrayBuffer
  ): Promise<boolean> {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'ECDSA', namedCurve: 'P-256', hash: 'SHA-256' },
      false,
      ['verify']
    );
    return await crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      cryptoKey,
      signature,
      data
    );
  }
}
