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
        .terms(settings.terms)
        .tag(TikiSdk.TitleTag.deviceId())
        .use({ usecases: [TikiSdk.LicenseUsecase.attribution()] })
        .add()
let offer = TikiSdk.config()._offers[0];
if (customer_id) {
    await TikiSdk.config().offer()
        .ptr(customer_id)
        .initialize(settings.publishingId, customer_id);
    let tikiDecisionCookie = document.cookie.match(RegExp('(?:^|;\\s*)tiki_decision=([^;]*)'));
    if (tikiDecisionCookie) {
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
        TikiSdk.present()
    }
} else {
    tikiAnon()
}

