import {ButtonGroup, Button} from '@shopify/polaris';
import {useCallback, useState} from 'react';

export function DiscountAmountBtns({ onChange }) {
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);

  const handleButtonClick = useCallback(
    (index) => {
      if (activeButtonIndex === index) return;
      setActiveButtonIndex(index)
      onChange(index)
    },
    [activeButtonIndex],
  );

  return (
    <ButtonGroup segmented>
      <Button
        pressed={activeButtonIndex === 0}
        onClick={() => handleButtonClick(0)}
      >
        Fixed $
      </Button>
      <Button
        pressed={activeButtonIndex === 1}
        onClick={() => handleButtonClick(1)}
      >
        Percent %
      </Button>
    </ButtonGroup>
  );
}