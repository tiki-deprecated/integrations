import { VerticalStack, RadioButton } from '@shopify/polaris';
import { useState, useCallback } from 'react';

export function AppliesToRadioBtns({ onChange, resource = 'all', resourceList = [] }) {
    const [res, setRes] = useState(resource);
    const [resList, setResList] = useState(resourceList)

    const handleChange = useCallback(
        (isSet, newValue) => {
            if(isSet){
                setRes(newValue),
                onChange({resource: newValue})
            }
        },
        [res],
    );

    const handleListChange = useCallback(
        (newList) => {
            if(isSet){
                setResList(newList),
                onChange({resourceList: newList})
            }
        },
        [resList],
    );

    return (
        <VerticalStack>
            <RadioButton
                label="All Products"
                checked={res === 'all'}
                id="all"
                name="all"
                onChange={handleChange}
            />
            <RadioButton
                label="Specific Products"
                checked={res === 'products'}
                id="products"
                name="products"
                onChange={handleChange}
            />
            { /* value === 'products' ? <ResourcePicker resource="products" /> : '' */ }
            <RadioButton
                label="Specific Collections"
                checked={res === 'collections'}
                id="collections"
                name="collections"
                onChange={handleChange}
            />
            { /* value === 'collections' ? <ResourcePicker resource="collections" /> : ' */ }
        </VerticalStack>
    );
}