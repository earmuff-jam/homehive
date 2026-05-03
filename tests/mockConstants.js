const senderInfo = {
  firstName: "Mohit",
  lastName: "Paudyal",
  email: "mohit.paudyal@gmail.com",
  phone: "2147458455",
  streetAddress: "121 West Palm Beach",
  city: "Everglade",
  state: "FL",
  zipcode: "34139",
  updatedOn: "2026-04-30T19:42:20.523Z",
};

const recieverInfo = {
  firstName: "James",
  lastName: "Smith",
  email: "jamesSmith29@icloud.com",
  phone: "1234567845",
  streetAddress: "1335 New College Rd",
  city: "Little Rock",
  state: "AK",
  zipcode: "72203",
  updatedOn: "2026-04-30T19:44:23.278Z",
};

const pdfDetails = {
  title: "Month of April",
  caption: "Itemized bill for completed tasks",
  note: "Rent was paid on time. Owner has paid utility bills throughout this month, no dues remain at this time.",
  startDate: "2026-04-02T05:00:00.000Z", // due to time changes; assertion is different
  endDate: "2026-04-21T05:00:00.000Z",
  taxRate: "1.00",
  invoiceHeader: "Itemized bill",
  updatedOn: "2026-04-30T19:13:49.161Z",
  invoiceStatus: {
    id: 2,
    label: "Draft",
    selected: true,
    display: true,
  },
  lineItems: [
    {
      category: {
        label: "Services",
        value: "services",
      },
      description: "Replaced door knob for garage",
      caption: "Replaced door knob of garage",
      quantity: "1",
      price: "34.89",
      payment: "30.89",
      paymentMethod: "Zelle",
    },
    {
      category: {
        label: "Fees",
        value: "fees",
      },
      description: "Remove dirty bathroom faucet",
      caption: "Labor charge for removing bathroom faucet",
      quantity: "1",
      price: "89.99",
      payment: "100.00",
      paymentMethod: "Cash",
    },
  ],
};

const InvoiceAppMockConstants = {
  pdfDetails: pdfDetails,
  senderInfo: senderInfo,
  recieverInfo: recieverInfo,
};

const e2eMockData = {
  InvoiceAppMockConstants,
};

export default e2eMockData;
