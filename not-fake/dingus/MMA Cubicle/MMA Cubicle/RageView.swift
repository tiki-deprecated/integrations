//
//  RageView.swift
//  MMA Cubicle
//
//  Created by Michael Audi on 4/11/23.
//

import SwiftUI

struct RageView: View {
    @State var progressValue: Float = 0.75

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
            }
        }.padding()
    }
}

struct RageView_Previews: PreviewProvider {
    static var previews: some View {
        RageView()
    }
}
