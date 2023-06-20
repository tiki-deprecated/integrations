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

export default function App() {
  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <DiscountProvider>
            <QueryProvider>
              <Routes>
                <Route index element={<HomePage />} />
              </Routes> 
            </QueryProvider>
          </DiscountProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
