/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { TextField } from "@shopify/polaris"
import { useState } from "react"

export function TitleAndDescription({onChange = console.log}){
    const [title, setTitle] = useState('')
    const [description, setDesc] = useState('')
    return (
        <>
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
        </>
    )
}