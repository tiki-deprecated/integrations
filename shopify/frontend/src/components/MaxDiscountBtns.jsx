import {useState, useCallback} from 'react';
import { TextField, ChoiceList } from '@shopify/polaris';

export function MaxDiscountBtns({ onChange, numericLimit = '', choiceList = ['none']}) {
    const [selected, setSelected] = useState(choiceList);
    const [textFieldValue, setTextFieldValue] = useState('');
  
    const handleChoiceListChange = useCallback(
      (value) => {
        setSelected(value)
        onChange({choice: value})
    },
      [selected],
    );
  
    const handleTextFieldChange = useCallback(
      (value) => {
        setTextFieldValue(value),
        onChange({numericLimit: value})
    },
      [textFieldValue],
    );
  
    const renderChildren = useCallback(
      (isSelected) =>
        isSelected && (
          <TextField
            label="limit"
            labelHidden
            onChange={handleTextFieldChange}
            value={textFieldValue}
            autoComplete="off"
          />
        ),
      [handleTextFieldChange, textFieldValue],
    );
    return (
        <ChoiceList
          allowMultiple
          title="Discount minimum requirements"
          choices={[
            {label: 'Limit to one use per customer', value: 'one_per_user'},
            {
              label: 'Limit number of times this discount can be used in total',
              value: 'number_limit',
              onChange: handleTextFieldChange,
              helpText: 'Total usage in the shop, by all users.',
              renderChildren,
            },
          ]}
          selected={selected}
          onChange={handleChoiceListChange}
        />
    );
}