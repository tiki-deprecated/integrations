const tikiGrantPoints = () => {
    wp.api.loadPromise.done( function() {
        fetch( `${wpApiSettings.root}tiki/v1/woocommerce/loyalty/grant`, {
			method : 'post',
			mode : 'cors',
			headers : {
				'Access-Control-Allow-Origin' : '*',
				'X-WP-Nonce' : wpApiSettings.nonce
			}
        });
    } )
}

const tikiRemovePoints= () => {
    wp.api.loadPromise.done( function() {
        fetch(`${wpApiSettings.root}tiki/v1/woocommerce/loyalty/remove`, {
            method : 'post',
            mode : 'cors',
            headers : {
                'Access-Control-Allow-Origin' : '*',
                'X-WP-Nonce' : wpApiSettings.nonce
            }
            });
    } )
}

if(tikiCookieYesSetInitial == undefined){
    const tikiCookieYesSetInitial = () => {
        let cookieYesCookie = document.cookie.match(new RegExp('(^| )cookieyes-consent=([^;]+)'))[0];
        if(cookieYesCookie == undefined){
            let expire = new Date()
            let expireTime = expire.setFullYear(expire.getFullYear() + 1)
            expire.setTime(expireTime)        
            document.cookie = `cookieyes-consent=consentid:${consentId},consent:no,action:yes,necessary:yes,functional:no,analytics:no,performance:no,advertisement:no;expires=${expire.toUTCString()};path=/`
        }
    }
}

if(tikiCookieYesAcceptCallback == undefined){
    const tikiCookieYesAcceptCallback = () => 
        document.querySelectorAll('[data-cky-tag="detail-accept-button"]')[0].click()
}

if(tikiCookieYesAcceptCallback == undefined){
    const tikiCookieYesDenyCallback = () => 
        document.querySelectorAll('[data-cky-tag="revisit-consent"]')[0].click()
}
