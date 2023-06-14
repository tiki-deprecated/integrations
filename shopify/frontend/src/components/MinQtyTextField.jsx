import { TextField } from "@shopify/polaris"
import { useState, useCallback } from "react";

export default function MinQtyTextField(){

    const [value, setValue] = useState('1');

    const handleTextFieldChange = useCallback(
        (_, newValue) => setValue(newValue),
        [],
    );

    return <TextField
    label="Minimum quantity of items in the order."
    type="number"
    step="1"
    value={value}
    onChange={handleTextFieldChange}
    helpText="Applies to all products."
  />
}