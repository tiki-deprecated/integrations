import { AppProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import React from "react";

export function PolarisProvider({ children }) {
  return (
    <AppProvider i18n={translations} >
      {children}
    </AppProvider>
  );
}
