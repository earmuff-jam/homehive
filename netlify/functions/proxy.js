/**
 * File : proxy.js
 *
 * This file is used to proxy any frontend repsonse to the backend, with
 * specific header values.
 */

const DefaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: DefaultHeaders,
      body: "",
    };
  }

  try {
    const { fUrl, fMethod, payload } = JSON.parse(event.body);

    const IntegrationKey = process.env.VITE_INTEGRATION_KEY;
    const response = await fetch(
      `${process.env.VITE_SITE_URL}/.netlify/functions/${fUrl}`,
      {
        method: fMethod,
        headers: {
          ...DefaultHeaders,
          "x-api-key": IntegrationKey,
        },
        body: "POST" || "PUT" === fMethod ? JSON.stringify(payload) : null,
      },
    );

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: DefaultHeaders,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("unable to process requested api.", err);
    return {
      statusCode: 500,
      headers: DefaultHeaders,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
