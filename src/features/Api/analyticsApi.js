import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
    getCurrentIPAddress: builder.query({
      query: () => {
        return `/json`;
      },
      transformResponse: (response) => {
        // removing un-used values
        const requiredValues = {
          ipAddress: response.ip,
          city: response.city,
          country: response.country_name,
        };
        localStorage.setItem("ip", JSON.stringify(requiredValues));
      },
    }),
  }),
});

export const { useGetCurrentIPAddressQuery } = analyticsApi;
