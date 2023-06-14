import { VerticalStack, RadioButton } from '@shopify/polaris';
import { useState, useCallback } from 'react';

export function AppliesToRadioBtns({ onChange }) {
    const [value, setValue] = useState('all');

    const handleChange = useCallback(
        (_, newValue) => setValue(newValue),
        [],
    );

    return (
        <VerticalStack>
            <RadioButton
                label="All Products"
                checked={value === 'all'}
                id="all"
                name="all"
                onChange={handleChange}
            />
            <RadioButton
                label="Specific Products"
                checked={value === 'products'}
                id="products"
                name="products"
                onChange={handleChange}
            />
            <RadioButton
                label="Specific Collections"
                checked={value === 'collections'}
                id="collections"
                name="collections"
                onChange={handleChange}
            />

        </VerticalStack>
    );
}

//<ResourcePicker resourceType="Product" />