import { VerticalStack, RadioButton } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import MinAmountTextField from './MinAmountTextField';
import MinQtyTextField from './MinQtyTextField';

export function MinReqRadioBtns({ onChange, minQty = 0, minAmount= 0, minReq = 'all' }) {
    const [value, setValue] = useState(minReq);

    const handleChange = useCallback(
        (_, newValue) => {
            setValue(newValue)
            onChange({minReq})
        },[],
    );

    const handleMinQtyChange = (minQty) => {
        onChange({minQty})
    }

    const handleMinAmountChange = (minAmount) => {
        onChange({minAmount})
    }

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
            {value === 'min-amount' ? <MinAmountTextField onChange={ hanldeMinAmountChange } minQty={ minAmount } /> : ''}
            <RadioButton
                label="Minimum Quantity"
                checked={value === 'min-qty'}
                id="min-qty"
                name="min-qty"
                onChange={handleChange}
            />
            {value === 'min-qty' ? 
             <MinQtyTextField onChange={ handleMinQtyChange } minQty={ minQty }  /> : ''}
        </VerticalStack>
    );
}
