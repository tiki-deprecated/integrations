class TikiEmbed {
    static start = async () => {
        debugger
        TikiSdk.config()
            .theme
            .primaryTextColor('#1C0000')
            .secondaryTextColor('#1C000099')
            .primaryBackgroundColor('#FFFFFF')
            .secondaryBackgroundColor('#F6F6F6')
            .accentColor('#00b272')
            .fontFamily('"Space Grotesk", sans-serif')
            .and()
            .offer
            .description('Trade your IDFA (kind of like a serial # for your phone) for a discount.')
            .reward('https://cdn.mytiki.com/assets/demo-reward.png')
            .bullet({ text: 'Learn how our ads perform', isUsed: true })
            .bullet({ text: 'Reach you on other platforms', isUsed: false })
            .bullet({ text: 'Sold to other companies', isUsed: false })
            .terms('terms.md')
            .ptr('db2fd320-aed0-498e-af19-0be1d9630c63')
            .tag(TikiSdk.TitleTag.deviceId())
            .use({ usecases: [TikiSdk.LicenseUsecase.attribution()] })
            .add()
        let customer_id = ShopifyAnalytics.meta.page.customerId
        let offer = TikiSdk.config()._offers[0];
        if (customer_id) {
            await TikiSdk.config().initialize('13d435e2-29a9-4263-a853-e2bb0e698e31', customer_id);
            let tikiDecisionCookie = document.cookie.match(RegExp('(?:^|;\\s*)tiki_decision=([^;]*)'));
            if (tikiDecisionCookie) {
                let decision = TikiCookiePrivacy.userAllowedAll
                let uses = true === decision ? offer._uses : []
                await license(
                    offer._ptr,
                    uses,
                    offer._terms,
                    offer._tags,
                    offer._description,
                    offer._expiry
                );       
            } else {
                TikiSdk.config().onAccept(() => TikiCookiePrivacy.handleAccept() )
                TikiSdk.config().onDecline(() => TikiCookiePrivacy.handleDecline() )
                TikiSdk.present()
            }
        }else{
            TikiSdkAnon.present()
        }
    }
}
TikiEmbed.start()