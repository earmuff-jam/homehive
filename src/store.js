import { configureStore } from "@reduxjs/toolkit";
import { analyticsApi } from "features/Api/analyticsApi";
import { etssTokenApi } from "features/Api/etssTokenApi";
import { externalIntegrationMultipart } from "features/Api/externalIntegrationMultipart";
import { externalIntegrationsApi } from "features/Api/externalIntegrationsApi";
import { firebaseStorageApi } from "features/Api/firebaseStorageApi";
import { firebaseUserApi } from "features/Api/firebaseUserApi";
import { invoiceApi } from "features/Api/invoiceApi";
import { maintenanceApi } from "features/Api/maintenanceApi";
import { mapAmenitiesApi } from "features/Api/mapAmenitiesApi";
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
    [maintenanceApi.reducerPath]: maintenanceApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,
    [mapServiceApi.reducerPath]: mapServiceApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [etssTokenApi.reducerPath]: etssTokenApi.reducer,
    [externalIntegrationsApi.reducerPath]: externalIntegrationsApi.reducer,
    [raspyApi.reducerPath]: raspyApi.reducer,
    [externalIntegrationMultipart.reducerPath]:
      externalIntegrationMultipart.reducer,
    [mapAmenitiesApi.reducerPath]: mapAmenitiesApi.reducer,
    [firebaseStorageApi.reducerPath]: firebaseStorageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      firebaseUserApi.middleware,
      propertiesApi.middleware,
      tenantsApi.middleware,
      rentApi.middleware,
      maintenanceApi.middleware,
      invoiceApi.middleware,
      mapServiceApi.middleware,
      analyticsApi.middleware,
      subscriptionApi.middleware,
      etssTokenApi.middleware,
      externalIntegrationsApi.middleware,
      raspyApi.middleware,
      externalIntegrationMultipart.middleware,
      mapAmenitiesApi.middleware,
      firebaseStorageApi.middleware,
    ]),
});
