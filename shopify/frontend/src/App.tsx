import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
  DiscountProvider,
} from "./components/providers";
import { HomePage, OrderDiscount, ProductDiscount } from "./pages";
import { DiscountReq } from "./interface/discount-req";
import { useAuthenticatedFetch } from "./hooks/useAuthenticatedFetch"
import { AppRouter } from "./components/AppRouter";

export default function App() {

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <DiscountProvider>
            <QueryProvider>
              <AppRouter />
            </QueryProvider>
          </DiscountProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
