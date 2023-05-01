import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:tiki_sdk_flutter/tiki_sdk.dart';
import 'home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  MobileAds.instance.updateRequestConfiguration(RequestConfiguration(
      testDeviceIds: ['A9BFA2CD58BFD0F412F9B597C5C5B380']));
  await TikiSdk.config().initialize(
      "ee88a4a2-26e2-4361-9385-aaf7e988719f", "test_user_123",
      onComplete: () => runApp(const MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'TikiSdk with admob',
      home: HomePage(),
    );
  }
}
