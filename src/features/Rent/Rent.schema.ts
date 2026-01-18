import { z } from "zod";

// PropertySchema ...
// defines the schema for TProperty
export const PropertySchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  county: z.string(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string(),
  units: z.coerce.number(),
  bathrooms: z.coerce.number(),
  sqFt: z.coerce.number(),
  note: z.string().optional(),
  ownerEmail: z.string().email(),
  emergencyContactNumber: z.string(),
  isTenantCleaningYard: z.boolean(),
  isSmoking: z.boolean(),
  isOwnerCoveredUtilities: z.boolean(),
  ownerCoveredUtilities: z.string(),
  rent: z.coerce.number(),
  additionalRent: z.coerce.number(),
  rentIncrement: z.coerce.number(),
  securityDeposit: z.coerce.number(),
  allowedVehicleCounts: z.coerce.number(),
  paymentID: z.string(),
  specialProvisions: z.string().optional(),
  isHoa: z.boolean(),
  hoaDetails: z.string().optional(),
  isBrokerManaged: z.boolean(),
  brokerName: z.string().optional(),
  brokerAddress: z.string().optional(),
  isManagerManaged: z.boolean(),
  managerName: z.string().optional(),
  managerPhone: z.string().optional(),
  managerAddress: z.string().optional(),
  location: z
    .object({
      lat: z.coerce.number(),
      lon: z.coerce.number(),
    })
    .optional(),
  isDeleted: z.boolean().optional(),
  rentees: z.array(z.string()).optional(),
  createdBy: z.string(),
  createdOn: z.string(),
  updatedBy: z.string(),
  updatedOn: z.string(),
});

// Type inferred from schema
export type TProperty = z.infer<typeof PropertySchema>;
