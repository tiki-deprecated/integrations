/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import 'package:app_tracking_transparency/app_tracking_transparency.dart';
import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
        child: ElevatedButton(
            onPressed: () async {
              final TrackingStatus status =
                  await AppTrackingTransparency.requestTrackingAuthorization();
              if (status == TrackingStatus.authorized) {
                String idfa =
                    await AppTrackingTransparency.getAdvertisingIdentifier();
                print('idfa: $idfa');
              }
            },
            child: const Text("Request IDFA")));
  }
}
