/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import 'package:flutter/material.dart';
import 'package:tiki_sdk_flutter/main.dart';

import 'login_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  TikiSdk tiki = await (TikiSdkFlutterBuilder()
        ..apiId("b213d6bd-ccff-45c2-805e-4f0062d4ad5e")
        ..origin("com.mytiki.example_flutter_tos"))
      .build();
  runApp(MyApp(tiki));
}

class MyApp extends StatelessWidget {
  final TikiSdk tiki;

  const MyApp(this.tiki, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: LoginPage(tiki),
    );
  }
}
