import { RouterHandler } from '@tsndr/cloudflare-worker-router';

export const dataRequest: RouterHandler<Env> = async ({ res, req, env }) => {
  res.body = JSON.stringify([req.body, req.headers]);
};

export const redact: RouterHandler<Env> = async ({ res, req, env }) => {
  res.body = JSON.stringify([req.body, req.headers]);
};
