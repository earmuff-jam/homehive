import { z } from "zod";

// TPaymentStatusSchema ...
// defines the schema for payment status
export const TPaymentStatusSchema = z.enum([
  "intent",
  "paid",
  "manual",
  "complete",
]);

// TAuditColumnsSchema ...
// defines the schema for audit columns
export const TAuditColumnsSchema = z.object({
  createdBy: z.string(),
  createdOn: z.string(),
  updatedBy: z.string().nullable().optional(),
  updatedOn: z.string().nullable().optional(),
});

// TGeoLocationCoordinatesSchema ...
// defines the schema for the geolocation co-ordinates
export const TGeoLocationCoordinatesSchema = z.object({
  lat: z.coerce.number().optional(),
  lon: z.coerce.number().optional(),
});

// TPropertyFormSchema ...
// defines the schema for TPropertyFormSchema
export const TPropertyFormSchema = z.object({
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
  ownerEmail: z.string(),
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
  isDeleted: z.boolean().optional(),
  rentees: z.array(z.string()).optional(),
});

// TPropertySchema ...
// defines the schema for TProperty
export const TPropertySchema = TPropertyFormSchema.extend({
  location: TGeoLocationCoordinatesSchema.optional(),
})
  .extend(TAuditColumnsSchema.shape)
  .extend({
    id: z.string(),
    isDeleted: z.boolean().optional(),
    rentees: z.array(z.string()).optional(),
  });

// TTenantFormSchema ...
// defines the schema for TTenantForm
export const TTenantFormSchema = z.object({
  email: z.string(),
  startDate: z.string().min(1, "Start date is required"),
  term: z.string().min(1),
  taxRate: z.coerce.number().min(0),
  rent: z.coerce.number().min(0),
  initialLateFee: z.coerce.number().min(0),
  dailyLateFee: z.coerce.number().min(0),
  initialAnimalVoilationFee: z.coerce.number().min(0),
  dailyAnimalVoilationFee: z.coerce.number().min(0),
  returnedPaymentFee: z.coerce.number().min(0),
  gracePeriod: z.coerce.number().int().min(0),
  isAutoRenewPolicySet: z.boolean(),
  autoRenewDays: z.coerce.number().int().min(0),
  isPrimary: z.boolean(),
  isSoR: z.boolean(),
  assignedRoomName: z.string().optional(),
  guestsPermittedStayDays: z.coerce.number().int().min(0),
  tripCharge: z.coerce.number().min(0),
  allowKeyboxSince: z.coerce.number().int().min(0),
  removeKeyboxFee: z.coerce.number().min(0),
  inventoryCompleteWithin: z.coerce.number().int().min(0),
  rentDueDate: z.coerce.number().int().min(0),
  isActive: z.boolean(),
});

// TTenantSchema ...
// defines the schema for TTenant
export const TTenantSchema = TTenantFormSchema.extend({
  id: z.string(),
  propertyId: z.string(),
}).extend(TAuditColumnsSchema.shape);

// TRentRecordFormSchema ...
// defines the schema for TRentRecordForm
export const TRentRecordFormSchema = z.object({
  ownerFirstName: z.string().min(1),
  ownerLastName: z.string().min(1),
  ownerEmail: z.string(),
  tenantFirstName: z.string().min(1),
  tenantLastName: z.string().min(1),
  tenantEmail: z.string(),
  rent: z.coerce.number().min(0),
  paymentMethod: z.string().min(1),
  rentMonth: z.string(),
  rentPaidDate: z.string(),
  note: z.string().optional(),
});

// TRentRecordSchema ...
// defines the schema for TRentRecord
export const TRentRecordSchema = z
  .object({
    id: z.string(),
    rent: z.coerce.number().min(0),
    additionalCharges: z.coerce.number().min(0),
    tenantEmail: z.string().email(),
    propertyId: z.string(),
    propertyOwnerId: z.string(),
    tenantId: z.string(),
    rentMonth: z.string(),
    note: z.string().optional(),
    status: TPaymentStatusSchema,
  })
  .extend(TAuditColumnsSchema.shape);

// Type inferred from schema
export type TAuditColumns = z.infer<typeof TAuditColumnsSchema>;
export type TGeoLocationCoordinatesSchema = z.infer<
  typeof TGeoLocationCoordinatesSchema
>;
export type TPropertyFormSchema = z.infer<typeof TPropertyFormSchema>;
export type TProperty = z.infer<typeof TPropertySchema>;
export type TTenantForm = z.infer<typeof TTenantFormSchema>;
export type TTenant = z.infer<typeof TTenantSchema>;
export type TRentRecordForm = z.infer<typeof TRentRecordFormSchema>;
export type TRentRecord = z.infer<typeof TRentRecordSchema>;
