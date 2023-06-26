import React, { useRef } from 'react';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { SearchMinor } from '@shopify/polaris-icons';
import { AppliesTo } from '@shopify/discount-app-components';
import { VerticalStack, RadioButton, TextField, Button, HorizontalGrid, ResourceList, Icon, ResourceItem, Thumbnail, SkeletonThumbnail } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { BaseResource, Collection, Product, Resource, ResourceType, SelectAction, SelectPayload } from '@shopify/app-bridge/actions/ResourcePicker';

type ResourceOptions = 'all' | 'products' | 'collections'

export interface AppliesToChoicesProps{
    onChange: (list: Array<Resource>, resource: ResourceOptions) => void
    resource: ResourceOptions
    prods: Array<Product>
    colls: Array<Collection>
}

export function AppliesToChoices(props: AppliesToChoicesProps) {
    const [res, setRes] = useState(props.resource);
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>(props.prods)
    const [collections, setCollections] = useState<Collection[]>(props.colls)
    const onChange = props.onChange

    const handleChange = useCallback(
        (isSet: boolean, newValue: ResourceOptions) => {
            if (isSet) {
                let list: Product[] | Collection[] = []
                switch(newValue){
                    case 'all':
                        list = []
                        break
                    case 'products' :
                        list = products
                        break
                    case 'collections' :
                        list = collections
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

    return (
        <VerticalStack>
            <RadioButton
                label="All Products"
                checked={res === 'all'}
                id="all"
                name="all"
                onChange={handleChange}
            />
            <RadioButton
                label="Specific Products"
                checked={res === 'products'}
                id="products"
                name={AppliesTo.Products}
                onChange={handleChange}
            />
            {res === 'products' ? (
                <VerticalStack>
                    <TextField
                        label=''
                        autoComplete=''
                        prefix={<Icon source={SearchMinor} />}
                        placeholder="Search products"
                        value={''}
                        onFocus={() => setOpen(true)}
                        connectedRight={<Button onClick={() => setOpen(true)}>Browse products</Button>}
                    />
                    <ResourcePicker
                        resourceType='Product'
                        open={open}
                        onCancel={() => {
                            setOpen(false)
                        }}
                        initialSelectionIds={products as BaseResource[]}
                        onSelection={(selectPayload: SelectPayload) => {
                            handleProductList(selectPayload.selection as Product[], 'products');
                        }}
                    />
                    <ResourceList
                        resourceName={{ singular: 'product', plural: 'products' }}
                        items={products}
                        renderItem={(product: Product) => {
                            const { id, title } = product;
                            const media = product.images[0];

                            return (
                                <ResourceItem
                                    id={id}
                                    url="#"
                                    media={<Thumbnail
                                        source={media.originalSrc}
                                        alt={media.altText ?? ""}
                                    />}
                                    accessibilityLabel={`${title}`}
                                >
                                    {title}
                                </ResourceItem>
                            );
                        }}
                    />
                </VerticalStack>
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
                <VerticalStack>
                    <TextField
                        label=''
                        autoComplete=''
                        prefix={<Icon source={SearchMinor} />}
                        placeholder="Search products"
                        value={''}
                        onFocus={() => setOpen(true)}
                        connectedRight={<Button onClick={() => setOpen(true)}>Browse products</Button>}
                    />
                    <ResourcePicker
                        resourceType='Collection'
                        open={open}
                        onCancel={() => {
                            setOpen(false)
                        }}
                        initialSelectionIds={collections as BaseResource[]}
                        onSelection={(selectPayload: SelectPayload) => {
                            handleCollectionList(selectPayload.selection as Collection[], 'collections');
                        }}
                    />
                    <ResourceList
                        resourceName={{ singular: 'collection', plural: 'collections' }}
                        items={collections}
                        renderItem={(collection: Collection) => {
                            const { id, title } = collection;
                            const media = collection.image;

                            return (
                                <ResourceItem
                                    id={id}
                                    url="#"
                                    media={media ? <Thumbnail
                                        source={media.originalSrc}
                                        alt={media.altText ?? ""}
                                    /> : <SkeletonThumbnail />}
                                    accessibilityLabel={`${title}`}
                                >
                                    {title}
                                </ResourceItem>
                            );
                        }}
                    />
                </VerticalStack>
            ) : ''
            }
        </VerticalStack>
    );
}