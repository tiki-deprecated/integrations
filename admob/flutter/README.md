## How to Use TIKI SDK Flutter to Increase User Acceptance of App Tracking Transparency Prompt and Show Personalized Ads with AdMob

Personalized ads help improve the monetization of a Flutter app. However, to show personalized ads using AdMob, the user must grant permission for the app to track their activity. If the user denies tracking authorization, the app can still use AdMob but should only show non-personalized ads, which are generally less effective in terms of converting users, negatively impacting the app's monetization.

The TIKI SDK Flutter can be used to increase the user acceptance for ad personalization. In this tutorial, we will show how to configure TIKI SDK and use it to show personalized ads in a Flutter app using AdMob while complying with local regulatory demands.

### Prerequisites

Before starting, you should have the following:
- A basic understanding of Flutter app development
- AdMob account with AdMob SDK integrated into your Flutter app, including manifest and info.plist entries
- TIKI SDK credentials

### Steps to Follow

1. Configure TIKI SDK with an offer that requires the tracking permission. This ensures that TIKI SDK only creates a License if the user has allowed tracking.

```
   await TikiSdk.config()
      .offer
        .reward(Image.asset("lib/assets/offer_sample.png"))
        .ptr("test_offer")
        .bullet("Learn how our ads perform ", true)
        .bullet("Reach you on other platforms", false)
        .bullet("Sold to other companies", false)
        .use([LicenseUsecase.attribution()])
        .tag(TitleTag.advertisingData())
        .description("Trade your IDFA (kind of like a serial # for your phone) for a discount.")
        .terms("lib/ui/assets/terms.md")
        .permission(Permission.appTrackingTransparency)
        .duration(const Duration(days: 365))
      .add()
```
   Note: Check [our docs]() for details on the `offer` parameters.

2. Initialize AdMob and check consent information with the User Messaging Platform (UMP).

   Now we need to configure AdMob depending on the user decision of allowing or not allowing tracking. Non-personalized ads do not use device ad tracking id but still track user information through other sources. To comply with local regulatory demands, like GDPR, the user **still needs to consent** that the app collects anonymous data.

   With the new versions of the Google AdMob SDK, it is not recommended that the app tracks user consent by itself. That means that an active License in TIKI SDK cannot replace the Google UMP framework. As stated in [Google AdMob SDK docs](https://developers.google.com/admob/flutter/privacy?hl=en#display-message):
   > "Using alternative ways of checking the consent status—such as checking a cache your app utilizes or looking for a consent string in storage—are strongly discouraged as the set of ad technology partners could have changed since the user last consented."

```
   void _initAdMob() {
      ConsentDebugSettings debugSettings = ConsentDebugSettings();
      ConsentRequestParameters params = ConsentRequestParameters(consentDebugSettings: debugSettings);
      ConsentInformation.instance.requestConsentInfoUpdate(params, () async {
         if (await ConsentInformation.instance.isConsentFormAvailable()) {
         _loadUmpForm();
         }
      }, (formError) => debugPrint(formError.message));
   }
      
   void _loadUmpForm() {
      ConsentForm.loadConsentForm((ConsentForm consentForm) async {
         var status = await ConsentInformation.instance.getConsentStatus();
         if (status == ConsentStatus.required) {
            consentForm.show((FormError? formError) => _loadUmpForm());
         }
      }, (formError) => debugPrint(formError.message));
   }
```

3 - Add the `onAccept` callback to initialize AdMob. It is called after the user decides to opt in.

```
   await TikiSdk.config()
      .offer
      // ...
      .add()
   .onAccept((_, __) => _initAdMob())
```

4. Configure and initialize the TIKI SDK with your publishing ID from TIKI Console and your internal user ID. After the initilization is complete, call runApp to build the UI. Use the following code snippet:

```
   await TikiSdk.config()
      .offer
      // ...
      .add()
   .onAccept((_, __) => _initAdMob())
      .initialize("ee88a4a2-26e2-4361-9385-aaf7e988719f", "adMobUser",
          onComplete: () => runApp(const MaterialApp(
              title: 'TIKI AdMob Example',
              home: Scaffold(body: HomeWidget()))));
```

5. Replace your current ad prompt with the TIKI SDK `present` method. In this example we are calling the method after the UI builds. This method will display the TIKI SDK pre-built UI, letting the user decide whether to license their tracking ID and recording the result in the TIKI SDK blockchain. Once the user makes a decision, the `onAccept` callback will be called, and the user will have to go through the UMP form if required. To call TikiSdk.present() in the build method of a Widget, use the following code:

```dart
   Future.delayed(Duration.zero, () => TikiSdk.present(context));
```

Here's the full code snippet for configuring and initializing the TIKI SDK:

```
   await TikiSdk.config()
      .offer
        .reward(Image.asset("lib/assets/offer_sample.png"))
        .ptr("test_offer")
        .bullet("Learn how our ads perform ", true)
        .bullet("Reach you on other platforms", false)
        .bullet("Sold to other companies", false)
        .use([LicenseUsecase.attribution()])
        .tag(TitleTag.advertisingData())
        .description("Trade your IDFA (kind of like a serial # for your phone) for a discount.")
        .terms("lib/assets/terms.md")
        .permission(Permission.appTrackingTransparency)
        .duration(const Duration(days: 365))
      .add()
      .onAccept((_, __) => _initAdMob())
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
```Ω