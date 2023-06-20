import React from 'react';
import {ChoiceList} from '@shopify/polaris';
import { PurchaseType, Field, PurchaseTypeCardProps } from '@shopify/discount-app-components';

export function PurchaseTypeSection ({purchaseType}: PurchaseTypeCardProps) {
  return (
      <ChoiceList
        title='Purchase Type'
        titleHidden
        selected={[purchaseType.value]}
        choices={[
          {
            label: 'One Time',
            value: PurchaseType.OneTimePurchase,
          },
          {
            label: 'Subscription',
            value: PurchaseType.Subscription,
          },
          {
            label: 'Both',
            value: PurchaseType.Both,
          },
        ]}
        onChange={(purchaseTypeList) => {
          purchaseType.onChange(purchaseTypeList[0] as PurchaseType);
        }}
      />
  );
}