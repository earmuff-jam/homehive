import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TIpApiResponse, TRequiredIpValues } from "src/types";

export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://ipapi.co/",
    prepareHeaders: (headers) => {
      headers.set("User-Agent", "homehivesolutions");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // getCurrentIPAddress ...
    // builder function to get current ip address
    getCurrentIPAddress: builder.query<TRequiredIpValues, void>({
      query: () => "/json",
      transformResponse: (response: TIpApiResponse): TRequiredIpValues => {
        const filteredValues = {
          ipAddress: response.ip,
          city: response.city,
          country: response.country_name,
        };
        localStorage.setItem("ip", JSON.stringify(filteredValues));
        return filteredValues;
      },
    }),
  }),
});

export const { useGetCurrentIPAddressQuery } = analyticsApi;
