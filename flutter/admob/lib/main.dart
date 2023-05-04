import 'dart:io';

import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:tiki_sdk_flutter/tiki_sdk.dart';

void main() async {

  WidgetsFlutterBinding.ensureInitialized();

  await TikiSdk.config()
      .offer
        .reward(Image.asset("lib/assets/monkey.jpeg"))
        .ptr("test_offer2")
        .bullet("Learn how our ads perform ", true)
        .use([LicenseUsecase.analytics()])
        .tag(TitleTag.advertisingData())
        .description("View this ad to get rewarded.")
        .terms("lib/terms.md")
        .duration(const Duration(days: 365))
        .add()
      .onAccept((_, __) => _initAdMob())
      .initialize("ee88a4a2-26e2-4361-9385-aaf7e988719f", "adMobTestUser3",
        onComplete: () => runApp(const MaterialApp(
        title: 'TIKI AdMob Example',
        home: Scaffold(
          body: HomeWidget()
        )
      )));
}

class HomeWidget extends StatelessWidget{
  const HomeWidget({super.key});

  @override
  Widget build(BuildContext context) {
    Future.delayed(Duration.zero, () => TikiSdk.present(context));
    return Center(
      child: ElevatedButton(onPressed: () => _showAd() , child: const Text("Show Ad"))
    );
  }
}

void _initAdMob() {
  ConsentDebugSettings debugSettings = ConsentDebugSettings();

  ConsentRequestParameters params = ConsentRequestParameters(
      consentDebugSettings: debugSettings);
  ConsentInformation.instance.requestConsentInfoUpdate(
    params,
        () async {
          if (await ConsentInformation.instance.isConsentFormAvailable()) {
            _loadUmpForm();
          }
    },
        (formError) => debugPrint(formError.message)
  );
}

void _loadUmpForm() {
  ConsentForm.loadConsentForm(
        (ConsentForm consentForm) async {
      var status = await ConsentInformation.instance.getConsentStatus();
      if (status == ConsentStatus.required) {
        consentForm.show(
              (FormError? formError) => _loadUmpForm()
        );
      }
    },
        (formError) => debugPrint(formError.message)
  );
}

void _showAd(){
  MobileAds.instance.initialize();
  final adUnitId = Platform.isAndroid
      ? 'ca-app-pub-3940256099942544/1033173712'
      : 'ca-app-pub-3940256099942544/4411468910';

    InterstitialAd.load(
        adUnitId: adUnitId,
        request: const AdRequest(),
        adLoadCallback: InterstitialAdLoadCallback(
          onAdLoaded: (ad) {
            ad.show();
          },
          onAdFailedToLoad: (LoadAdError error) {
            debugPrint('InterstitialAd failed to load: $error');
          },
        ));
}
