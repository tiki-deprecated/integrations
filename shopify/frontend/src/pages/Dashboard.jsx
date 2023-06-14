import {Page, VerticalStack} from '@shopify/polaris';

export function Dashboard() {
    return <Page
    divider
    title="TIKI" 
    >
    <VerticalStack gap={{ xs: "8", sm: "4" }}>
        Hello TIKI
    </VerticalStack>
</Page>
}

