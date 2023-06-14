import enTranslations from '@shopify/polaris/locales/en.json';
import { useBreakpoints } from '@shopify/polaris';
import { OrderDiscountPage } from './pages/OrderDiscount';
import { PureTestProvider } from './providers/PureTestProvider';
import { ProductDiscountPage } from './pages/ProductDiscount';
import "@shopify/polaris/build/esm/styles.css";

function App() {
    const { smUp } = useBreakpoints();
    return <PureTestProvider i18n={enTranslations}>
        <ProductDiscountPage smUp={ smUp } />
  </PureTestProvider>
}

export default App;
