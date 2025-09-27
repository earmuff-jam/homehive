import React from "react";

import { Autocomplete, Stack, TextField, Typography } from "@mui/material";
import TextFieldWithLabel from "common/UserInfo/TextFieldWithLabel";
import { InvoiceCategoryOptions } from "features/InvoiceWorks/components/PdfViewer/constants";

export default function EditPdfLineItem({
  index,
  formData,
  handleLineItemChange,
  handleLineItemAutocompleteChange,
}) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Stack>
          <Typography variant="body2" fontWeight="medium" gutterBottom>
            Category {formData.category.isRequired && `*`}
          </Typography>
          <Autocomplete
            id="category"
            disablePortal
            options={InvoiceCategoryOptions}
            sx={{ width: 300 }}
            value={formData.category?.selectedOption || ""}
            onChange={(event, newValue) =>
              handleLineItemAutocompleteChange(index, "category", newValue)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select type of category"
              />
            )}
          />
        </Stack>

        {/* Description */}
        <TextFieldWithLabel
          label="Description"
          id="descpription"
          name="descpription"
          placeholder="Description of charge"
          value={formData?.descpription.value || ""}
          handleChange={(ev) => handleLineItemChange(ev, index)}
          errorMsg={formData.descpription["errorMsg"]}
        />
      </Stack>

      {/* Caption */}
      <TextFieldWithLabel
        label="Caption"
        id="caption"
        name="caption"
        placeholder="Additional details"
        value={formData?.caption.value || ""}
        handleChange={(ev) => handleLineItemChange(ev, index)}
        errorMsg={formData.caption["errorMsg"]}
      />

      {/* Quantity and Price */}
      <Stack direction="row" spacing={2}>
        <TextFieldWithLabel
          label="Quantity *"
          id="quantity"
          name="quantity"
          placeholder="Quantity"
          value={formData?.quantity.value || ""}
          handleChange={(ev) => handleLineItemChange(ev, index)}
          errorMsg={formData.quantity["errorMsg"]}
        />
        <TextFieldWithLabel
          label="Price *"
          id="price"
          name="price"
          placeholder="Total cost of current item in USD"
          value={formData?.price.value || ""}
          handleChange={(ev) => handleLineItemChange(ev, index)}
          errorMsg={formData.price["errorMsg"]}
        />
      </Stack>

      {/* Payment and Mode of Payment */}
      <Stack direction="row" spacing={2}>
        <TextFieldWithLabel
          label="Payment *"
          id="payment"
          name="payment"
          placeholder="Amount paid in USD."
          value={formData?.payment.value || ""}
          handleChange={(ev) => handleLineItemChange(ev, index)}
          errorMsg={formData.payment["errorMsg"]}
        />
        <TextFieldWithLabel
          label="Mode of Payment*"
          id="payment_method"
          name="payment_method"
          placeholder="Payment Method, eg., Zelle, Money Order"
          value={formData?.payment_method.value || ""}
          handleChange={(ev) => handleLineItemChange(ev, index)}
          errorMsg={formData.payment_method["errorMsg"]}
        />
      </Stack>
    </Stack>
  );
}
