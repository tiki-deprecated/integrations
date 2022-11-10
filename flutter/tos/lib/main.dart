/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:tiki_sdk_flutter/tiki_sdk_flutter.dart';

import 'login_page.dart';

void main() async {
  TikiSdkFlutter tiki =
      await TikiSdkFlutter().init('com.mytiki.example.tos', 'apiKey');
  runApp(Provider<TikiSdkFlutter>.value(
    value: tiki,
    child: const MyApp(),
  ));
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const LoginPage(),
    );
  }
}
