import { HorizontalGrid, HorizontalStack, Box, Button, Card, ButtonGroup, TextField } from '@shopify/polaris';
import {useCallback, useState} from 'react';
import { SettingDescription } from '../components/SettingDescription';
import { PurchaseRadioBtns } from '../components/PurchaseRadioBtns';

export function PurchaseType(onChange){
  const [purchaseType, setPurchaseType] = useState(0);
  
    const onChangePurchaseType = useCallback(
        (index) => {
            if (purchaseType === index) return;
            setPurchaseType(index)
            },
            [purchaseType],
          );

    return <HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
        <Box as="section" paddingInlineStart={{ xs: 4, sm: 0 }} paddingInlineEnd={{ xs: 4, sm: 0 }} >
            <SettingDescription title="Purchase Type" description="" />
        </Box>
        <Card roundedAbove="sm">
            <HorizontalStack gap="4">
                <PurchaseRadioBtns onChange={ onChangePurchaseType } />
            </HorizontalStack>
        </Card>
    </HorizontalGrid>
}