import { PropertyRouteUri } from "common/utils";

// retrieveTourKey ...
// defines a function that is used to retrieve tour key
export const retrieveTourKey = (currentUri, expectedStrValue) => {
  const isDynamicPropertyPage =
    currentUri.includes(`/${expectedStrValue}/`) &&
    currentUri.split("/")[2] === expectedStrValue;

  // individual properties can share the same help && support
  return isDynamicPropertyPage ? PropertyRouteUri : currentUri;
};

// generateInvoiceHTML ...
// defines a function that is used to populate invoice html
export function generateInvoiceHTML(recieverInfo, data, invoiceStatus = "") {
  return `
    <p> Dear ${
      recieverInfo.firstName
    }, Please see the attached invoice details.</p>
    <br />
    <br />
    <h2>${data.title}</h2>
    <p><strong>Header:</strong> ${data.invoiceHeader}</p>

    <p style="color: red;"><strong>Invoice Status: ${invoiceStatus}</strong></p>

    <p><strong>Date Range:</strong> ${data.startDate} to ${data.endDate}</p>
    <p><strong>Tax Rate:</strong> ${data.taxRate}%</p>

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
            <td>${item.paymentMethod}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>

    <p><em>Invoice last updated on: ${data.updatedOn}</em></p>
  `;
}
