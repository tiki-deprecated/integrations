//
//  admob_iosApp.swift
//  admob-ios
//
//  Created by Ricardo on 01/05/23.
//

import SwiftUI
import GoogleMobileAds
import TikiSdk

@main
struct admob_iosApp: App {
    
    init(){
        initTikiSdk()
        initAdMob()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
    
    func initTikiSdk(){
        try? TikiSdk.config().initialize(
                publishingId: "e12f5b7b-6b48-4503-8b39-28e4995b5f88",
                id: "user_123")
    }
    
    func initAdMob(){
        GADMobileAds.sharedInstance().start()
    }
}
