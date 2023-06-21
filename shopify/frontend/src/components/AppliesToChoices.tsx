import { VerticalStack, TextField } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { AppliesToRadioBtns } from './AppliesToRadioBtns';
import { AppliesTo as Applies } from '@shopify/discount-app-components';
import React from 'react';

export function AppliesToChoices(onChange) {
    const [appliesTo, setAppliesTo] = useState(Applies.Products);

    const onChangeAppliesTo = useCallback(
        (applies) => {
            setAppliesTo(applies),
            onChange(applies)
        },
        [appliesTo],
    );

    return <VerticalStack>
        <AppliesToRadioBtns onChange={onChangeAppliesTo} />
        { /* <AppliesToList /> */}
    </VerticalStack>


}