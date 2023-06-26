import { AppProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import React from "react";

export function PolarisProvider(props: { children: React.ReactNode }) {
  return (
    <AppProvider i18n={translations} >
      {props.children}
    </AppProvider>
  );
}
