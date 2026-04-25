import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const OverpassTagTypes = {
  nearbySchools: "nearbySchools",
};

export const mapAmenitiesApi = createApi({
  reducerPath: "mapAmenitiesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://overpass-api.de/api",
  }),
  tagTypes: [OverpassTagTypes.nearbySchools],
  endpoints: (builder) => ({
    // getNearbyAmenities ...
    // fetch nearby amenties based on the property id
    getNearbyAmenities: builder.query({
      query: ({ lat, lon, amenityTypes, radius = 4000 }) => {
        // early termination
        if (lat == null || lon == null || amenityTypes?.length <= 0) {
          throw new Error("Missing required parameters");
        }

        const amenityQueries = amenityTypes
          .slice(0, 3) // max 3 to prevent overloading
          .map(
            (type) => `
                  node["amenity"="${type}"](around:${radius},${lat},${lon});
                  way["amenity"="${type}"](around:${radius},${lat},${lon});
                  relation["amenity"="${type}"](around:${radius},${lat},${lon});
                  `,
          )
          .join("");

        const query = `
            [out:json];
            (
              ${amenityQueries}
            );
            out center;
            `;

        return `/interpreter?data=${encodeURIComponent(query)}`;
      },
      providesTags: [OverpassTagTypes.nearbySchools],
      transformResponse: (response) => {
        if (!response?.elements?.length) return [];

        return response.elements.map((el) => ({
          id: el.id,
          type: el.tags?.amenity || "unknown",
          name: el.tags?.name || `Unnamed ${el.tags?.amenity || "Place"}`,
          lat: el.lat || el.center?.lat,
          lon: el.lon || el.center?.lon,
        }));
      },
    }),
  }),
});

export const { useGetNearbyAmenitiesQuery } = mapAmenitiesApi;
