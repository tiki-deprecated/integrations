import { TextField } from "@shopify/polaris"
import { useState, useCallback } from "react";

export default function MinAmountTextField({ onChange, minAmount}){

    const [value, setValue] = useState(minAmount);

    const handleTextFieldChange = useCallback(
        (newValue) => {
            setValue(newValue)
            onChange(newValue)
        },
        [value],
    );

    return <TextField
    label="Minimum total order value."
    type="number"
    step="1"
    value={value}
    onChange={handleTextFieldChange}
    helpText="Applies to all products."
  />

}