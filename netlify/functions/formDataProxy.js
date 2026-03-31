/**
 * File : formDataProxy.js
 *
 * Proxy used only for multipart/form-data uploads
 */

const DefaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const IntegrationKey = process.env.VITE_INTEGRATION_KEY;

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: DefaultHeaders,
      body: "",
    };
  }

  try {
    const body = event.isBase64Encoded
      ? Buffer.from(event.body, "base64")
      : event.body;

    const response = await fetch(
      `${process.env.VITE_SITE_URL}/.netlify/functions/0029_SendPreparedEsignDocument`,
      {
        method: "POST",
        headers: {
          ...DefaultHeaders,
          "x-api-key": IntegrationKey,
          "content-type": event.headers["content-type"],
        },
        body,
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
