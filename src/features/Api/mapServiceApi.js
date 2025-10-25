import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const MapserviceApiTagTypes = {
  userLatLon: "userLatLon",
};

export const mapServiceApi = createApi({
  reducerPath: "mapServiceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://nominatim.openstreetmap.org/",
    prepareHeaders: (headers) => {
      headers.set("User-Agent", "homehivesolutions");
      return headers;
    },
  }),
  tagTypes: [MapserviceApiTagTypes.userLatLon],
  endpoints: (builder) => ({
    getUserLatlon: builder.query({
      query: (address) => {
        const encodedAddress = encodeURIComponent(address);
        return `search?q=${encodedAddress}&format=json&limit=1`;
      },
      providesTags: [MapserviceApiTagTypes.userLatLon],
      transformResponse: (response) => {
        if (!response?.length) return null;
        const { lat, lon } = response[0];
        return {
          lat: parseFloat(lat),
          lon: parseFloat(lon),
        };
      },
    }),
  }),
});

export const { useGetUserLatlonQuery } = mapServiceApi;
