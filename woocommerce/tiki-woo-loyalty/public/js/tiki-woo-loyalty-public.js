const tikiWoocommerceGrantPoints = () => {
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

const tikiWoocommerceRemovePoints= () => {
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
