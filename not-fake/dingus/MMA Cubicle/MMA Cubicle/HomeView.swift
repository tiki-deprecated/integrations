//
//  ContentView.swift
//  MMA Cubicle
//
//  Created by Michael Audi on 4/11/23.
//

import SwiftUI

struct HomeView: View {
    var body: some View {
        NavigationView{
            VStack {
                Text("All Hands")
                Text("Marketing Meeting")
                    .padding(.bottom, 30)
                NavigationLink(
                    destination: RageView(), label: {
                        Image("door")
                    })
                Text("Don't do it...").padding(.top, 30)
            }
            .padding()
            .frame(maxWidth: Double.infinity, maxHeight: Double.infinity)
            .background(Color.white)
        }
    }
}

struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        HomeView()
    }
}
