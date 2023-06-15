import ShopifyDiscountMetafields from './shopify-discount-metafields'
import ShopifyCombinesWith from './shopify-combines-with'
export default interface ShopifyDiscountOptions{
    discountType: string;
    title: string;
    description: string;
    startsAt: Date;
    combinesWith: ShopifyCombinesWith;
    metaFields: ShopifyDiscountMetafields;
    endsAt: string;
    id: string;
} 







