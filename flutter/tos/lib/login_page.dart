/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import 'package:flutter/material.dart';
import 'package:tiki_sdk_flutter/tiki_sdk_flutter.dart';
import 'package:tiki_sdk_dart/tiki_sdk_data_type_enum.dart';
import 'package:tos/home_page.dart';

class LoginPage extends StatefulWidget {

  final TikiSdkFlutter tikiSdkFlutter;

  const LoginPage(this.tikiSdkFlutter, {Key? key}) : super(key: key);

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  bool? isAgreed;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Terms of Service Example'),
      ),
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
                  widget.tikiSdkFlutter.assignOwnership(
                      "tos_id123", TikiSdkDataTypeEnum.point, ["tos_id"]).then(
                        (String id) => print(id));
                });
              },
              controlAffinity:
                  ListTileControlAffinity.leading, //  <-- leading Checkbox
            ),
            TextButton(
              style: TextButton.styleFrom(
                  textStyle: const TextStyle(fontSize: 20),
                  minimumSize: const Size(150, 50),
                  foregroundColor: Colors.white,
                  backgroundColor: Colors.blue),
              onPressed: isAgreed == true
                  ? () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => const HomePage()));
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
