import {VerticalStack, RadioButton} from '@shopify/polaris';
import {useState, useCallback} from 'react';

export function PurchaseRadioBtns({ onChange, type = 'one-time' }) {
  const [type, setType] = useState(type);

  const handleChange = useCallback( (isSet, newValue) => {
    if(isSet){
        setType(newValue);        
        onChange(newValue);
    }
  },[type]);

  return (
    <VerticalStack>
      <RadioButton
        label="One-time purchase"
        checked={value === 'one-time'}
        id="one-time"
        name="one-time"
        onChange={handleChange}
      />
      <RadioButton
        label="Subscription"
        checked={value === 'subscription'}
        id="subscription"
        name="subscription"
        onChange={handleChange}
      />
      <RadioButton
        label="Both"
        checked={value === 'both'}
        id="both"
        name="both"
        onChange={handleChange}
      />
    </VerticalStack>
  );
}