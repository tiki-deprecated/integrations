import { HorizontalGrid, HorizontalStack, Box, Card, TextField } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { SettingDescription } from '../components/SettingDescription';
import { DiscountAmountBtns } from '../components/DiscountAmmountBtns';

export function DiscountAmount(){
  const [discountType, setDiscountType] = useState(0);
  
    const onChangeDiscountType = useCallback(
        (index) => {
            console.log(index)
            if (discountType === index) return;
              setDiscountType(index)
            },
            [discountType],
          );

    return <HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
        <Box as="section" paddingInlineStart={{ xs: 4, sm: 0 }} paddingInlineEnd={{ xs: 4, sm: 0 }} >
            <SettingDescription title="Discount Amount" description="Defines which type of discount will be used and what is the amount" />
        </Box>
        <Card roundedAbove="sm">
            <HorizontalStack gap="4">
                <DiscountAmountBtns onChange={ onChangeDiscountType } />
                <TextField
                    type="number"
                    placeholder="Discount value"
                    prefix={discountType == 0 ? "$" : ""}
                    suffix={discountType == 1 ? "%" : ""}
                    autoComplete="off"
                />
            </HorizontalStack>
        </Card>
    </HorizontalGrid>
}