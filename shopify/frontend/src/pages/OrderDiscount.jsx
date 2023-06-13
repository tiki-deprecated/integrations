import { DiscountAmount } from "../groups/DiscountAmount";
import { PurchaseType } from "../groups/PurchaseType";
import {Page, VerticalStack, Divider} from '@shopify/polaris';

export function OrderDiscountPage({ smUp }) {
    return <Page
    divider
    primaryAction={{ content: "View on your store", disabled: true }}
    secondaryActions={[
    {
        content: "Duplicate",
        accessibilityLabel: "Secondary action label",
        onAction: () => alert("Duplicate action"),
    },
    ]}>
    <VerticalStack gap={{ xs: "8", sm: "4" }}>
        < DiscountAmount />
        {smUp ? <Divider /> : null}
        < PurchaseType />
    </VerticalStack>
</Page>
}

