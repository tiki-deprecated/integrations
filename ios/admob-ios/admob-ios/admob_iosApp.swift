//
//  admob_iosApp.swift
//  admob-ios
//
//  Created by Ricardo on 01/05/23.
//

import SwiftUI
import GoogleMobileAds
import TikiSdk
import UserMessagingPlatform

@main
struct admob_iosApp: App {
    
    init(){
        initTikiSdk()
    }
    
    var body: some Scene {
        WindowGroup {
            Text("Hello TIKI!")
        }
    }
    
    func initTikiSdk(){
        do{
            try TikiSdk.config()
                .offer
                .permission(.tracking) // IMPORTANT
                .ptr("AdmobExampleAd")
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
                    initAdMob()
                }
                .onDecline{ _, _ in
                    initAdMob()
                }
                .initialize(
                    publishingId: "e12f5b7b-6b48-4503-8b39-28e4995b5f88",
                    id: "user_123")
            try TikiSdk.present()
        }catch{
            print(error)
        }
    }

    func initAdMob(){
           let parameters = UMPRequestParameters()
           parameters.tagForUnderAgeOfConsent = false
           UMPConsentInformation.sharedInstance.requestConsentInfoUpdate(
               with: parameters,
               completionHandler: { error in
                   if(UMPConsentInformation.sharedInstance.consentStatus != .required) {
                       loadAd()
                   }else{
                       UMPConsentForm.load(
                        completionHandler: { form, loadError in
                            if loadError != nil {
                                let formStatus = UMPConsentInformation.sharedInstance.formStatus
                                    if formStatus == UMPFormStatus.available {
                                        UMPConsentForm.load(
                                            completionHandler: { form, loadError in
                                            if loadError != nil {
                                                print(error?.localizedDescription)
                                            } else {
                                                loadAd()
                                            }
                                          })
                              }
                            }
                       })
                   }
               })
       }
    
    func loadAd(){
        GADMobileAds.sharedInstance().start()
        let request = GADRequest()
        GADInterstitialAd.load(withAdUnitID: "ca-app-pub-3940256099942544/4411468910",
                    request: request,
          completionHandler: { ad, error in
            if let error = error {
              print("Failed to load interstitial ad with error: \(error.localizedDescription)")
              return
            }
            ad!.present(fromRootViewController: UIApplication.shared.windows.first!.rootViewController!)
          }
        )
    }
}


