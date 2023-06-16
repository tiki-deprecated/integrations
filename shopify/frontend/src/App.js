import enTranslations from '@shopify/polaris/locales/en.json';
import { useBreakpoints } from '@shopify/polaris';
import { AppProvider } from "@shopify/polaris"
import DiscountPage from './pages/Discount.tsx'
import "@shopify/polaris/build/esm/styles.css";

function App() {
    const { smUp } = useBreakpoints();
    return (
      <AppProvider>
        <DiscountPage />
      </AppProvider>
    )
}

export default App;
