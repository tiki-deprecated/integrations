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
import {
  APPLICATION_FORM_URL,
  APPLICATION_JSON,
  HeaderBuilder,
} from '@mytiki/worker-utils-ts/api/api-headers';

export type { TikiKeyCreateRsp, TikiAppCreateRsp };

export class Tiki {
  static readonly grantType = 'urn:ietf:params:oauth:grant-type:token-exchange';
  static readonly tokenType = 'urn:mytiki:params:oauth:token-type:shopify';
  static readonly scope = 'auth';
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
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
      headers: new HeaderBuilder().content(APPLICATION_FORM_URL).build(),
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
      headers: new HeaderBuilder()
        .accept(APPLICATION_JSON)
        .authorization(`Bearer ${accessToken}`)
        .content(APPLICATION_JSON)
        .build(),
      body: JSON.stringify(req),
    })
      .then((res) => res.json())
      .then((json) => json as TikiAppCreateRsp);
  }

  async createPrivateKey(
    accessToken: string,
    appId: string
  ): Promise<TikiKeyCreateRsp> {
    const req: TikiKeyCreateReq = {
      isPublic: false,
    };
    return fetch(`${this.baseUrl}/app/${appId}/key`, {
      method: 'POST',
      headers: new HeaderBuilder()
        .accept(APPLICATION_JSON)
        .authorization(`Bearer ${accessToken}`)
        .content(APPLICATION_JSON)
        .build(),
      body: JSON.stringify(req),
    })
      .then((res) => res.json())
      .then((json) => json as TikiKeyCreateRsp);
  }

  async createPublicKey(
    accessToken: string,
    appId: string
  ): Promise<TikiKeyCreateRsp> {
    const req: TikiKeyCreateReq = {
      isPublic: true,
    };
    return fetch(`${this.baseUrl}/app/${appId}/key`, {
      method: 'POST',
      headers: new HeaderBuilder()
        .accept(APPLICATION_JSON)
        .authorization(`Bearer ${accessToken}`)
        .content(APPLICATION_JSON)
        .build(),
      body: JSON.stringify(req),
    })
      .then((res) => res.json())
      .then((json) => json as TikiKeyCreateRsp);
  }
}
