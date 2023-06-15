import { TextField } from "@shopify/polaris"
import { useState, useCallback } from "react";

export default function MinQtyTextField({onChange, minQty=0}){

    const [value, setValue] = useState(minQty);

    const handleTextFieldChange = useCallback(
        (newValue) =>{
             setValue(newValue);
             onChange(newValue);
        },
        [value],
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