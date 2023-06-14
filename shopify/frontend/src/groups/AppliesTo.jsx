import { HorizontalGrid, HorizontalStack, Box, Button, Card, ButtonGroup, TextField } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { SettingDescription } from '../components/SettingDescription';
import { AppliesToRadioBtns } from '../components/AppliesToRadioBtns';

export function AppliesTo(){
  const [appliesTo, setAppliesTo] = useState(0);
  
    const onChangeAppliesTo = useCallback(
        (index) => {
            if (appliesTo === index) return;
            setAppliesTo(index)
            },
            [appliesTo],
          );

    return <HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
        <Box as="section" paddingInlineStart={{ xs: 4, sm: 0 }} paddingInlineEnd={{ xs: 4, sm: 0 }} >
            <SettingDescription title="Applies to" description="" />
        </Box>
        <Card roundedAbove="sm">
            <HorizontalStack gap="4">
                <AppliesToRadioBtns onChange={ onChangeAppliesTo } />
            </HorizontalStack>
        </Card>
    </HorizontalGrid>
}