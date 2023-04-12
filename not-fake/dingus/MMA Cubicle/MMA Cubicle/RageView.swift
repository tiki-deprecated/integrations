//
//  RageView.swift
//  MMA Cubicle
//
//  Created by Michael Audi on 4/11/23.
//

import SwiftUI
import GoogleMobileAds
import AppTrackingTransparency
import AdSupport

struct RageView: View {
    @State var progressValue: Float = 0

    init() {
        ATTrackingManager
            .requestTrackingAuthorization(completionHandler: {
                status in
                switch(status){
                case .authorized:
                    print("ad me scotty")
                    break
                case .denied:
                    print("denied")
                    break
                case .restricted:
                    print("oi??")
                    break
                case .notDetermined:
                    print("idk")
                    break
                @unknown default:
                    print("uhoh")
                }
          })
    }

    var body: some View {
        VStack {
            Text("RAGE METER")
            RageBar(value: $progressValue).frame(height: 20)
            HStack(alignment: .top) {
                VStack{
                    Text("Jeff")
                    Text("Spicoli")
                }
                Spacer()
                VStack{
                    Text("ROI'd")
                    Text("Out")
                }
            }.padding(.bottom, 50)
            AdViewRepresentable(adShown: {
                res in
                if(res) {
                    self.progressValue += 0.01
                }
            })
                .frame(height: 300)

        }.padding()
    }
}

struct RageView_Previews: PreviewProvider {
    static var previews: some View {
        RageView()
    }
}
