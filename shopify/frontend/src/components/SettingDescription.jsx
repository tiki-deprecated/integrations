import { VerticalStack, Text } from "@shopify/polaris"

export function SettingDescription({ title, description }) {
    return <VerticalStack gap="4">
        <Text as="h3" variant="headingMd">
            { title }
        </Text>
        <Text as="p" variant="bodyMd">
            { description }
        </Text>
    </VerticalStack>
}