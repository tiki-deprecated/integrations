/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import 'package:flutter/material.dart';
import 'package:tiki_sdk_flutter/main.dart';

import 'login_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  TikiSdkFlutter tikiSdkFlutter = await buildSdk();
  runApp(MyApp(tikiSdkFlutter));
}

class MyApp extends StatelessWidget {

  final TikiSdkFlutter tikiSdkFlutter;

  const MyApp(this.tikiSdkFlutter, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {

    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: LoginPage(tikiSdkFlutter),
    );
  }
}

Future<TikiSdkFlutter> buildSdk() {
  TikiSdkFlutterBuilder sdk = TikiSdkFlutterBuilder();
  sdk.origin("com.mytiki.example.tos");
  sdk.apiKey("to be defined");
  return sdk.build();
}
