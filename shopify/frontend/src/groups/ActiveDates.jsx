import {VerticalStack, HorizontalGrid, Box, Text, Card, TextField} from '@shopify/polaris';

export function PurchaseType() {
    return <HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
        <Box
        as="section"
        paddingInlineStart={{ xs: 4, sm: 0 }}
        paddingInlineEnd={{ xs: 4, sm: 0 }}
        >
        <VerticalStack gap="4">
            <Text as="h3" variant="headingMd">
            Dimensions
            </Text>
            <Text as="p" variant="bodyMd">
            Interjambs are the rounded protruding bits of your puzzlie piece
            </Text>
        </VerticalStack>
        </Box>
        <Card roundedAbove="sm">
        <VerticalStack gap="4">
            <TextField label="Horizontal" />
            <TextField label="Interjamb ratio" />
        </VerticalStack>
        </Card>
    </HorizontalGrid>
}