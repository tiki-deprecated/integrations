/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

class TikiSdkAnon {
    static id = "tiki-offer"
    static overlayId = "tiki-offer-overlay"

    static start = () => {
        debugger
        if (document.getElementById(TikiSdkFlow.id) == null) {
            const div = document.createElement("div");
            div.id = TikiSdkFlow.id;
            div.appendChild(TikiSdkFlow.createOverlay());
            document.body.appendChild(div);
            TikiSdkFlow.goTo('prompt');
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
                        debugger
                        offerPrompt.remove();
                        TikiSdkFlow.goTo('terms');
                    },
                    () => {
                        debugger
                        TikiSdkFlow.setDecisionCookie(false);
                        offerPrompt.remove();
                    },
                    () => {
                        debugger
                        offerPrompt.remove();
                        TikiSdkFlow.goTo('learnMore');
                    },
                    TikiSdk.config().activeTheme
                );
                TikiSdkFlow.showScreen(offerPrompt);
                break;
            case 'learnMore': {
                const learnMore = TikiSdk.UI.LearnMore.create(() => {
                    debugger
                    learnMore.remove();
                    TikiSdkFlow.goTo('prompt');
                }, TikiSdk.config().activeTheme);
                TikiSdkFlow.showScreen(learnMore);
                break;
            }
            case 'terms': {
                const terms = TikiSdk.UI.Terms.create(
                    {
                        src: TikiSdk.config()._offers[0]._terms,
                    },
                    async () => {
                        debugger
                        TikiSdkFlow.setDecisionCookie(true);
                        terms.remove();
                    },
                    () => {
                        debugger
                        terms.remove();
                        TikiSdkFlow.goTo('prompt');
                    },
                    TikiSdk.config().activeTheme
                );
                TikiSdkFlow.showScreen(terms);
                break;
            }
        }
    }

    static showScreen = (screen) => {
        const div = document.getElementById(TikiSdkFlow.id);
        if (div != null) {
            div.appendChild(screen);
        }
    }

    static createOverlay = () => {
        const overlay = TikiSdk.UI.Overlay.create(() => TikiSdkFlow.goTo('none'));
        overlay.id = TikiSdkFlow.overlayId;
        return overlay;
    }

    static setDecision = (accept) => {
        let expire = new Date()
        let expireTime = expire.setFullYear(expire.getFullYear() + 1)
        expire.setTime(expireTime)
        if(accept) {
            TikiCookiePrivacy.handleAccept()
        }else{
            TikiCookiePrivacy.handleDecline()
        }
    }
}
