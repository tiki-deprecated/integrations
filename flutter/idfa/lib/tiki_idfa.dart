/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import 'dart:convert';

import 'package:app_settings/app_settings.dart';
import 'package:app_tracking_transparency/app_tracking_transparency.dart';
import 'package:tiki_sdk_flutter/main.dart';

class TikiIdfa {
  final String source;
  final String backend;
  late final TikiSdk tiki;

  TikiIdfa(String userId, this.backend) : source = '${userId}_idfa';

  Future<TikiIdfa> init(String address) async {
    tiki = await (TikiSdkFlutterBuilder()
          ..apiId('b213d6bd-ccff-45c2-805e-4f0062d4ad5e')
          ..origin('com.mytiki.example_idfa')
          ..address(address))
        .build();

    OwnershipModel? ownership = tiki.getOwnership(source);
    ConsentModel? consent = tiki.getConsent(source);
    if (ownership != null &&
        consent != null &&
        ownership.contains.contains('IDFA') &&
        consent.destination.paths.contains(backend)) {
      final TrackingStatus status =
          await AppTrackingTransparency.requestTrackingAuthorization();
      if (status != TrackingStatus.authorized) {
        List<String> paths = consent.destination.paths;
        paths.remove(backend);
        String oid = base64UrlEncode(ownership.transactionId!);
        await tiki.modifyConsent(
            oid, TikiSdkDestination(paths, uses: consent.destination.uses));
      }
    }
    return this;
  }

  Future<String?> request() async {
    // show popup

    OwnershipModel? ownership = tiki.getOwnership(source);
    String oid;
    if (ownership == null) {
      oid = await tiki
          .assignOwnership(source, TikiSdkDataTypeEnum.point, ['IDFA']);
    } else {
      oid = base64UrlEncode(ownership.transactionId!);
    }

    ConsentModel? consent = tiki.getConsent(source);
    final TrackingStatus status =
        await AppTrackingTransparency.requestTrackingAuthorization();

    if (status == TrackingStatus.authorized) {
      if (consent == null || !consent.destination.paths.contains(backend)) {
        List<String> paths = consent?.destination.paths ?? [];
        paths.add(backend);
        TikiSdkDestination destination =
            TikiSdkDestination(paths, uses: consent?.destination.uses ?? []);
        tiki.modifyConsent(oid, destination);
      }
      return await AppTrackingTransparency.getAdvertisingIdentifier();
    } else {
      if (consent == null || consent.destination.paths.contains(backend)) {
        List<String> paths = consent?.destination.paths ?? [];
        paths.remove(backend);
        TikiSdkDestination destination =
            TikiSdkDestination(paths, uses: consent?.destination.uses ?? []);
        tiki.modifyConsent(oid, destination);
      }
      await AppSettings.openAppSettings();
    }
  }
}
