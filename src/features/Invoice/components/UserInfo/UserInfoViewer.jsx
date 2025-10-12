import React from "react";

import TextFieldWithLabel from "../../../../common/TextFieldWithLabel";
import { Container, Stack, Typography } from "@mui/material";
import AButton from "common/AButton";

export default function UserInfoViewer({
  title,
  caption,
  formData,
  handleChange,
  onSubmit,
  isDisabled,
}) {
  return (
    <Container
      maxWidth="sm"
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 2,
        padding: 3,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Stack spacing={2}>
        <Stack>
          <Typography variant="h5" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="subtitle2">{caption}</Typography>
        </Stack>

        {/* First and Last Name */}
        <Stack direction="row" spacing={2}>
          <TextFieldWithLabel
            label="First name *"
            id="first_name"
            name="first_name"
            placeholder="First Name"
            value={formData?.first_name.value || ""}
            handleChange={handleChange}
            errorMsg={formData.first_name["errorMsg"]}
          />
          <TextFieldWithLabel
            label="Last name *"
            id="last_name"
            name="last_name"
            placeholder="Last Name"
            value={formData?.last_name.value || ""}
            handleChange={handleChange}
            errorMsg={formData.last_name["errorMsg"]}
          />
        </Stack>

        {/* Email and Phone Number */}
        <Stack direction="row" spacing={2}>
          <TextFieldWithLabel
            label="Email address *"
            id="email_address"
            name="email_address"
            placeholder="Email Address"
            value={formData?.email_address.value || ""}
            handleChange={handleChange}
            errorMsg={formData.email_address["errorMsg"]}
          />
          <TextFieldWithLabel
            label="Phone Number *"
            id="phone_number"
            name="phone_number"
            placeholder="Phone Number"
            value={formData?.phone_number.value || ""}
            handleChange={handleChange}
            errorMsg={formData.phone_number["errorMsg"]}
          />
        </Stack>

        {/* Street Address */}
        <TextFieldWithLabel
          label="Street Address *"
          id="street_address"
          name="street_address"
          placeholder="Street Address"
          value={formData?.street_address.value || ""}
          handleChange={handleChange}
          errorMsg={formData.street_address["errorMsg"]}
        />

        {/* City, State, Zip Code */}
        <Stack direction="row" spacing={2}>
          <TextFieldWithLabel
            label="City *"
            id="city"
            name="city"
            placeholder="City"
            value={formData?.city.value || ""}
            handleChange={handleChange}
            errorMsg={formData.city["errorMsg"]}
          />
          <TextFieldWithLabel
            label="State *"
            id="state"
            name="state"
            placeholder="State"
            value={formData?.state.value || ""}
            handleChange={handleChange}
            errorMsg={formData.state["errorMsg"]}
          />
          <TextFieldWithLabel
            label="Zip Code *"
            id="zipcode"
            name="zipcode"
            placeholder="Zip Code"
            value={formData?.zipcode.value || ""}
            handleChange={handleChange}
            errorMsg={formData.zipcode["errorMsg"]}
          />
        </Stack>
        <AButton
          label="Save"
          variant="contained"
          onClick={onSubmit}
          disabled={isDisabled}
        />
      </Stack>
    </Container>
  );
}
