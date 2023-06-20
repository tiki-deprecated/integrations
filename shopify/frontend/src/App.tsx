import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
  DiscountProvider,
} from "./components/providers";
import React from "react";
import HomePage from "./pages";
import OrderDiscount from "./pages/discount/order";
import ProductDiscount from "./pages/discount/product";

export default function App() {
  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <DiscountProvider>
            <QueryProvider>
              <Routes>
                <Route index element={<HomePage />} />
                <Route path="/discount/product" element={<ProductDiscount />} />
                <Route path="/discount/order" element={<OrderDiscount />} />
              </Routes> 
            </QueryProvider>
          </DiscountProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
