## How to Use TIKI SDK iOS to Increase User Acceptance of App Tracking Transparency Prompt and Show Personalized Ads with AdMob

Personalized ads help improve the monetization of an iOS app. However, to show personalized ads using AdMob, the user must grant permission for the app to track their activity. If the user denies tracking authorization, the app can still use AdMob but should only show non-personalized ads, which are generally less effective in terms of converting users, negatively impacting the app's monetization.

The TIKI SDK iOS can be used to increase the user acceptance of the App Tracking Transparency (ATT) prompt in iOS. In this tutorial, we will show how to configure TIKI SDK and use it to show personalized ads in an iOS app using AdMob while complying with local regulatory demands.

### Prerequisites

Before starting, you should have the following:
- A basic understanding of iOS app development using Swift
- AdMob account with AdMob SDK integrated into your iOS app, including info.plist entries
- TIKI SDK credentials

### Steps to Follow

1. Configure TIKI SDK with an offer that requires the tracking permission. This ensures that TIKI SDK only creates a License if the user has allowed tracking.

   ```swift
       TikiSdk.config()
            .offer
                .permission(.tracking) // IMPORTANT
                .ptr("AdTrackingRewarded")
                .reward("offerImage") 
                .bullet(text: "Learn how our ads perform ", isUsed: true)
                .bullet(text: "Reach you on other platforms", isUsed: false)
                .bullet(text: "Sold to other companies", isUsed: false)
                .use(usecases: [LicenseUsecase(LicenseUsecaseEnum.attribution)], destinations: ["mycompany.com/api/tracking"])
                .tag(.advertisingData)
                .description("Share your IDFA (kind of like a serial # for your phone) to get better ads.")
                .terms("terms") 
                .duration(365 * 24 * 60 * 60)
                .add()
   ```
   Note: Check [our docs]() for details on the `offer` parameters.

2. Check consent information with the User Messaging Platform (UMP).

   Now we need to configure AdMob depending on the user decision of allowing or not allowing tracking. Non-personalized ads do not use device ad tracking id (IDFA) but still track user information through other sources. To comply with local regulatory demands, like GDPR, the user **still needs to consent** that the app collects anonymous data. 
   
   With the new versions of the Google AdMob SDK, it is not recommended that the app tracks user consent by itself. That means that an active License in TIKI SDK cannot replace the Google UMP framework. As stated in [Google AdMob SDK docs](https://developers.google.com/admob/ios/privacy?hl=en#display-message): 
   > "Using alternative ways of checking the consent status—such as checking a cache your app utilizes or looking for a consent string in storage—are strongly discouraged as the set of ad technology partners could have changed since the user last consented."

   ```swift
   func checkUMPConsent(){
        let parameters = UMPRequestParameters()
        parameters.tagForUnderAgeOfConsent = false
        UMPConsentInformation.sharedInstance.requestConsentInfoUpdate(
            with: parameters,
            completionHandler: { error in
                if error != nil {
                    // Handle the error.
                } else {
                    if(UMPConsentInformation.sharedInstance.consentStatus == .required) {
                        // Consent is required, show UMP form.
                    } else {
                        // Consent is not required. 
                    }
                }
            })
    }
   ```

3 - Add the `onAccept` and `onDecline` callbacks. These callbacks are called after the user decides to opt in or not. Either decision the user makes, it needs to go through the UMP consent flow as per AdMob docs.

```swift
       TikiSdk.config()
            .offer
                // ... 
                // offer details
                // ...
                .add()
            .onAccept{ _, _ in
                checkUMPConsent()
            }
            .onDecline{ _, _ in
                checkUMPConsent()
            }
```

These callbacks will trigger after the user accepts or declines the license offer presented by the TIKI SDK. The `onAccept` callback will initiate the UMP form flow by calling the `checkUMPConsent()` function. Similarly, the `onDecline` callback will also call the `checkUMPConsent()` function to handle the user's decision.

By default, the `onAccept` and `onDecline` callbacks are optional. If you do not set them, the TIKI SDK will automatically show the ATT prompt and handle the user's response without additional actions. However, if you want to customize the behavior of the app depending on the user's decision, you can define these callbacks to perform additional actions, such as showing the UMP form.

4. Configure and initialize the TIKI SDK with your publishing ID from TIKI Console and your internal user ID. Use the following code snippet:

```swift
TikiSdk.config()
    .offer
        // offer details and onAccept callback
        // ...
        .onDecline{ _, _ in
            showDefaultAds()
        }
    .initialize(
        publishingId: <publishing ID>,
        id: <user ID>)
```

5. Replace the current ATT prompt with the TIKI SDK `present` method. This method will display the TIKI SDK pre-built UI, letting the user decide whether to license their tracking ID and recording the result in the TIKI SDK blockchain. Once the user makes a decision, the `onAccept` or `onDecline` callbacks will be called, and the user will have to go through the UMP form if required. Use the following code snippet:

```swift
TikiSdk.present()
```

Here's the full code snippet for configuring and initializing the TIKI SDK:

```swift
TikiSdk.config()
    .offer
        .permission(.tracking) // IMPORTANT
        .ptr("AdTrackingRewarded")
        .reward("offerImage") 
        .bullet(text: "Learn how our ads perform ", isUsed: true)
        .bullet(text: "Reach you on other platforms", isUsed: false)
        .bullet(text: "Sold to other companies", isUsed: false)
        .use(usecases: [LicenseUsecase(LicenseUsecaseEnum.attribution)], destinations: ["mycompany.com/api/tracking"])
        .tag(.advertisingData)
        .description("Share your IDFA (kind of like a serial # for your phone) to get better ads.")
        .terms("terms") 
        .duration(365 * 24 * 60 * 60)
        .add()
    .onAccept{ _, _ in
        checkUMPConsent()
    }
    .onDecline{ _, _ in
        checkUMPConsent()
    }
    .initialize(
        publishingId: <publishing ID>,
        id: <user ID>)
```

6. **OPTIONAL** You can use the TIKI SDK `guard` method to check if the user still has a valid License before showing ads. If the user doesn't have a valid license, you can prompt them with the TIKI SDK prompt. Use the following code snippet:

```swift
await TikiSdk.guard(
    ptr: "AdTrackingRewarded",
    usecases: [LicenseUsecase.attribution],
    destinations: ["mycompany.com/api/tracking"],
    onPass: showPersonalizedAds,
    onFail: {_ in TikiSdk.present()})
```