import { VerticalStack, RadioButton } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import MinAmountTextField from './MinAmountTextField';
import MinQtyTextField from './MinQtyTextField';

export function MinReqRadioBtns({ onChange }) {
    const [value, setValue] = useState('all');

    const handleChange = useCallback(
        (_, newValue) => setValue(newValue),
        [],
    );

    return (
        <VerticalStack>
            <RadioButton
                label="No minimum requirements"
                checked={value === 'none'}
                id="none"
                name="none"
                onChange={handleChange}
            />
            <RadioButton
                label="Minimum purchase amount ($)"
                checked={value === 'min-amount'}
                id="min-amount"
                name="min-amount"
                onChange={handleChange}
            />
            {value === 'min-amount' ? <MinAmountTextField /> : ''}
            <RadioButton
                label="Minimum Quantity"
                checked={value === 'min-qty'}
                id="min-qty"
                name="min-qty"
                onChange={handleChange}
            />
            {value === 'min-qty' ? <MinQtyTextField /> : ''}
        </VerticalStack>
    );
}
