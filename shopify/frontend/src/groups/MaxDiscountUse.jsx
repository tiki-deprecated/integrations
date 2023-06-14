import { HorizontalGrid, HorizontalStack, Box, Card} from '@shopify/polaris';
import { SettingDescription } from '../components/SettingDescription';
import { MaxDiscountBtns } from '../components/MaxDiscountBtns';

export function MaxDiscountUse(){

    return <HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
        <Box as="section" paddingInlineStart={{ xs: 4, sm: 0 }} paddingInlineEnd={{ xs: 4, sm: 0 }} >
            <SettingDescription title="Maximum Discount uses" description="" />
        </Box>
        <Card roundedAbove="sm">
            <HorizontalStack gap="4">
                <MaxDiscountBtns />
            </HorizontalStack>
        </Card>
    </HorizontalGrid>
}