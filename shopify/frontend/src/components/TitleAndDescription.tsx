import { TextField, VerticalStack } from "@shopify/polaris"
import React, { useState } from "react"

export function TitleAndDescription({onChange}){
    const [title, setTitle] = useState('')
    const [description, setDesc] = useState('')
    return (
        <VerticalStack gap="2">
            <TextField
            label='Discount Title'
            autoComplete=''
            value={title}
            onChange={(value) => {
                setTitle(value)
                onChange({
                    title: value,
                    description
                })
            } } />
            <TextField
                label='Description'
                autoComplete=''
                value={description}
                onChange={(value) => {
                    setDesc(value)
                    onChange({
                        title,
                        description: value
                    })
                } } />
        </VerticalStack>
    )
}