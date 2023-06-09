import { TikiCreateAppResp, TikiLoginReq, TikiLoginResp, TikiCreateKeysResp } from './interface';

export const loginWithTiki = async (shop: string, shopify_token: string): Promise<String> => {
  const loginReq: TikiLoginReq = {
    grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
    client_id: shop,
    subject_token: shopify_token,
    subject_token_type: 'urn:mytiki:params:oauth:token-type:shopify',
    scope: 'auth',
  };
  const url = 'https://auth.l0.mytiki.com/api/latest/oauth/token';
  const formBody = Object.entries(loginReq)
    .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
    .join('&');
  const tikiLoginResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: formBody,
  });
  const { access_token }: TikiLoginResp = await tikiLoginResponse.json();
  return access_token;
};

export const createApp = async (tikiAccessToken: String, shop: String): Promise<String> => {
  const createAppUrl = 'https://auth.l0.mytiki.com/api/latest/app';
  const createAppJsonReq = JSON.stringify({
    name: shop,
  });
  const createAppResponse: Response = await fetch(createAppUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${tikiAccessToken}`,
      'content-type': 'application/json',
    },
    body: createAppJsonReq,
  });
  const { appId }: TikiCreateAppResp = await createAppResponse.json();
  return appId;
};

export const createAppPrivateKey = async (tikiAccessToken: String, appId: String): Promise<String> => {
  const createKeysUrl = `https://auth.l0.mytiki.com/api/latest/app/${appId}/key`;
  const createKeysResponse = await fetch(createKeysUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${tikiAccessToken}`,
      'content-type': 'application/json',
    },
  });
  const { secret }: TikiCreateKeysResp = await createKeysResponse.json();
  return secret;
};

export const createAppPublicKey = async (tikiAccessToken: String, appId: String): Promise<String> => {
  const createKeysUrl = `https://auth.l0.mytiki.com/api/latest/app/${appId}/key`;
  const createKeysResponse = await fetch(createKeysUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${tikiAccessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      public: true,
    }),
  });
  const { id }: TikiCreateKeysResp = await createKeysResponse.json();
  return id;
};
