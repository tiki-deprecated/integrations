import 'package:admob/reward_screen.dart';
import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:tiki_sdk_flutter/tiki_sdk.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  RewardedAd? _rewardedAd;

  final adUnitId = 'ca-app-pub-3720008001981265/4562409346';

  Future<void> _loadAd() async {
    await RewardedAd.load(
        adUnitId: adUnitId,
        request: const AdRequest(),
        rewardedAdLoadCallback: RewardedAdLoadCallback(
          onAdLoaded: (ad) {
            debugPrint('Successfully loaded the add! ');
            debugPrint('$ad loaded.');
            _rewardedAd = ad;
            _setFullScreen();
          },
          onAdFailedToLoad: (LoadAdError error) {
            debugPrint('RewardedAd failed to load: $error');
          },
        ));
  }

  void _setFullScreen() {
    if (_rewardedAd == null) {
      return;
    }
    _rewardedAd!.fullScreenContentCallback = FullScreenContentCallback(
      onAdShowedFullScreenContent: (RewardedAd ad) =>
          debugPrint('$ad onAdShowedFullScreenContent'),
      onAdDismissedFullScreenContent: (RewardedAd ad) {
        debugPrint('$ad ');
        ad.dispose();
      },
      onAdFailedToShowFullScreenContent: (RewardedAd ad, AdError err) {
        debugPrint('$ad $err');
        ad.dispose();
      },
      onAdImpression: (RewardedAd ad) => print('$ad impression occured'),
    );
  }

  Future<void> _showRewaredAd() async {
    await _rewardedAd!.show(
        onUserEarnedReward: (AdWithoutView ad, RewardItem item) {
      debugPrint('You earned this amount');
      Navigator.push(context,
          MaterialPageRoute(builder: (context) => const RewardScreen()));
    });
  }

  ///FIXME: THIS IS FOR TEST ADS ONLY
  void loadBanner() {
    final adUnitId = 'ca-app-pub-3940256099942544/5224354917';
    final bannerAd = BannerAd(
      adUnitId: adUnitId,
      request: const AdRequest(),
      size: AdSize.banner,
      listener: const BannerAdListener(),
    );
    bannerAd.load();
  }

  @override
  Widget build(BuildContext context) {
    TikiSdk.config()
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
        .onAccept((p0, p1) async {
          await _loadAd();
          _showRewaredAd();
        })
        .onDecline((p0, p1) => null);

    return Scaffold(
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Padding(
              padding: EdgeInsets.all(20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () async {
                        await _loadAd();
                        TikiSdk.guard(
                            "test_offer2", [LicenseUsecase.analytics()],
                            onPass: () async {
                          _showRewaredAd();
                        }, onFail: (str) {
                          TikiSdk.present(context);
                        });
                      },
                      child: Container(
                        height: 70,
                        color: Theme.of(context).primaryColor,
                        child: const Center(
                          child: Text(
                            'Click here to get rewarded! ',
                            style: TextStyle(
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ),
                  )
                ],
              ),
            ),
            Padding(
              padding: EdgeInsets.all(20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () async {
                        /// On triggering the Opt in button the OnDecline method triggers, while triggering the opt out button the OnAccept method of the offer triggers
                        TikiSdk.settings(context);
                      },
                      child: Container(
                        height: 70,
                        color: Colors.blue,
                        child: const Center(
                          child: Text(
                            'Click here to open settings! ',
                            style: TextStyle(
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ),
                  )
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
