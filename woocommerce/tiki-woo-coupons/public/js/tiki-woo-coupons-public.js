const createUserCoupon = () => {
    wp.api.loadPromise.done( function() {
        console.log("create coupon")
    } )
}

const removeUserCoupon= () => {
    wp.api.loadPromise.done( function() {
        console.log("remove coupon")
    } )
}
