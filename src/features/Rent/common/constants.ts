export const AddPropertyTextString = "ADD_PROPERTY";
export const AddRentRecordsTextString = "ADD_RENT_RECORDS";
export const AssociateTenantTextString = "ASSOCIATE_TENANT";

// TLeaseTermOption ...
export type TLeaseTermOption = {
  id: number;
  value: string;
  amount: number;
  label: string;
};

export const LEASE_TERM_MENU_OPTIONS: TLeaseTermOption[] = [
  {
    id: 1,
    value: "1m",
    amount: 1,
    label: "1 month",
  },
  {
    id: 2,
    value: "2m",
    amount: 2,
    label: "2 months",
  },
  {
    id: 3,
    value: "3m",
    amount: 3,
    label: "3 months",
  },
  {
    id: 4,
    value: "6m",
    amount: 6,
    label: "6 months",
  },
  {
    id: 5,
    value: "1y",
    amount: 12,
    label: "1 year",
  },
  {
    id: 6,
    value: "2y",
    amount: 24,
    label: "2 years",
  },
];
