/**
 * File : proxy.js
 *
 * This file is used to proxy any frontend repsonse to the backend, with
 * specific header values.
 */

/**
 * handler ...
 *
 * function used to support header control
 * @param {*} event
 * @param {string} fUrl - the forwarded url type
 * @param {string} fMethod - the forwarded method type
 */
export const handler = async (fUrl, fMethod, event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: "",
    };
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_SITE_URL}/.netlify/functions/${fUrl}`,
      {
        method: fMethod,
        headers: {
          "Content-Type": "application/json",
        },
        body: event.body,
      },
    );

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
