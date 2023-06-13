import { VerticalStack, RadioButton, TextField } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import MinAmountTextField from './MinAmountTextField';
import MinQtyTextField from './MinQtyTextField';

export function EligibilityRadioBtns({ onChange }) {
    const [value, setValue] = useState('all');

    const handleChange = useCallback(
        (_, newValue) => setValue(newValue),
        [],
    );

    return (
        <VerticalStack>
            <RadioButton
                label="All Customers"
                checked={value === 'all'}
                id="noallne"
                name="all"
                onChange={handleChange}
            />
            <RadioButton
                label="Specific Customer segments"
                checked={value === 'segments'}
                id="segments"
                name="segments"
                onChange={handleChange}
            />
            {value === 'segments' ? <MinAmountTextField /> : ''}
            <RadioButton
                label="Specific Customers"
                checked={value === 'customers'}
                id="customers"
                name="customers"
                onChange={handleChange}
            />
            {value === 'customers' ? <MinQtyTextField /> : ''}
        </VerticalStack>
    );
}
