In some areas, to show personalized ads in an Android app with AdMob, the user must grant permission for the app to track their activity. 
However, if the user denies tracking authorization, the app can still use AdMob, but should only show non-personalized ads. These ads are generally less effective in terms of converting users, which can negatively impact the app's monetization.

The TIKI SDK iOS can be used to increase the user acceptance of the App Tracking Transparency (ATT) prompt in iOS. This is how you do it:

1. Configure TIKI SDK with an offer that requires the tracking permission. This ensures that TIKI SDK only creates a License if the user has allowed tracking.

```kotlin
       TikiSdk.config()
            .offer
                .permission(.tracking) // IMPORTANT
                .ptr("AdTrackingRewarded")
                .reward("offerImage") 
                .bullet(text: "Learn how our ads perform ", isUsed: true)
                .bullet(text: "Reach you on other platforms", isUsed: false)
                .bullet(text: "Sold to other companies", isUsed: false)
                .use(usecases: [LicenseUsecase(LicenseUsecaseEnum.attribution)])
                .tag(.advertisingData)
                .description("Share your IDFA (kind of like a serial # for your phone) to get better ads.")
                .terms("terms") 
                .duration(365 * 24 * 60 * 60)
                .add()
```
Note: Check our docs for details on the `offer` parameters.

2 - Add the `onAccept` and `onDecline` callbacks. These callbacks determine whether to show personalized ads or non-personalized ads based on the user's response to the TIKI SDK prompt.

```kotlin
       TikiSdk.config()
            .offer
                // ... 
                // offer details
                // ...
                .add()
            .onAccept{ _, _ in
                showPersonalizedAds() // configure AdMob
            }
            .onDecline{ _, _ in
                showDefaultAds() // configure AdMob
            }
```

3 - Initialize TIKI SDK with the publishing ID from TIKI Console and your internal user ID.

```kotlin
       TikiSdk.config()
            .offer
                // ... 
                // offer details and onAccept callback
                // ...
            .onDecline{ _, _ in
                showDefaultAds()
            }
            .initialize(
                publishingId: <publishing ID>,
                id: <user ID>)
```

4 - Replace your current ATT prompt with the TIKI SDK present method. This method will show the TIKI SDK pre-built UI letting the user decide whether to license their tracking ID, and it will record the result in the TIKI SDK blockchain. After the user makes a decision, the `onAccept` or `onDecline` callbacks will be called.
```kotlin
    TikiSdk.present()
```

This is how the full configure and initilization code looks like:

```kotlin
    TikiSdk.config()
        .offer
            .permission(.tracking) // IMPORTANT
            .ptr("AdTrackingRewarded")
            .reward("offerImage") 
            .bullet(text: "Learn how our ads perform ", isUsed: true)
            .bullet(text: "Reach you on other platforms", isUsed: false)
            .bullet(text: "Sold to other companies", isUsed: false)
            .use(usecases: [LicenseUsecase(LicenseUsecaseEnum.attribution)])
            .tag(.advertisingData)
            .description("Share your IDFA (kind of like a serial # for your phone) to get better ads.")
            .terms("terms") 
            .duration(365 * 24 * 60 * 60)
            .add()
        .onAccept{ _, _ in
            showPersonalizedAds() // configure AdMob
        }
        .onDecline{ _, _ in
            showDefaultAds() // configure AdMob
        }
        .initialize(
            publishingId: <publishing ID>,
            id: <user ID>)
```

5 - **OPTIONAL** You can use the TIKI SDK `guard` method to check if the user still has a valid License before showing ads. If the user doesn't have a valid license, you can prompt them with the TIKI SDK prompt.

```kotlin
    await TikiSdk.guard(
        ptr: "AdTrackingRewarded",
        usecases: [LicenseUsecase.attribution],
        destinations: ["mycompany.com/api/tracking"],
        onPass: showPersonalizedAds,
        onFail: {_ in TikiSdk.present()})
``` 