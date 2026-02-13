import React from "react";

import { Controller } from "react-hook-form";

import { InfoRounded } from "@mui/icons-material";
import {
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import TextFieldWithLabel from "common/TextFieldWithLabel";

export default function AddProperty({
  register,
  control,
  errors,
  onSubmit,
  isDisabled = false,
  isEditing = false,
  isBrokerManaged = false,
  isManagerManaged = false,
  isOwnerCoveredUtilities = false,
  isPropertyWithinHOA = false,
}) {
  return (
    <form onSubmit={onSubmit}>
      <Divider>
        <Typography variant="caption" color="textSecondary">
          Property Information
        </Typography>
      </Divider>
      <Stack direction="column" spacing={1}>
        <Stack spacing={1}>
          <TextFieldWithLabel
            label="Property Name *"
            id="name"
            placeholder="Name of your property"
            errorMsg={errors.name?.message}
            inputProps={{
              ...register("name", { required: "Property name is required" }),
            }}
          />

          <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
            <TextFieldWithLabel
              label="Address *"
              id="address"
              placeholder="123 Main St"
              errorMsg={errors.address?.message}
              inputProps={{
                ...register("address", {
                  required: "Property address is required",
                }),
              }}
            />
            <TextFieldWithLabel
              label="County"
              id="county"
              placeholder="County"
              errorMsg={errors.county?.message}
              inputProps={{
                ...register("county"),
              }}
            />
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
          <TextFieldWithLabel
            label="City *"
            id="city"
            placeholder="Richmond"
            errorMsg={errors.city?.message}
            inputProps={{
              ...register("city", { required: "City is required" }),
            }}
          />
          <TextFieldWithLabel
            label="State *"
            id="state"
            placeholder="NC"
            errorMsg={errors.state?.message}
            inputProps={{
              ...register("state", {
                required: "State is required in the form of XX. Eg, TN",
                pattern: {
                  value: /^[A-Z]{2}$/,
                  message: "State must be 2 uppercase letters (e.g. TX)",
                },
              }),
            }}
          />
          <TextFieldWithLabel
            label="ZIP Code *"
            id="zipcode"
            placeholder="78701"
            errorMsg={errors.zipcode?.message}
            inputProps={{
              ...register("zipcode", {
                required: "ZipCode is required.",
                pattern: {
                  value: /^\d{5}$/,
                  message: "ZIP Code must be exactly 5 digits",
                },
              }),
            }}
          />
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
          <TextFieldWithLabel
            label="Number of Units / Bedroom *"
            id="units"
            placeholder="e.g. 4"
            errorMsg={errors.units?.message}
            inputProps={{
              ...register("units", {
                required: "Number of bedrooms is required.",
                pattern: {
                  value: /^\d+(\.\d)?$/, // allows optional one decimal digit
                  message: "Enter a valid number like 1, 1.5, or 2",
                },
              }),
            }}
          />
          <TextFieldWithLabel
            label="Number of Bathrooms *"
            id="bathrooms"
            placeholder="e.g. 2"
            errorMsg={errors.bathrooms?.message}
            inputProps={{
              ...register("bathrooms", {
                required: "Number of bathrooms is required",
                pattern: {
                  value: /^\d+(\.\d)?$/, // allows optional one decimal digit
                  message: "Enter a valid number like 1, 1.5, or 2",
                },
              }),
            }}
          />
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
          <TextFieldWithLabel
            label="Area of the home in sq ft. *"
            id="sqFt"
            placeholder="7854"
            errorMsg={errors.sqFt?.message}
            inputProps={{
              ...register("sqFt", {
                required: "Area of the home in square ft is required.",
                pattern: {
                  value: /^\d+$/,
                  message: "Square footage must be a whole number",
                },
                min: {
                  value: 100,
                  message: "Value must be at least 100 sq ft",
                },
                max: {
                  value: 20000,
                  message: "Value must be less than 20,000 sq ft",
                },
              }),
            }}
          />
        </Stack>

        {/* Notes section */}
        <TextFieldWithLabel
          label="Additional Notes"
          id="note"
          placeholder="Additional notes "
          errorMsg={errors.note?.message}
          multiline
          maxRows={3}
          inputProps={{
            ...register("note", {
              maxLength: {
                value: 500,
                message: "Notes must be 500 characters or less",
              },
            }),
          }}
        />

        <Divider>
          <Typography variant="caption" color="textSecondary">
            Provisions and allocations
          </Typography>
        </Divider>

        {/* Emergency Contact */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
          <TextFieldWithLabel
            label="Emergency Contact *"
            id="emergencyContactNumber"
            placeholder="Emergency Contact Number without spaces or dashes"
            errorMsg={errors.emergencyContactNumber?.message}
            inputProps={{
              ...register("emergencyContactNumber", {
                required: "Emergency Contact Number is required",
                minLength: {
                  value: 9,
                  message: "Phone number must be at least 9 digits",
                },
                maxLength: {
                  value: 15,
                  message: "Phone number cannot exceed 15 digits",
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Phone number must contain only digits",
                },
              }),
            }}
          />
        </Stack>

        {/* Yard cleaning and smoking */}
        <Stack direction={{ xs: "column", md: "row" }}>
          <Controller
            name="isTenantCleaningYard"
            control={control}
            defaultValue={true}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label={
                  <Typography variant="subtitle2">
                    Is the tenant responsible to maintain yard?
                  </Typography>
                }
              />
            )}
          />
          <Controller
            name="isSmoking"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label={
                  <Typography variant="subtitle2">
                    Is smoking permitted in the premise?
                  </Typography>
                }
              />
            )}
          />
        </Stack>

        {/* Owner covered utilities */}
        <Stack>
          <Controller
            name="isOwnerCoveredUtilities"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label={
                  <Typography variant="subtitle2">
                    Does the owner cover any utilities?
                  </Typography>
                }
              />
            )}
          />

          {isOwnerCoveredUtilities && (
            <TextFieldWithLabel
              label="Utilities covered by owner *"
              id="ownerCoveredUtilities"
              placeholder="List owner covered utilities. Eg, Electricity, Water."
              errorMsg={errors.ownerCoveredUtilities?.message}
              inputProps={{
                ...register("ownerCoveredUtilities", {
                  required: "Utilities covered by owner is required",
                }),
              }}
            />
          )}
        </Stack>

        {/* Monthy rent and Additional Rent */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
          <TextFieldWithLabel
            label="Monthly Rent *"
            id="rent"
            placeholder="Monthly rent in USD. Eg, 2750.00"
            errorMsg={errors.rent?.message}
            inputProps={{
              ...register("rent", {
                required: "Rent is required and must be in number format.",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Rent must be a valid amount (e.g. 2750.00)",
                },
              }),
            }}
          />
          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="Includes recurring charges such as utilities, parking, or other monthly services.">
                  <InfoRounded
                    color="secondary"
                    fontSize="small"
                    sx={{ fontSize: "1rem", margin: "0.2rem" }}
                  />
                </Tooltip>
                <Typography variant="subtitle2">Add ons</Typography>
              </Stack>
            }
            id="additionalRent"
            placeholder="Additional fee. Eg, 400.00"
            errorMsg={errors.additionalRent?.message}
            inputProps={{
              ...register("additionalRent", {
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Additional fee must be a valid amount (e.g. 75.00)",
                },
              }),
            }}
          />
        </Stack>

        {/* Projected Rent Increment and Security Deposit */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="Estimated rent increment for next lease term. Prefilling this allows you to generate automatic templates to send to your tenant. You can edit this value later on.">
                  <InfoRounded
                    color="secondary"
                    fontSize="small"
                    sx={{ fontSize: "1rem", margin: "0.2rem" }}
                  />
                </Tooltip>
                <Typography variant="subtitle2">
                  Projected Rent Increase *
                </Typography>
              </Stack>
            }
            id="rentIncrement"
            placeholder="Projected Rent Increase in USD. Eg, 200.00"
            errorMsg={errors.rentIncrement?.message}
            inputProps={{
              ...register("rentIncrement", {
                required:
                  "Projected Rent Increase is required and must be in number format.",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message:
                    "Projected Rent Increase must be a valid amount (e.g. 200.00)",
                },
              }),
            }}
          />

          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="Security deposit is payment identifier">
                  <InfoRounded
                    color="secondary"
                    fontSize="small"
                    sx={{ fontSize: "1rem", margin: "0.2rem" }}
                  />
                </Tooltip>
                <Typography variant="subtitle2">Security deposit *</Typography>
              </Stack>
            }
            id="securityDeposit"
            placeholder="Security deposit for the property. Eg, 2100.00"
            errorMsg={errors.securityDeposit?.message}
            inputProps={{
              ...register("securityDeposit", {
                required: "Security deposit is required.",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message:
                    "Security deposit must be a valid amount (e.g. 75.00)",
                },
              }),
            }}
          />
        </Stack>

        {/* Vehicle parking and payment identifiers */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="Limit the amount of parking spots for the residents of this property.">
                  <InfoRounded
                    color="secondary"
                    fontSize="small"
                    sx={{ fontSize: "1rem", margin: "0.2rem" }}
                  />
                </Tooltip>
                <Typography variant="subtitle2">
                  Allocated parking spots
                </Typography>
              </Stack>
            }
            id="allowedVehicleCounts"
            placeholder="Allowed vehicles on property"
            errorMsg={errors.allowedVehicleCounts?.message}
            inputProps={{
              ...register("allowedVehicleCounts", {
                pattern: {
                  value: /^\d+$/,
                  message:
                    "Allocated vehicle counts must be a valid amount (e.g. 2)",
                },
              }),
            }}
          />
          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="Payment ID is payment identifier associated with rental payments for the owner">
                  <InfoRounded
                    color="secondary"
                    fontSize="small"
                    sx={{ fontSize: "1rem", margin: "0.2rem" }}
                  />
                </Tooltip>
                <Typography variant="subtitle2">Payee ID *</Typography>
              </Stack>
            }
            id="paymentID"
            placeholder="Payment Identity Field. Eg, Zelle ID: XXX-XX-XXXX"
            errorMsg={errors.paymentID?.message}
            inputProps={{
              ...register("paymentID", {
                required: "Payment Identity Field is required.",
                maxLength: {
                  value: 100,
                  message: "Payment ID should be less than 100 characters",
                },
              }),
            }}
          />
        </Stack>

        {/* Special provisions */}
        <Stack>
          <TextFieldWithLabel
            label="Special Provisions"
            id="specialProvisions"
            placeholder="Add special provisions for the tenant within 500 characters"
            errorMsg={errors.specialProvisions?.message}
            multiline
            maxRows={3}
            inputProps={{
              ...register("specialProvisions", {
                maxLength: {
                  value: 500,
                  message:
                    "Provisions must be 500 characters or less. Add addendum to add more information.",
                },
              }),
            }}
          />
        </Stack>

        <Divider>
          <Typography variant="caption" color="textSecondary">
            Property Management
          </Typography>
        </Divider>

        {/* HOA and HOA details */}
        <Stack>
          <Controller
            name="isHoa"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label={
                  <Typography variant="subtitle2">
                    Is the property within Home Owners Association (HOA) limits?
                  </Typography>
                }
              />
            )}
          />

          {isPropertyWithinHOA && (
            <TextFieldWithLabel
              label="HOA Details *"
              id="hoaDetails"
              placeholder="Details about the home owners association (HOA)"
              errorMsg={errors.hoaDetails?.message}
              inputProps={{
                ...register("hoaDetails", {
                  required: "HOA Details is required",
                }),
              }}
            />
          )}
        </Stack>

        {/* Broker information */}
        <Stack>
          <Controller
            name="isBrokerManaged"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label={
                  <Typography variant="subtitle2">
                    Is property managed by broker?
                  </Typography>
                }
              />
            )}
          />

          {isBrokerManaged && (
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <TextFieldWithLabel
                label="Broker Agent Full Name *"
                id="brokerName"
                placeholder="The name of the broker agent"
                errorMsg={errors.brokerName?.message}
                inputProps={{
                  ...register("brokerName", {
                    required: "Broker name is required",
                  }),
                }}
              />

              <TextFieldWithLabel
                label="Broker Address *"
                id="brokerAddress"
                placeholder="The address of the broker"
                errorMsg={errors.brokerAddress?.message}
                inputProps={{
                  ...register("brokerAddress", {
                    required: "Broker address is required",
                  }),
                }}
              />
            </Stack>
          )}
        </Stack>

        {/* Manager information */}
        <Stack>
          <Controller
            name="isManagerManaged"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label={
                  <Typography variant="subtitle2">
                    Is property managed by manager?
                  </Typography>
                }
              />
            )}
          />

          {isManagerManaged && (
            <Stack>
              <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
                <TextFieldWithLabel
                  label="Manager Full Name *"
                  id="managerName"
                  placeholder="The name of the manager"
                  errorMsg={errors.managerName?.message}
                  inputProps={{
                    ...register("managerName", {
                      required: "Manager full name is required",
                    }),
                  }}
                />
                <TextFieldWithLabel
                  label="Manager Phone *"
                  id="managerPhone"
                  placeholder="Manager Phone number"
                  errorMsg={errors.managerPhone?.message}
                  inputProps={{
                    ...register("managerPhone", {
                      required: "Manager contact information is required",
                      minLength: {
                        value: 9,
                        message:
                          "Manager phone number must be at least 9 digits",
                      },
                      maxLength: {
                        value: 15,
                        message: "Manager phone number cannot exceed 15 digits",
                      },
                      pattern: {
                        value: /^[0-9]+$/,
                        message:
                          "Manager phone number must contain only digits",
                      },
                    }),
                  }}
                />
              </Stack>
              <TextFieldWithLabel
                label="Manager Address*"
                id="managerAddress"
                placeholder="The address of the manager"
                errorMsg={errors.managerAddress?.message}
                inputProps={{
                  ...register("managerAddress", {
                    required: "Manager address is required",
                  }),
                }}
              />
            </Stack>
          )}
        </Stack>

        <AButton
          disabled={isDisabled}
          type="submit"
          variant="outlined"
          label={isEditing ? "Edit Property" : "Add Property"}
        />
      </Stack>
    </form>
  );
}
