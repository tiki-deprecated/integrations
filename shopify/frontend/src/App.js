import enTranslations from '@shopify/polaris/locales/en.json';
import { useBreakpoints } from '@shopify/polaris';
import { OrderDiscountPage } from './pages/OrderDiscount';
import { PureTestProvider } from './providers/PureTestProvider';
import { ProductDiscountPage } from './pages/ProductDiscount';
import { Route, Routes } from 'react-router';
import { Dashboard } from './pages/Dashboard';

import "@shopify/polaris/build/esm/styles.css";

function App() {
    const { smUp } = useBreakpoints();
    return (
      <PureTestProvider i18n={enTranslations}>
        <Routes>
          <Route path="/ui" element={<Dashboard />} />
          <Route
            path="/ui/discounts/product"
            element={<ProductDiscountPage smUp={ smUp } />}
              />
          <Route
              path="/ui/discounts/order"
              element={<OrderDiscountPage smUp={ smUp } />}
          />
        </Routes>
      </PureTestProvider>
    )
}

export default App;
