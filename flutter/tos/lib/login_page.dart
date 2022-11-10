/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:tiki_sdk_flutter/tiki_sdk_flutter.dart';
import 'package:tos/home_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  bool? isAgreed;

  @override
  Widget build(BuildContext context) {
    TikiSdkFlutter tiki = Provider.of<TikiSdkFlutter>(context, listen: false);

    return Scaffold(
      appBar: AppBar(title: const Text('Terms of Service Example')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            CheckboxListTile(
              title: const Text("Do you agree to our Terms of Service?"),
              value: isAgreed ?? false,
              onChanged: (newValue) {
                setState(() {
                  isAgreed = newValue;
                });
              },
              controlAffinity: ListTileControlAffinity.leading,
            ),
            TextButton(
              style: TextButton.styleFrom(
                  textStyle: const TextStyle(fontSize: 20),
                  minimumSize: const Size(150, 50),
                  foregroundColor: Colors.white,
                  backgroundColor: Colors.blue),
              onPressed: isAgreed == true
                  ? () async {
                      String source =
                          'https://tos.example.mytiki.com/terms/061122';
                      String oid = await tiki.assignOwnership(
                          'https://mytiki.com/terms',
                          TikiSdkDataTypeEnum.pool,
                          ['email_address']);
                      await tiki.modifyConsent(
                          oid, const TikiSdkDestination.all());
                      await tiki.applyConsent(
                          source,
                          const TikiSdkDestination(
                              ['https://tos.example.mytiki.com/login']), () {
                        //code to do login w/ server
                        if (!mounted) return;
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const HomePage()));
                      });
                    }
                  : null,
              child: const Text('Login'),
            ),
          ],
        ),
      ),
    );
  }
}
