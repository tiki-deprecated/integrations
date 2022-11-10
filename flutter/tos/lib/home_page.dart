/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:tiki_sdk_flutter/tiki_sdk_flutter.dart';

class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    TikiSdkFlutter tiki = Provider.of<TikiSdkFlutter>(context, listen: false);
    ConsentModel? consent =
        tiki.getConsent('https://tos.example.mytiki.com/terms/061122');

    return Scaffold(
        appBar: AppBar(
          title: const Text('Home'),
        ),
        body: Center(
            child: Column(
          children: [
            namedField(
                'oid',
                consent?.ownershipId != null
                    ? base64Encode(consent!.ownershipId)
                    : null),
            namedField('destination', consent?.destination.toString()),
            namedField('about', consent?.about),
            namedField('reward', consent?.reward),
            namedField(
                'tid',
                consent?.transactionId != null
                    ? base64Encode(consent!.transactionId!)
                    : null),
            namedField('expiry', consent?.expiry?.toIso8601String()),
            TextButton(
                style: TextButton.styleFrom(
                    textStyle: const TextStyle(fontSize: 20),
                    minimumSize: const Size(150, 50),
                    foregroundColor: Colors.white,
                    backgroundColor: Colors.blue),
                onPressed: null, // () { launchUrl(Uri.parse('uri'));},
                child: const Text('See Block')),
          ],
        )));
  }

  Widget namedField(String name, String? value) {
    return Row(
        children: [Text(name), const Text(':'), Text(value ?? 'Not Set')]);
  }
}
