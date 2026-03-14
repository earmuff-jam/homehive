import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const raspyApi = createApi({
  reducerPath: "raspyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/.netlify/functions/proxy",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // getAnswer ...
    // defines a function that creates stripe link for subscription
    getAnswer: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: JSON.stringify({
          // fUrl: "0026_fetch_raspy_solution",
          fMethod: "POST",
          payload: data,
        }),
      }),
    }),
  }),
});

export const { useGetAnswerMutation } = raspyApi;
