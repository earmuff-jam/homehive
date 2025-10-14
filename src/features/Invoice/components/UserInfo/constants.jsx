export const GENERIC_FORM_FIELDS = {
  type: "text",
  variant: "outlined",
};

export const TEXTAREA_FORM_FIELDS = {
  multiline: true,
  minRows: 4,
  variant: "outlined",
};

/**
 * Blank profile details to update user information
 */
export const BLANK_INDIVIDUAL_INFORMATION_DETAILS = {
  first_name: {
    id: "first_name",
    value: "",
    errorMsg: "",
    isRequired: true,
    validators: [
      {
        validate: (value) => value.trim().length <= 3,
        message:
          "First name is required and must be more than three characters",
      },
      {
        validate: (value) => value.trim().length >= 150,
        message: "First name should be less than 150 characters",
      },
    ],
  },
  last_name: {
    id: "last_name",
    value: "",
    errorMsg: "",
    isRequired: true,
    validators: [
      {
        validate: (value) => value.trim().length <= 0,
        message: "Last name is required",
      },
      {
        validate: (value) => value.trim().length >= 150,
        message: "Last name should be less than 150 characters",
      },
    ],
  },
  email_address: {
    id: "email_address",
    value: "",
    errorMsg: "",
    isRequired: true,
    validators: [
      {
        validate: (value) => value.trim().length <= 0,
        message: "Email address is required",
      },
      {
        validate: (value) => value.trim().length >= 150,
        message: "Email address should be less than 150 characters",
      },
      {
        validate: (value) => !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(value),
        message: "Email address is not valid",
      },
    ],
  },
  phone_number: {
    id: "phone_number",
    value: "",
    errorMsg: "",
    isRequired: true,
    validators: [
      {
        validate: (value) => value.trim().length <= 0,
        message: "Phone Number is required",
      },
      {
        validate: (value) => !/^\d{10}$/.test(value),
        message: "Phone number must be a valid 10-digit number",
      },
    ],
  },
  street_address: {
    id: "street_address",
    value: "",
    errorMsg: "",
    isRequired: true,
    validators: [
      {
        validate: (value) => value.trim().length <= 0,
        message: "Street address is required",
      },
      {
        validate: (value) => value.trim().length >= 150,
        message: "Street address should be less than 150 characters",
      },
    ],
  },
  city: {
    id: "city",
    value: "",
    errorMsg: "",
    isRequired: true,
    validators: [
      {
        validate: (value) => value.trim().length <= 0,
        message: "City is required",
      },
      {
        validate: (value) => value.trim().length >= 150,
        message: "City should be less than 150 characters",
      },
    ],
  },
  state: {
    id: "state",
    value: "",
    errorMsg: "",
    isRequired: true,
    validators: [
      {
        validate: (value) => value.trim().length <= 0,
        message: "State is required in the form of XX",
      },
      {
        validate: (value) => value.trim().length > 2,
        message: "State is required in the form of XX. Eg, AZ",
      },
    ],
  },
  zipcode: {
    id: "zipcode",
    value: "",
    errorMsg: "",
    isRequired: true,
    validators: [
      {
        validate: (value) => value.trim().length <= 0,
        message: "Zip Code is required",
      },
      {
        validate: (value) => !/^\d{5}$/.test(value),
        message: "Zip Code should be within 5 digits",
      },
    ],
  },
};
