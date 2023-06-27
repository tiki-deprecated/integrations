/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

import { BrowserRouter } from "react-router-dom";
import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
  DiscountProvider,
} from "./components/providers";
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
