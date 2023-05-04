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

  void _loadAd() async {
    await RewardedAd.load(
        adUnitId: adUnitId,
        request: const AdRequest(),
        rewardedAdLoadCallback: RewardedAdLoadCallback(
          onAdLoaded: (ad) {
            debugPrint('Successfully loaded the ad! ');
            debugPrint('$ad loaded.');
            _rewardedAd = ad;
          },
          onAdFailedToLoad: (LoadAdError error) {
            debugPrint('RewardedAd failed to load: $error');
          },
        ));
  }

  Future<void> _showRewardedAd() async {
    await _rewardedAd!.show(
        onUserEarnedReward: (AdWithoutView ad, RewardItem item) {
      debugPrint('You earned this amount');
      Navigator.push(context,
          MaterialPageRoute(builder: (context) => const RewardScreen()));
    });
    /// calling _loadAd() here as the user can cancel the currently running ad
    /// and when that happens [onUserEarnedReward] method will not get triggered.
    _loadAd();
  }

  @override
  void initState() {
    super.initState();
    _loadAd();
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
          _showRewardedAd();
        });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () async {
                        TikiSdk.guard(
                            "test_offer2", [LicenseUsecase.analytics()],
                            onPass: () async {
                          _showRewardedAd();
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
          ],
        ),
      ),
    );
  }
}
