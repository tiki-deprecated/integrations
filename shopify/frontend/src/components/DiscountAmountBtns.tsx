import {ButtonGroup, Button} from '@shopify/polaris';
import React from 'react';
import {useCallback, useState} from 'react';

export function DiscountAmountBtns({ onChange, type = "percent" }) {
  const [activeButtonType, setActiveButtonType] = useState(type);

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
        pressed={activeButtonType === "fixed"}
        onClick={() => {
            handleButtonClick("fixed")
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