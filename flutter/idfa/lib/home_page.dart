/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import 'package:flutter/material.dart';
import 'package:idfa/tiki_idfa.dart';

class HomePage extends StatelessWidget {
  final TikiIdfa tikiIdfa;

  const HomePage(this.tikiIdfa, {super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
        child: ElevatedButton(
            onPressed: () async {
              String? idfa = await tikiIdfa.request();
              print('idfa: $idfa');
            },
            child: const Text("Request IDFA")));
  }
}
