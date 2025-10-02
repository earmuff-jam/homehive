import { useState } from "react";

/**
 * generateInvoiceHTML
 *
 * function used to format the invoice data to be setup and printed via email.
 */
export function generateInvoiceHTML(recieverInfo, data, invoiceStatus = "") {
  return `
    <p> Dear ${
      recieverInfo.first_name
    }, Please see the attached invoice details.</p>
    <br />
    <br />
    <h2>${data.title}</h2>
    <p><strong>Header:</strong> ${data.invoice_header}</p>

    <p style="color: red;"><strong>Invoice Status: ${invoiceStatus}</strong></p>

    <p><strong>Date Range:</strong> ${data.start_date} to ${data.end_date}</p>
    <p><strong>Tax Rate:</strong> ${data.tax_rate}%</p>

    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          <th>Category</th>
          <th>Description</th>
          <th>Caption</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Payment</th>
          <th>Payment Method</th>
        </tr>
      </thead>
      <tbody>
        ${data.items
          .map(
            (item) => `
          <tr>
            <td>${item.category}</td>
            <td>${item.descpription}</td>
            <td>${item.caption}</td>
            <td>${item.quantity}</td>
            <td>$${item.price}</td>
            <td>$${item.payment}</td>
            <td>${item.payment_method}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>

    <p><em>Invoice last updated on: ${data.updatedOn}</em></p>
  `;
}

/**
 * useSendEmail
 *
 * function used to send email via send grid
 * @returns sendEmail function, loading state, error state, success state
 */
const useSendEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  const sendEmail = async ({ to, subject, text, html }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        "/.netlify/functions/proxy",
        "0001_send_email_fn",
        "GET",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: tenantData.email, subject, text }),
        },
      );

      // const response = await fetch(
      //   `${import.meta.env.VITE_SITE_URL}/api/0001_send_email_fn`,
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ to, subject, text, html }),
      //   },
      // );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Something went wrong");

      setSuccess(true);
      return data;
    } catch (err) {
      /* eslint-disable no-console */
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
      setError(null);
    }
  };

  return { sendEmail, reset, loading, error, success };
};

export default useSendEmail;
