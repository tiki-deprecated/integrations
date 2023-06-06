import { RouterHandler } from '@tsndr/cloudflare-worker-router'
import Env from './env';
import { shopifyApp } from './shopify'
import { registerWebhooks } from './webhook';


export const auth: RouterHandler<Env> = async ({ req, env }) => {
    console.log('auth start')

    const shopify = shopifyApp(env)

    const { searchParams }: URL = new URL(req.url);
    const shop = shopify.utils.sanitizeShop(searchParams.get('shop')!, true)!

    console.log(shop)
    let result = await shopify.auth.begin({
        shop: shop,
        callbackPath: '/auth/callback',
        isOnline: true,
        rawRequest: req,
    });
    console.log('auth done')
    console.log(result)
}

export const authCallback: RouterHandler<Env> = async ({ req, res, env }) => {
    const shopify = shopifyApp(env)

    console.log(req)
    // https://{shop}.myshopify.com/admin/oauth/access_token?client_id=
    // {client_id}&client_secret={client_secret}&code={authorization_code}

    // const session = callbackResponse.session

    // await registerWebhooks(session, env)

    // await env.TIKI.put(session.shop, session.accessToken!)

    // callbackResponse.headers.forEach((value: string, key: string) => {
    //     res.headers.append(key, value)
    // })
    // const embededUrl = await shopify.auth.getEmbeddedAppUrl({
    //     rawRequest: req,
    //     rawResponse: res,
    // })
    // console.log(embededUrl)
    // res.status = 302
    // res.headers.set('location', embededUrl)
}

// export const auth2: RouterHandler<Env> = ({ req, res, env }) => {
//     const shopify = shopifyApp(env)
//     try {
//         const callbackResponse = await shopify.auth.callback({
//           rawRequest: req,
//           rawResponse: res,
//           isOnline: app.get("use-online-tokens"),
//         });
  
//         // save the session
//         if (
//           (await sqliteSessionStorage.storeSession(callbackResponse.session)) ==
//           false
//         ) {
//           console.log(`Failed to store session ${callbackResponse.session.id}`);
//         }
  
//         const responses = await shopify.webhooks.register({
//           session: callbackResponse.session,
//         });
  
//         Object.entries(responses).map(([topic, responsesForTopic]) => {
//           // The response from register will include the GDPR topics - these can be safely ignored.
//           // To register the GDPR topics, please set the appropriate webhook endpoint in the
//           // 'GDPR mandatory webhooks' section of 'App setup' in the Partners Dashboard.
  
//           // If there are no entries in the response array, there was no change in webhook
//           // registrations for that topic.
//           if (!gdprTopics.includes(topic) && responsesForTopic.length > 0) {
//             // Check the result of each response for errors
//             responsesForTopic.map((response) => {
//               if (!response.success) {
//                 if (response.result.errors) {
//                   console.log(
//                     `Failed to register ${topic} webhook: ${response.result.errors[0].message}`
//                   );
//                 } else {
//                   console.log(
//                     `Failed to register ${topic} webhook: ${JSON.stringify(
//                       response.result.data,
//                       undefined,
//                       2
//                     )}`
//                   );
//                 }
//               }
//             });
//           }
//         });
  
//         const [hasPayment, confirmationUrl] = await ensureBilling(
//           callbackResponse.session
//         );
  
//         if (!hasPayment) {
//           return res.redirect(confirmationUrl);
//         }
  
//         const host = shopify.utils.sanitizeHost(req.query.host);
//         const redirectUrl = shopify.config.isEmbeddedApp
//           ? 
//           : `/?shop=${callbackResponse.session.shop}&host=${encodeURIComponent(
//               host
//             )}`;
  
//         res.redirect(redirectUrl);
//       } catch (e) {
//         console.warn(e);
//         switch (true) {
//           case e instanceof InvalidOAuthError:
//             res.status(400);
//             res.send(e.message);
//             break;
//           case e instanceof CookieNotFound:
//             // This is likely because the OAuth session cookie expired before the merchant approved the request
//             return redirectToAuth(req, res, app);
//             break;
//           default:
//             res.status(500);
//             res.send(e.message);
//             break;
//         }
//       }
//     });
// }
