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
    InvoiceItemTypeFreqChartData: {
      labels: ["Services", "Fees"],
      datasets: [
        {
          label: "Item Type Frequency",
          data: [1, 1],
          backgroundColor: "rgba(153, 102, 255, 0.7)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    },
    InvoiceTrendsChartData: {
      data: [
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
            {
              category: "",
              description: "Test",
              caption: "2",
              quantity: "2",
              price: "2",
              payment: "2",
              paymentMethod: "Casy",
            },
          ],
          updatedOn: "2026-08-22T21:02:04.116Z",
          invoiceStatus: {
            id: 3,
            label: "Overdue",
            selected: true,
            display: true,
          },
        },
        {
          id: "c5e944fd-40ed-441b-a344-713d5bb7e57c",
          title: "Invoice title2",
          caption: "Invoice Caption2",
          note: "Additional notes 2",
          startDate: "2026-08-15T05:00:00.000Z",
          endDate: "2026-08-15T05:00:00.000Z",
          taxRate: "1.00",
          invoiceHeader: "Invoice Header 2",
          lineItems: [
            {
              category: {
                label: "Products",
                value: "products",
              },
              description: "Simple product for testing",
              caption: "Simple product for testing",
              quantity: "1",
              price: "12.40",
              payment: "12.33",
              paymentMethod: "Cash",
            },
          ],
          updatedOn: "2026-08-13T22:03:24.876Z",
          invoiceStatus: {
            id: 4,
            label: "Cancelled",
            selected: true,
            display: true,
          },
        },
      ],
    },
  },
  utils: {
    trendsChartReq: [
      {
        startDate: "2025-01-01",
        taxRate: 10,
        lineItems: [{ payment: 100 }],
      },
      {
        startDate: "2025-01-15",
        taxRate: 10,
        lineItems: [{ payment: 50 }],
      },
    ],
    trendsChartRes: {
      labels: ["August", "July"],
      datasets: [
        {
          label: "Collected Invoice",
          data: [12, 0],
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderColor: "rgba(54, 162, 235, 1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Tax Collected",
          data: [0.12, 0],
          backgroundColor: "rgba(255, 99, 132, 0.7)",
          borderColor: "rgba(255, 99, 132, 1)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
  },
};

export default InvoiceMockValues;
