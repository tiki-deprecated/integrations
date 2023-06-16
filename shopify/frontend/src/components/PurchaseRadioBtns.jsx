import {VerticalStack, RadioButton} from '@shopify/polaris';
import {useState, useCallback} from 'react';

export function PurchaseRadioBtns({ onChange, defaultType = 'one-time' }) {
  const [type, setType] = useState(defaultType);

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
        checked={type === 'one-time'}
        id="one-time"
        name="one-time"
        onChange={handleChange}
      />
      <RadioButton
        label="Subscription"
        checked={type === 'subscription'}
        id="subscription"
        name="subscription"
        onChange={handleChange}
      />
      <RadioButton
        label="Both"
        checked={type === 'both'}
        id="both"
        name="both"
        onChange={handleChange}
      />
    </VerticalStack>
  );
}