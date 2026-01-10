import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TGeoLocationCoordinates } from "src/types";

// TMapServiceTag ...
type TMapServiceTag = "userLatLon";

// TNominatumResult ...
type TNominatumResult = {
  lat: string;
  lon: string;
};

const mapServiceApiTagTypes: Record<TMapServiceTag, TMapServiceTag> = {
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
  tagTypes: [mapServiceApiTagTypes.userLatLon],
  endpoints: (builder) => ({
    getUserLatlon: builder.query<TGeoLocationCoordinates, string>({
      query: (address) => {
        const encodedAddress = encodeURIComponent(address);
        return `search?q=${encodedAddress}&format=json&limit=1`;
      },
      providesTags: [mapServiceApiTagTypes.userLatLon],
      transformResponse: (
        response: TNominatumResult[],
      ): TGeoLocationCoordinates => {
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
