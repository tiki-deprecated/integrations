import { Router } from '@tsndr/cloudflare-worker-router'
import * as OAuth from './routes/oauth'
import * as Order from './routes/order'
import * as Customer from './routes/customer'
import * as Shop from './routes/shop'

const router = new Router<Env>()

router.get('/api/latest/oauth/authorize', OAuth.authorize)

router.get('/api/latest/oauth/token', OAuth.token)

router.post('/api/latest/order/paid', Order.paid)

router.post('/api/latest/customer/data-request', Customer.dataRequest)

router.post('/api/latest/customer/redact', Customer.redact)

router.post('/api/latest/shop/redact', Shop.redact)

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        return await router.handle(env, request, ctx)
    }
}
