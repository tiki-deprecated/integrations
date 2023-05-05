## How to Use TIKI SDK Adnroid to Increase User Acceptance for ad tracking and Show Personalized Ads with AdMob

Personalized ads help improve the monetization of an Android app. However, to show personalized ads using AdMob, the user must grant permission for the app to track their activity. If the user denies tracking authorization, the app can still use AdMob but should only show non-personalized ads, which are generally less effective in terms of converting users, negatively impacting the app's monetization.

The TIKI SDK Android can be used to increase the user acceptance for ad personalization. In this tutorial, we will show how to configure TIKI SDK and use it to show personalized ads in an Android app using AdMob while complying with local regulatory demands.

### Prerequisites

Before starting, you should have the following:
- A basic understanding of Android app development
- AdMob account with AdMob SDK integrated into your Android app, including manifest entries
- TIKI SDK credentials

### Steps to Follow

1. Configure TIKI SDK with an offer that describes why the app needs to track ads ID.

```
    TikiSdk
      .offer
      .ptr("AdTrackingRewarded")
      .reward(ResourcesCompat.getDrawable(resources, R.drawable.offer_img, null)!!)
      .bullet("Learn how our ads perform ", true)
      .bullet("Reach you on other platforms", false)
      .bullet("Sold to other companies", false)
      .use(listOf(
              LicenseUsecase.ATTRIBUTION), listOf("mycompany.com/api/tracking"))
      .tag(TitleTag.ADVERTISING_DATA)
      .description("Share your IDFA (kind of like a serial # for your phone) to get better ads.")
      .terms(this, "terms.md")
      .duration(365, TimeUnit.DAYS)
      .add()
```
Note: Check [our docs]() for details on the `offer` parameters.

2. Initialize AdMob and check consent information with the User Messaging Platform (UMP).

   Now we need to configure AdMob depending on the user decision of allowing or not allowing tracking. Non-personalized ads do not use device ad tracking id but still track user information through other sources. To comply with local regulatory demands, like GDPR, the user **still needs to consent** that the app collects anonymous data.

   With the new versions of the Google AdMob SDK, it is not recommended that the app tracks user consent by itself. That means that an active License in TIKI SDK cannot replace the Google UMP framework. As stated in [Google AdMob SDK docs](https://developers.google.com/admob/flutter/privacy?hl=en#display-message):
   > "Using alternative ways of checking the consent status—such as checking a cache your app utilizes or looking for a consent string in storage—are strongly discouraged as the set of ad technology partners could have changed since the user last consented."

```
       private fun initAdMob(){
        val params = ConsentRequestParameters
            .Builder()
            .build()

        consentInformation = UserMessagingPlatform.getConsentInformation(this)
        consentInformation!!.requestConsentInfoUpdate(this, params,
            {
                val consent = consentInformation!!.consentStatus
                if (consentInformation!!.isConsentFormAvailable) {
                    this.loadForm()
                }
            },
            {
                Log.e(tag, it.toString())
            })
    }

    private fun loadForm() {
        // Loads a consent form. Must be called on the main thread.
        UserMessagingPlatform.loadConsentForm(
            this,
            { it ->
                if (consentInformation!!.consentStatus == ConsentInformation.ConsentStatus.REQUIRED) {
                    it.show(this) { error ->
                        if(error != null) {
                            Log.e(tag, error.message)
                        }
                        if (
                            consentInformation!!.consentStatus != ConsentInformation.ConsentStatus.OBTAINED){
                            // handle no consent
                        }
                    }
                }
            },
            {
                Log.e(tag, it.toString())
            }
        )
    }
```

3 - Add the `onAccept` callback to initialize AdMob. It is called after the user decides to opt in.

```
    TikiSdk
      .offer
      // ... offer config
      .add()
      .onAccept{ _, _ ->
         initAdMob()
      }
```

4. Configure and initialize the TIKI SDK with your publishing ID from TIKI Console and your internal user ID. After the initilization is complete, call runApp to build the UI. Use the following code snippet:

```
    TikiSdk
      .offer
      // ... offer config
      .add()
      .onAccept{ _, _ ->
         initAdMob()
      }
      .init(this, <publishing_id>, <user_id>, onComplete = {
      TikiSdk.present(this)
   })
```

5. Replace your current ad prompt with the TIKI SDK `present` method. In this example we are calling the method after the TIKI SDK initializes. This method will display the TIKI SDK pre-built UI, letting the user decide whether to license their tracking ID and recording the result in the TIKI SDK blockchain. Once the user makes a decision, the `onAccept` callback will be called, and the user will have to go through the UMP form if required. Add the `onComplete` callback to call `TikiSdk.present(context)`

```
    TikiSdk
      .offer
      // ... offer config
      .add()
      .onAccept{ _, _ ->
         initAdMob()
      }
      .init(this, "e12f5b7b-6b48-4503-8b39-28e4995b5f88","AdMobUser", onComplete = {
      TikiSdk.present(this)
   })
```

Here's the full code snippet for configuring and initializing the TIKI SDK:

```
     TikiSdk
         .offer
         .ptr("AdTrackingRewarded")
         .reward(ResourcesCompat.getDrawable(resources, R.drawable.offer_img, null)!!)
         .bullet("Learn how our ads perform ", true)
         .bullet("Reach you on other platforms", false)
         .bullet("Sold to other companies", false)
         .use(listOf(
                 LicenseUsecase.ATTRIBUTION), listOf("mycompany.com/api/tracking"))
         .tag(TitleTag.ADVERTISING_DATA)
         .description("Share your IDFA (kind of like a serial # for your phone) to get better ads.")
         .terms(this, "terms.md")
         .duration(365, TimeUnit.DAYS)
         .add()
     .onAccept{ _, _ ->
         initAdMob()
     }
     .init(this, "e12f5b7b-6b48-4503-8b39-28e4995b5f88","AdMobUser", onComplete = {
         TikiSdk.present(this)
     })
```

6. **OPTIONAL** You can use the TIKI SDK `guard` method to check if the user still has a valid License before showing ads. If the user doesn't have a valid license, you can prompt them with the TIKI SDK prompt. Use the following code snippet:

```
   TikiSdk.guard(
      "AdTrackingRewarded", 
      listOf(LicenseUsecase.ATTRIBUTION), 
      listOf("mycompany.com/api/tracking"), {
       // LICENSE IS ACTIVE
       // showPersonalizedAds
      },
      {
       // LICENSE IS DENIED
       // CALL TikiSdk.present()
      }
   }
```Ω