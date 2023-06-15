import { HorizontalGrid, HorizontalStack, Box, Card, TextField } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { SettingDescription } from '../components/SettingDescription';
import { DiscountAmountBtns } from '../components/DiscountAmmountBtns';

export function DiscountAmount({onChange, type = "fixed", value="0.00"}){
  const [discountType, setDiscountType] = useState(type);
  const [discountValue, setDiscountValue] = useState(value);

    const onChangeDiscountValue = useCallback(
        (value) => {
            if (discountType === value) return;
            setDiscountType(value)
            onChange({value})
        },
        [discountType],
    );

    const onChangeDiscountType = useCallback(
        (type) => {
            if (discountType === type) return;
            setDiscountValue(type)
            onChange({type})
        },
        [discountValue],
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
                    step="0.01"
                    value={value}
                    placeholder="0.00"
                    prefix={discountType == 0 ? "$" : ""}
                    suffix={discountType == 1 ? "%" : ""}
                    autoComplete="off"
                    onChange={ onChangeDiscountValue }
                />
            </HorizontalStack>
        </Card>
    </HorizontalGrid>
}