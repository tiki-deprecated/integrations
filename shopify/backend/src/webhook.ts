import { RouterHandler } from '@tsndr/cloudflare-worker-router'
import Env from './env';

export const orderCreate: RouterHandler<Env> = ({ res }) => {
    res.body = 'Hello World'
}

export const dataRequest: RouterHandler<Env> = ({ res }) => {
    res.body = 'Hello World'
}

export const customerRedact: RouterHandler<Env> = ({ res }) => {
    res.body = 'Hello World'
} 

export const shopRedact: RouterHandler<Env> = ({ res }) => {
    res.body = 'Hello World'
}