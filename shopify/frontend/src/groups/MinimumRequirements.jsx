import { HorizontalGrid, HorizontalStack, Box, Button, Card, ButtonGroup, TextField } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { SettingDescription } from '../components/SettingDescription';
import { MinReqRadioBtns } from '../components/MinReqRadioBtns';

export function MinimumRequirements(){
  const [minimumRequirements, setMinimumRequirements] = useState(0);
  
    const onChangeMinimumRequirements = useCallback(
        (index) => {
            if (minimumRequirements === index) return;
            setMinimumRequirements(index)
            },
            [minimumRequirements],
          );

    return <HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
        <Box as="section" paddingInlineStart={{ xs: 4, sm: 0 }} paddingInlineEnd={{ xs: 4, sm: 0 }} >
            <SettingDescription title="Minimum Purchase Requirements" description="" />
        </Box>
        <Card roundedAbove="sm">
            <HorizontalStack gap="4">
                <MinReqRadioBtns onChange={ onChangeMinimumRequirements } />
            </HorizontalStack>
        </Card>
    </HorizontalGrid>
}