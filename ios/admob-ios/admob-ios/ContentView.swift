//
//  ContentView.swift
//  admob-ios
//
//  Created by Ricardo on 01/05/23.
//

import SwiftUI
import TikiSdk
import GoogleMobileAds

struct ContentView: View {
    
    @State var adSeen: Bool = false
    @State var rewardedAd: GADRewardedAd?
    
    init(){
        do{
            try TikiSdk.config().offer
                .ptr("AdTrackingRewarded")
                .reward("offerImage")
                .bullet(text: "Learn how our ads perform ", isUsed: true)
                .bullet(text: "Reach you on other platforms", isUsed: false)
                .bullet(text: "Sold to other companies", isUsed: false)
                .use(usecases: [LicenseUsecase(LicenseUsecaseEnum.attribution)])
                .tag(.advertisingData)
                .description("Trade your IDFA (kind of like a serial # for your phone) for a discount.")
                .terms("terms")
                .duration(365 * 24 * 60 * 60)
                .add()
            loadAd()
        }catch{
            print(error)
        }
    }
    
    var body: some View {
        VStack {
            Button(!adSeen ? "See ad" : "Back") {
                if(!adSeen){
                    Task{
                        showAd()
                    }
                }else{
                    adSeen = false
                }
            }
        }
        .padding()
    }
    
    func loadAd(){
        let request = GADRequest()
        GADRewardedAd.load(withAdUnitID:"ca-app-pub-3940256099942544/1712485313",
                           request: request,
                           completionHandler: { [self] ad, error in
            if let error = error {
                print("Failed to load rewarded ad with error: \(error.localizedDescription)")
                return
              }
              rewardedAd = ad
              print("Rewarded ad loaded.")
            }
        )
    }
    
    func seeAd() async {
        let _ = try? await TikiSdk.guard(
            ptr: "AdTrackingRewarded",
            usecases: [LicenseUsecase.attribution],
            destinations: ["mycompany.com/api/tracking"],
            onPass: showAd,
            onFail: promptOffer)
    }
    
    func showAd(){
        if let ad = rewardedAd {
            ad.present(fromRootViewController: UIApplication
                .shared
                .connectedScenes
                .compactMap { ($0 as? UIWindowScene)?.keyWindow }
                .last!.rootViewController!) {
              let reward = ad.adReward
              print("Reward received with currency \(reward.amount), amount \(reward.amount.doubleValue)")
              // TODO: Reward the user.
            }
            } else {
            print("Ad wasn't ready")
        }
    }
    
    func promptOffer(_ reason: String?){
        TikiSdk.config().onAccept{_,_ in
            showAd()
        }
        try? TikiSdk.present()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
