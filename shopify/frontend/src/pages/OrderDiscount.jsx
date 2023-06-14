import { AppliesTo } from "../groups/AppliesTo";
import { DiscountAmount } from "../groups/DiscountAmount";
import { MaxDiscountUse } from "../groups/MaxDiscountUse";
import { MinimumRequirements } from "../groups/MinimumRequirements";
import { PurchaseType } from "../groups/PurchaseType";
import {Page, VerticalStack, Divider} from '@shopify/polaris';

const saveDiscountData = () => {
    console.log("savedata")
}

export function OrderDiscountPage({ smUp }) {
    return <Page
    divider
    title="Order Discount" 
    primaryAction={{ 
        content: "Save",
        onAction: saveDiscountData
    }}
    >
    <VerticalStack gap={{ xs: "8", sm: "4" }}>
        < DiscountAmount />
        {smUp ? <Divider /> : null}
        < PurchaseType />
        {smUp ? <Divider /> : null}
        < AppliesTo />
        {smUp ? <Divider /> : null}
        < MinimumRequirements />
        {smUp ? <Divider /> : null}
        < MaxDiscountUse />
    </VerticalStack>
</Page>
}

