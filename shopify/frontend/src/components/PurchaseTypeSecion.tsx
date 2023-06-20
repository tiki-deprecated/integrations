import React, { useState } from 'react';
import {ChoiceList} from '@shopify/polaris';
import { PurchaseType } from '@shopify/discount-app-components';

export function PurchaseTypeSection ({purchaseType = PurchaseType.OneTimePurchase, onChange}) {
  const [type, setType] = useState(purchaseType);
  const setPurchaseType = (purchaseTypeList) => {
    setType(purchaseTypeList[0] as PurchaseType);
    onChange(purchaseTypeList[0])
  }
  return (
      <ChoiceList
        title='Purchase Type'
        titleHidden
        selected={[type as PurchaseType]}
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
        onChange={ setPurchaseType }
      />
  );
}
