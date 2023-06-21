import {ButtonGroup, Button} from '@shopify/polaris';
import React from 'react';
import {useCallback, useState} from 'react';

export function DiscountAmountBtns({ onChange }) {
  const [activeButtonType, setActiveButtonType] = useState('amount');

  const handleButtonClick = useCallback(
    (type: string) => {
        setActiveButtonType(type)
        onChange(type)
    },
    [activeButtonType],
  );

  return (
    <ButtonGroup segmented>
      <Button
        pressed={activeButtonType === "amount"}
        onClick={() => {
            handleButtonClick("amount")
         }
        }
      >
        Fixed $
      </Button>
      <Button
        pressed={activeButtonType === "percent"}
        onClick={() => {
            handleButtonClick("percent")
         }
        }
      >
        Percent %
      </Button>
    </ButtonGroup>
  );
}