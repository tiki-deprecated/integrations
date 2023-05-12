const createUserCoupon = () => {
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

const removeUserCoupon= () => {
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
