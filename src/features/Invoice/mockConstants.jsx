// InvoiceMockValues ...
// defines mock values for invoice app
const InvoiceMockValues = {
  invoiceDetails: [
    {
      id: "9e6913b1-86a9-431f-bd13-e6c209ba71ad",
      title: "Rent Details",
      caption: "Rent for the month of April",
      note: "All utility bills have been registered and paid in full amount.",
      startDate: "2026-04-01T05:00:00.000Z",
      endDate: "2026-04-01T05:00:00.000Z",
      taxRate: "1.00",
      invoiceHeader: "Rent for the month of April",
      lineItems: [
        {
          category: {
            label: "Fees",
            value: "fees",
          },
          description: "Application Fee",
          caption: "Initial cost of application usage",
          quantity: "1",
          price: "99.99",
          payment: "0.00",
          paymentMethod: "Bank note - Bank of America",
        },
        {
          category: {
            label: "Services",
            value: "services",
          },
          description: "Application setup fee",
          caption: "Charge for setting up the application",
          quantity: "1",
          price: "12.99",
          payment: "0.00",
          paymentMethod: "Bank of America",
        },
      ],
      updatedOn: "2026-08-15T13:32:02.070Z",
      invoiceStatus: {
        id: 3,
        label: "Overdue",
        selected: true,
        display: true,
      },
    },
  ],
  receiverDetails: [
    {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane_smith@gmail.com",
      phone: "1231231212",
      streetAddress: "131 West Palmer Ln",
      city: "Richmond",
      state: "VA",
      zipcode: "94565",
      invoiceID: "9e6913b1-86a9-431f-bd13-e6c209ba71ad",
      updatedOn: "2026-08-15T13:42:33.502Z",
    },
  ],
  senderDetails: [
    {
      firstName: "John",
      lastName: "Smith",
      email: "johnsmith1945@gmail.com",
      phone: "1231231211",
      streetAddress: "112 Test Palmer Lane",
      city: "Richmond",
      state: "VA",
      zipcode: "12345",
      updatedOn: "2026-08-15T13:22:34.604Z",
      invoiceID: "9e6913b1-86a9-431f-bd13-e6c209ba71ad",
    },
  ],
  chartDetails: {
    InvoiceTimelineChartData: {
      labels: ["Water Repair", "Electric Repair"],
      datasets: [
        {
          label: "Invoice Timeline",
          data: [
            {
              x: ["2026-08-27T05:00:00.000Z", "2026-12-31T06:00:00.000Z"],
              y: "Water Repair",
              startDate: "2026-08-27T05:00:00.000Z",
              endDate: "2026-12-31T06:00:00.000Z",
              duration: 126,
            },
            {
              x: ["2026-07-01T05:00:00.000Z", "2026-07-31T05:00:00.000Z"],
              y: "Electric Repair",
              startDate: "2026-07-01T05:00:00.000Z",
              endDate: "2026-07-31T05:00:00.000Z",
              duration: 30,
            },
          ],
        },
      ],
    },
  },
};

export default InvoiceMockValues;
