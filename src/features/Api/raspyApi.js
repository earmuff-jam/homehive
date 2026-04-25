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
    // defines a function that creates ability to talk to raspy AI
    getAnswer: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0026_FetchRaspyAISolution",
          fMethod: "POST",
          payload: data,
        }),
      }),
    }),
    // decodeIntent ...
    // defines a function that attempts to decode user intent
    decodeIntent: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0027_FetchRaspyAIUserIntent",
          fMethod: "POST",
          payload: data,
        }),
      }),
    }),
  }),
});

export const { useGetAnswerMutation, useDecodeIntentMutation } = raspyApi;
