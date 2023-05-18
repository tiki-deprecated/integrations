const tikiCreateUserCoupon = () => {
    wp.api.loadPromise.done( function() {
        fetch( `${wpApiSettings.root}tiki/v1/woocommerce/coupon/create`, {
        method : 'post',
        mode : 'cors',
        headers : {
            'Access-Control-Allow-Origin' : '*',
            'X-WP-Nonce' : wpApiSettings.nonce
        }
        });
    } )
}

const tikiRemoveUserCoupon= () => {
    wp.api.loadPromise.done( function() {
        fetch(`${wpApiSettings.root}tiki/v1/woocommerce/coupon/delete`, {
            method : 'post',
            mode : 'cors',
            headers : {
                'Access-Control-Allow-Origin' : '*',
                'X-WP-Nonce' : wpApiSettings.nonce
            }
            });
    } )
}

    const tikiCookieYesAcceptCallback = () => 
        document.querySelectorAll('[data-cky-tag="detail-accept-button"]')[0].click()

    const tikiCookieYesDenyCallback = () => 
        document.querySelectorAll('[data-cky-tag="revisit-consent"]')[0].click()
