import {ButtonGroup, Button} from '@shopify/polaris';
import React from 'react';
import {useCallback, useState} from 'react';

export function DiscountAmountBtns({ onChange, type = "fixed" }) {
  const [activeButtonType, setActiveButtonType] = useState(type);

  const handleButtonClick = useCallback(
    (isSet, type) => {
        if(isSet){
            setActiveButtonType(type)
            onChange(type)
        }
    },
    [activeButtonType],
  );

  return (
    <ButtonGroup segmented>
      <Button
        pressed={activeButtonType === "fixed"}
        onClick={() => handleButtonClick }
      >
        Fixed $
      </Button>
      <Button
        pressed={activeButtonType === "percent"}
        onClick={() => handleButtonClick }
      >
        Percent %
      </Button>
    </ButtonGroup>
  );
}