import React, { useRef } from 'react';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { SearchMinor } from '@shopify/polaris-icons';
import { AppliesTo } from '@shopify/discount-app-components';
import { VerticalStack, RadioButton, TextField, Button, HorizontalGrid, ResourceList, Icon, ResourceItem, Thumbnail, SkeletonThumbnail } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { BaseResource, Collection, Product, ResourceType, SelectAction, SelectPayload } from '@shopify/app-bridge/actions/ResourcePicker';

export function AppliesToChoices({ onChange = console.log, resource = 'all', prods = [], colls = [] }) {
    const [res, setRes] = useState(resource);
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>(prods)
    const [collections, setCollections] = useState<Collection[]>(colls)

    const handleChange = useCallback(
        (isSet, newValue) => {
            if (isSet) {
                let list: Product[] | Collection[] = []
                switch(newValue){
                    case 'products' :
                        list = products
                        break;
                    case 'collections' :
                        list = collections
                        break;    
                }
                setRes(newValue);
                onChange({ list, resource: newValue });
            }
        },
        [res],
    );

    const handleProductList = useCallback(
        (list, resource) => {
            setProducts(list)
            onChange({ list, resource })
            setOpen(false)
        },
        [products]
    )

    const handleCollectionList = useCallback(
        (list, resource) => {
            setCollections(list)
            onChange({ list, resource })
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
                            handleProductList(selectPayload.selection, 'products');
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
                            handleCollectionList(selectPayload.selection, 'collections');
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