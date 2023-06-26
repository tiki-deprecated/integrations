import { LegacyCard, HorizontalStack, Box, Card, TextField } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { DiscountAmountBtns } from './DiscountAmountBtns';

export function DiscountAmount({ onChange = console.log }) {
    const [discountType, setDiscountType] = useState("amount");
    const [discountValue, setDiscountValue] = useState(0);

    const onChangeDiscountValue = useCallback(
        (value: number) => {
            setDiscountValue(value)
            onChange({ value })
        },
        [discountValue],
    );

    const onChangeDiscountType = useCallback(
        (type: "percent" | "amount") => {
            setDiscountType(type)
            onChange({ type })
        },
        [discountType],
    );

    return <HorizontalStack gap="4">
        <DiscountAmountBtns onChange={onChangeDiscountType} />
        <TextField
            label=""
            type="number"
            step={0.01}
            value={discountValue.toFixed(2)}
            placeholder="0.00"
            prefix={discountType == "amount" ? "$" : ""}
            suffix={discountType == "percent" ? "%" : ""}
            autoComplete="off"
            onChange={(value) => onChangeDiscountValue(Number(value))}
        />
    </HorizontalStack>
}