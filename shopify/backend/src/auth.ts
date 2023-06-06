import { RouterHandler } from '@tsndr/cloudflare-worker-router'
import Env from './env';

export const auth: RouterHandler<Env> = ({ res }) => {
    res.body = 'Hello World'
}

export const authCallback: RouterHandler<Env> = ({ res }) => {
    res.body = 'Hello World'
}