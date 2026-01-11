import { configureStore } from "@reduxjs/toolkit";
import { analyticsApi } from "features/Api/analyticsApi";
import { externalIntegrationsApi } from "features/Api/externalIntegrationsApi";
import { firebaseUserApi } from "features/Api/firebaseUserApi";
import { invoiceApi } from "features/Api/invoiceApi";
import { mapServiceApi } from "features/Api/mapServiceApi";
import { propertiesApi } from "features/Api/propertiesApi";
import { rentApi } from "features/Api/rentApi";
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
    [externalIntegrationsApi.reducerPath]: externalIntegrationsApi.reducer,
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
      externalIntegrationsApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
