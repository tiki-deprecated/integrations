const tikiId = "tiki-offer"
const tikiOverlayId = "tiki-offer-overlay"

const tikiAnon = () => {
    if (document.getElementById(tikiId) == null) {
        const div = document.createElement("div");
        div.id = tikiId;
        div.appendChild(tikiAnonCreateOverlay());
        document.body.appendChild(div);
        tikiAnonGoTo('prompt');
    }
}

const tikiAnonGoTo = (step) => {
    switch (step) {
        case 'none':
            const element = document.getElementById(tikiId);
            if (element != null) element.remove();
            break;
        case 'prompt':
            const offerPrompt = TikiSdk.UI.Prompt.create(
                TikiSdk.config()._offers[0],
                () => {
                    offerPrompt.remove();
                    tikiAnonGoTo('terms');
                },
                () => {
                    setDecisionCookie(false);
                    offerPrompt.remove();
                },
                () => {
                    offerPrompt.remove();
                    tikiAnonGoTo('learnMore');
                },
                TikiSdk.config().activeTheme
            );
            tikiAnonShowScreen(offerPrompt);
            break;
        case 'learnMore': {
            const learnMore = TikiSdk.UI.LearnMore.create(() => {
                learnMore.remove();
                tikiAnonGoTo('prompt');
            }, TikiSdk.config().activeTheme);
            tikiAnonShowScreen(learnMore);
            break;
        }
        case 'terms': {
            const terms = TikiSdk.UI.Terms.create(
                {
                    src: TikiSdk.config()._offers[0]._terms,
                },
                async () => {
                    setDecisionCookie(true);
                    terms.remove();
                },
                () => {
                    terms.remove();
                    tikiAnonGoTo('prompt');
                },
                TikiSdk.config().activeTheme
            );
            tikiAnonShowScreen(terms);
            break;
        }
    }
}

const tikiAnonShowScreen = (screen) => {
    const div = document.getElementById(tikiId);
    if (div != null) {
        div.appendChild(screen);
    }
}

const tikiAnonCreateOverlay = () => {
    const overlay = TikiSdk.UI.Overlay.create(() => tikiAnonGoTo('none'));
    overlay.id = tikiOverlayId;
    return overlay;
}

const tikiAnonSetDecision = (accept) => {
    let expire = new Date()
    let expireTime = expire.setFullYear(expire.getFullYear() + 1)
    expire.setTime(expireTime)
    if (accept) {
        TikiCookiePrivacy.handleAccept()
    } else {
        TikiCookiePrivacy.handleDecline()
    }
}

TikiSdk.config()
    .theme
    .primaryTextColor(TIKI_SETTINGS.primaryTextColor)
    .secondaryTextColor(TIKI_SETTINGS.secondaryTextColor)
    .primaryBackgroundColor(TIKI_SETTINGS.primaryBackgroundColor)
    .secondaryBackgroundColor(TIKI_SETTINGS.secondaryBackgroundColor)
    .accentColor(TIKI_SETTINGS.accentColor)
    .fontFamily(TIKI_SETTINGS.fontFamily)
    .and()
    .offer
    .description(TIKI_SETTINGS.description)
    .reward(TIKI_SETTINGS.offerImage)
    .bullet({ text: TIKI_SETTINGS.useCase1, isUsed: TIKI_SETTINGS.isUsed1 })
    .bullet({ text: TIKI_SETTINGS.useCase2, isUsed: TIKI_SETTINGS.isUsed2 })
    .bullet({ text: TIKI_SETTINGS.useCase3, isUsed: TIKI_SETTINGS.isUsed3 })
    .terms(TIKI_SETTINGS.terms)
    .tag(TikiSdk.TitleTag.deviceId())
    .use({ usecases: [TikiSdk.LicenseUsecase.attribution()] })
    .add()
let offer = TikiSdk.config()._offers[0];
if (customer_id) {
    TikiSdk.config().offer()
        .ptr(customer_id)
        .initialize(TIKI_SETTINGS.publishingId, customer_id, () => {
            let tikiDecisionCookie = document.cookie.match(RegExp('(?:^|;\\s*)tiki_decision=([^;]*)'));
            if (tikiDecisionCookie) {
                let uses = true === decision ? offer._uses : []
                license(
                    offer._ptr,
                    uses,
                    offer._terms,
                    offer._tags,
                    offer._description,
                    offer._expiry
                );
            } else {
                TikiSdk.present()
            }
        })
} else {
    tikiAnon()
}

