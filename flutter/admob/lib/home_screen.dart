import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

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
    await _rewardedAd!.show(onUserEarnedReward: (AdWithoutView ad, RewardItem item) {
      num amount = item.amount;
      debugPrint('You earned this amount $amount');
    });
  }

  @override
  void initState() {
    super.initState();
  }

/// FIXME: THIS IS FOR TEST ADS ONLY
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
                        await _showRewaredAd();
                      },
                      child: Container(
                        height: 70,
                        color: Colors.blue,
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
            )
          ],
        ),
      ),
    );
  }
}
