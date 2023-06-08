import { Router } from '@tsndr/cloudflare-worker-router'
import * as Auth from './auth'
import * as WebHook from './webhook'
import Env from './env'

const router = new Router<Env>()

router.get('/', Auth.auth)

router.get('/auth/callback', Auth.authCallback)

router.get('/webhook/order/paid', WebHook.orderPaid)

router.get('/webhook/customers/data_request', WebHook.dataRequest)

router.get('/webhook/customers/redact', WebHook.customerRedact)

router.get('/webhook/shop/redact', WebHook.shopRedact)

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        return await router.handle(env, request, ctx)
    }
}
