window.Shopify.loadFeatures([
    {
        name: 'consent-tracking-api',
        version: '0.1',
    }
],
    function (error) {
        if (error) {
            console.log(error);
        }
    }
);

class TikiCookiePrivacy {
    static handleAccept = (e) =>
        window.Shopify.customerPrivacy.setTrackingConsent(true);

    static handleDecline = () =>
        window.Shopify.customerPrivacy.setTrackingConsent(false);

    static get userAllowedAll() {
        return window.Shopify.customerPrivacy.userDataCanBeSold() &&
            window.Shopify.customerPrivacy.analyticsProcessingAllowed() &&
            window.Shopify.customerPrivacy.preferencesProcessingAllowed() &&
            window.Shopify.customerPrivacy.firstPartyMarketingAllowed() &&
            window.Shopify.customerPrivacy.thirdPartyMarketingAllowed();
    }
}

class TikiEmbed {
    static start = async (settings) => {
        let customer_id = ShopifyAnalytics.meta.page.customerId
        debugger
        TikiSdk.config()
            .theme
                .primaryTextColor(settings.primaryTextColor)
                .secondaryTextColor(settings.secondaryTextColor)
                .primaryBackgroundColor(settings.primaryBackgroundColor)
                .secondaryBackgroundColor(settings.secondaryBackgroundColor)
                .accentColor(settings.accentColor)
                .fontFamily(settings.fontFamily)
                .and()
            .offer
                .description(settings.description)
                .reward(settings.offerImage)
                .bullet({ text: settings.useCase1, isUsed: settings.isUsed1 })
                .bullet({ text: settings.useCase2, isUsed: settings.isUsed2 })
                .bullet({ text: settings.useCase3, isUsed: settings.isUsed3 })
                .terms('terms.md')
                .ptr(shopUrl)
                .tag(TikiSdk.TitleTag.deviceId())
                .use({ usecases: [TikiSdk.LicenseUsecase.attribution()] })
                .add()
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
                TikiSdk.config().onAccept(() => TikiCookiePrivacy.handleAccept())
                TikiSdk.config().onDecline(() => TikiCookiePrivacy.handleDecline())
                TikiSdk.present()
            }
        } else {
            TikiSdkAnon.present()
        }
    }
}
class TikiSdkAnon {
    static id = "tiki-offer"
    static overlayId = "tiki-offer-overlay"

    static present = () => {
        if (document.getElementById(TikiSdkAnon.id) == null) {
            const div = document.createElement("div");
            div.id = TikiSdkAnon.id;
            div.appendChild(TikiSdkAnon.createOverlay());
            document.body.appendChild(div);
            TikiSdkAnon.goTo('prompt');
        }
    }

    static goTo = (step) => {
        switch (step) {
            case 'none':
                const element = document.getElementById(id);
                if (element != null) element.remove();
                break;
            case 'prompt':
                const offerPrompt = TikiSdk.UI.Prompt.create(
                    TikiSdk.config()._offers[0],
                    () => {
                        offerPrompt.remove();
                        TikiSdkAnon.goTo('terms');
                    },
                    () => {
                        TikiSdkAnon.setDecisionCookie(false);
                        offerPrompt.remove();
                    },
                    () => {
                        offerPrompt.remove();
                        TikiSdkAnon.goTo('learnMore');
                    },
                    TikiSdk.config().activeTheme
                );
                TikiSdkAnon.showScreen(offerPrompt);
                break;
            case 'learnMore': {
                const learnMore = TikiSdk.UI.LearnMore.create(() => {
                    learnMore.remove();
                    TikiSdkAnon.goTo('prompt');
                }, TikiSdk.config().activeTheme);
                TikiSdkAnon.showScreen(learnMore);
                break;
            }
            case 'terms': {
                const terms = TikiSdk.UI.Terms.create(
                    {
                        src: TikiSdk.config()._offers[0]._terms,
                    },
                    async () => {
                        TikiSdkAnon.setDecisionCookie(true);
                        terms.remove();
                    },
                    () => {
                        terms.remove();
                        TikiSdkAnon.goTo('prompt');
                    },
                    TikiSdk.config().activeTheme
                );
                TikiSdkAnon.showScreen(terms);
                break;
            }
        }
    }

    static showScreen = (screen) => {
        const div = document.getElementById(TikiSdkAnon.id);
        if (div != null) {
            div.appendChild(screen);
        }
    }

    static createOverlay = () => {
        const overlay = TikiSdk.UI.Overlay.create(() => TikiSdkAnon.goTo('none'));
        overlay.id = TikiSdkAnon.overlayId;
        return overlay;
    }

    static setDecision = (accept) => {
        let expire = new Date()
        let expireTime = expire.setFullYear(expire.getFullYear() + 1)
        expire.setTime(expireTime)
        if (accept) {
            TikiCookiePrivacy.handleAccept()
        } else {
            TikiCookiePrivacy.handleDecline()
        }
    }
}