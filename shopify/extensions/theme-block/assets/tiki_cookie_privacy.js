window.Shopify.loadFeatures([
    {
      name: 'consent-tracking-api',
      version: '0.1',
    }
  ],
  function(error) {
    if (error) {
      console.log(error);
    }
  }
);
  

class TikiCookiePrivacy{
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


  