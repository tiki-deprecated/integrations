import { VerticalStack, TextField } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { AppliesToRadioBtns } from './AppliesToRadioBtns';
import { AppliesTo as Applies } from '@shopify/discount-app-components';
import React from 'react';

export function AppliesTo(onChange) {
    const [appliesTo, setAppliesTo] = useState(Applies.Products);

    const onChangeAppliesTo = useCallback(
        (index) => {
            console.log(index)
            setAppliesTo(index)
        },
        [appliesTo],
    );

    return <VerticalStack>
        <AppliesToRadioBtns onChange={onChangeAppliesTo} />
        { /* <AppliesToList /> */}
    </VerticalStack>


}