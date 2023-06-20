import { LegacyCard, HorizontalStack, Box, Card, TextField } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { DiscountAmountBtns } from './DiscountAmountBtns';
import React from 'react';

export function DiscountAmount({onChange, type ="fixed", value=0.00}){
  const [discountType, setDiscountType] = useState(type);
  const [discountValue, setDiscountValue] = useState(value);

    const onChangeDiscountValue = useCallback(
        (value: number) => {
            console.log(value)
            if (discountValue === value) return;
            setDiscountValue(value)
            onChange({value: discountValue})
        },
        [discountType],
    );

    const onChangeDiscountType = useCallback(
        (type: "percent" | "fixed" ) => {
            console.log(type)
            if (discountType === type) return;
            setDiscountType(type)
            onChange({type: discountType})
        },
        [discountType],
    );

    return <HorizontalStack gap="4">
                <DiscountAmountBtns onChange={ onChangeDiscountType } />
                <TextField
                    label=""
                    type="number"
                    step={0.01}
                    value={discountValue.toFixed(2)}
                    placeholder="0.00"
                    prefix={discountType == "0" ? "$" : ""}
                    suffix={discountType == "1" ? "%" : ""}
                    autoComplete="off"
                    onChange={ (value) => onChangeDiscountValue(Number(value)) }
                />
            </HorizontalStack>
}