import { LegacyCard, HorizontalStack, Box, Card, TextField } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { DiscountAmountBtns } from './DiscountAmountBtns';
import React from 'react';

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

    return <HorizontalStack gap="4">
                <DiscountAmountBtns onChange={ onChangeDiscountType } />
                <TextField
                    label=""
                    type="number"
                    step={0.01}
                    value={value}
                    placeholder="0.00"
                    prefix={discountType == "0" ? "$" : ""}
                    suffix={discountType == "1" ? "%" : ""}
                    autoComplete="off"
                    onChange={ onChangeDiscountValue }
                />
            </HorizontalStack>
}