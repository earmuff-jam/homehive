import { configureStore } from "@reduxjs/toolkit";
import { analyticsApi } from "features/Api/analyticsApi";
import { externalIntegrationsApi } from "features/Api/externalIntegrationsApi";
import { firebaseUserApi } from "features/Api/firebaseUserApi";
import { invoiceApi } from "features/Api/invoiceApi";
import { mapServiceApi } from "features/Api/mapServiceApi";
import { propertiesApi } from "features/Api/propertiesApi";
import { raspyApi } from "features/Api/raspyApi";
import { rentApi } from "features/Api/rentApi";
import { subscriptionApi } from "features/Api/subscriptionApi";
import { tenantsApi } from "features/Api/tenantsApi";

export const store = configureStore({
  reducer: {
    [firebaseUserApi.reducerPath]: firebaseUserApi.reducer,
    [propertiesApi.reducerPath]: propertiesApi.reducer,
    [tenantsApi.reducerPath]: tenantsApi.reducer,
    [rentApi.reducerPath]: rentApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,
    [mapServiceApi.reducerPath]: mapServiceApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [externalIntegrationsApi.reducerPath]: externalIntegrationsApi.reducer,
    [raspyApi.reducerPath]: raspyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      firebaseUserApi.middleware,
      propertiesApi.middleware,
      tenantsApi.middleware,
      rentApi.middleware,
      invoiceApi.middleware,
      mapServiceApi.middleware,
      analyticsApi.middleware,
      subscriptionApi.middleware,
      externalIntegrationsApi.middleware,
      raspyApi.middleware,
    ]),
});
