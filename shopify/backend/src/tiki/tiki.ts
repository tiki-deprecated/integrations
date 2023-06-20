/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { TikiTokenExRsp } from './tiki-token-ex-rsp';
import { TikiTokenExReq } from './tiki-token-ex-req';
import { TikiAppCreateRsp } from './tiki-app-create-rsp';
import { TikiAppCreateReq } from './tiki-app-create-req';
import { TikiKeyCreateRsp } from './tiki-key-create-rsp';
import { TikiKeyCreateReq } from './tiki-key-create-req';
import { API } from '@mytiki/worker-utils-ts';

export type { TikiKeyCreateRsp, TikiAppCreateRsp };

export class Tiki {
  static readonly grantType = 'urn:ietf:params:oauth:grant-type:token-exchange';
  static readonly tokenType = 'urn:mytiki:params:oauth:token-type:shopify';
  static readonly scope = 'auth';
  baseUrl: string;

  constructor(env: Env) {
    this.baseUrl = env.AUTH_SERVICE_URL;
  }

  async login(shopDomain: string, shopifyToken: string): Promise<string> {
    const req: TikiTokenExReq = {
      grant_type: Tiki.grantType,
      client_id: shopDomain,
      subject_token: shopifyToken,
      subject_token_type: Tiki.tokenType,
      scope: Tiki.scope,
    };
    return fetch(`${this.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: new API.HeaderBuilder()
        .content(API.Consts.APPLICATION_FORM_URL)
        .build(),
      body: new URLSearchParams(req),
    })
      .then((res) => res.json())
      .then((json) => (json as TikiTokenExRsp).access_token);
  }

  async createApp(
    accessToken: string,
    shopDomain: string
  ): Promise<TikiAppCreateRsp> {
    const req: TikiAppCreateReq = {
      name: shopDomain,
    };
    return fetch(`${this.baseUrl}/app`, {
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
    return fetch(`${this.baseUrl}/app/${appId}/key`, {
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

  // get M2M token
  // get paybale from l0-index for cust.
}
