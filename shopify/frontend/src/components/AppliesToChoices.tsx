/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { ResourcePicker } from '@shopify/app-bridge-react';
import { SearchMinor } from '@shopify/polaris-icons';
import { AppliesTo } from '@shopify/discount-app-components';
import { RadioButton, TextField, Button, ResourceList, Icon, ResourceItem, Thumbnail, SkeletonThumbnail } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { BaseResource, Collection, Product, Resource, ResourceType, SelectAction, SelectPayload } from '@shopify/app-bridge/actions/ResourcePicker';

type ResourceOptions = 'all' | 'products' | 'collections'

export function AppliesToChoices({onChange = (list: Resource[], resource: ResourceOptions) => {return}}) {
    const [res, setRes] = useState('all');
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>()
    const [collections, setCollections] = useState<Collection[]>()

    const handleChange = useCallback(
        (isSet: boolean, newValue: ResourceOptions) => {
            if (isSet) {
                let list: Product[] | Collection[] = []
                switch(newValue){
                    case 'all':
                        list = []
                        break
                    case 'products' :
                        list = products ?? []
                        break
                    case 'collections' :
                        list = collections ?? []
                        break    
                }
                setRes(newValue)
                onChange( list, newValue );
            }
        },
        [res],
    );

    const handleProductList = useCallback(
        (list: Product[], resource: ResourceOptions) => {
            setProducts(list)
            onChange( list, resource )
            setOpen(false)
        },
        [products]
    )

    const handleCollectionList = useCallback(
        (list: Collection[], resource: ResourceOptions) => {
            setCollections(list)
            onChange( list, resource )
            setOpen(false)
        },
        [collections]
    )

    return (<>
            <RadioButton
            label="All Products"
            checked={res === 'all'}
            id="all"
            name="all"
            onChange={handleChange} /><RadioButton
                label="Specific Products"
                checked={res === 'products'}
                id="products"
                name={AppliesTo.Products}
                onChange={handleChange} />
            {res === 'products' ? (
                    <><TextField
            label=''
            autoComplete=''
            prefix={<Icon source={SearchMinor} />}
            placeholder="Search products"
            value={''}
            onFocus={() => setOpen(true)}
            connectedRight={<Button onClick={() => setOpen(true)}>Browse products</Button>} /><ResourcePicker
                resourceType='Product'
                open={open}
                onCancel={() => {
                    setOpen(false);
                } }
                initialSelectionIds={products as BaseResource[]}
                onSelection={(selectPayload: SelectPayload) => {
                    handleProductList(selectPayload.selection as Product[], 'products');
                } } /><ResourceList
                resourceName={{ singular: 'product', plural: 'products' }}
                items={products ?? []}
                renderItem={(product: Product) => {
                    const { id, title } = product;
                    const media = product.images[0];

                    return (
                        <ResourceItem
                            id={id}
                            url="#"
                            media={<Thumbnail
                                source={media.originalSrc}
                                alt={media.altText ?? ""} />}
                            accessibilityLabel={`${title}`}
                        >
                            {title}
                        </ResourceItem>
                    );
                } } /></>
            ) : ''
            }
            <RadioButton
                label="Specific Collections"
                checked={res === 'collections'}
                id="collections"
                name={AppliesTo.Collections}
                onChange={handleChange}
            />
            {res === 'collections' ? (
                    <><TextField
            label=''
            autoComplete=''
            prefix={<Icon source={SearchMinor} />}
            placeholder="Search products"
            value={''}
            onFocus={() => setOpen(true)}
            connectedRight={<Button onClick={() => setOpen(true)}>Browse products</Button>} /><ResourcePicker
                resourceType='Collection'
                open={open}
                onCancel={() => {
                    setOpen(false);
                } }
                initialSelectionIds={collections as BaseResource[]}
                onSelection={(selectPayload: SelectPayload) => {
                    handleCollectionList(selectPayload.selection as Collection[], 'collections');
                } } /><ResourceList
                resourceName={{ singular: 'collection', plural: 'collections' }}
                items={collections ?? []}
                renderItem={(collection: Collection) => {
                    const { id, title } = collection;
                    const media = collection.image;

                    return (
                        <ResourceItem
                            id={id}
                            url="#"
                            media={media ? <Thumbnail
                                source={media.originalSrc}
                                alt={media.altText ?? ""} /> : <SkeletonThumbnail />}
                            accessibilityLabel={`${title}`}
                        >
                            {title}
                        </ResourceItem>
                    );
                } } /></>
            ) : ''
            }
            </>);
}