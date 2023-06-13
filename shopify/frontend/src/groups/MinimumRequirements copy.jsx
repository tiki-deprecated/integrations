import { HorizontalGrid, HorizontalStack, Box, Button, Card, ButtonGroup, TextField } from '@shopify/polaris';
import {useCallback, useState} from 'react';
import { SettingDescription } from '../components/SettingDescription';
import { EligibilityRadioBtns } from '../components/EligibilityRadioBtns';

export function CustomerEligibility(){
  const [customerEligibility, setCustomerEligibility] = useState(0);
  
    const onChangeCustomerEligibility = useCallback(
        (index) => {
            if (customerEligibility === index) return;
            setCustomerEligibility(index)
            },
            [customerEligibility],
          );

    return <HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
        <Box as="section" paddingInlineStart={{ xs: 4, sm: 0 }} paddingInlineEnd={{ xs: 4, sm: 0 }} >
            <SettingDescription title="Minimum Purchase Requirements" description="" />
        </Box>
        <Card roundedAbove="sm">
            <HorizontalStack gap="4">
                <EligibilityRadioBtns onChange={ onChangeCustomerEligibility } />
            </HorizontalStack>
        </Card>
    </HorizontalGrid>
}