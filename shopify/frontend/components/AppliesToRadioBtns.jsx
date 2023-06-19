import { AppliesTo } from '@shopify/discount-app-components';
import { VerticalStack, RadioButton, TextField, Button, HorizontalGrid } from '@shopify/polaris';
import React from 'react';
import { useState, useCallback } from 'react';

export function AppliesToRadioBtns({ onChange, resource = 'all', resourceList = [] }) {
    const [res, setRes] = useState(resource);
    const [resList, setResList] = useState(resourceList)

    const handleChange = useCallback(
        (isSet, newValue) => {
            if (isSet) {
                setRes(newValue);
                onChange({ resource: newValue });
            }
        },
        [res],
    );

    const handleListChange = useCallback(
        (newList) => {
            setResList(newList);
            onChange({ resourceList: newList });
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
                name={AppliesTo.Products}
                onChange={handleChange}
            />
            {res === 'products' ? (
                <HorizontalGrid gap="4" columns={['twoThirds', 'oneThird']}>
                    <TextField />
                    <Button onClick={() => console.log('open')}>
                        Browse
                    </Button>
                </HorizontalGrid>
            ) : ''
            }
            <RadioButton
                label="Specific Collections"
                checked={res === 'collections'}
                id="collections"
                name={AppliesTo.Collections}
                onChange={handleChange}
            />
            {res === 'collections' ? (
                <HorizontalGrid gap="4" columns={['twoThirds', 'oneThird']}>
                    <TextField />
                    <Button onClick={() => console.log('open')}>
                        Browse
                    </Button>
                </HorizontalGrid>
            ) : ''
            }
        </VerticalStack>
    );
}