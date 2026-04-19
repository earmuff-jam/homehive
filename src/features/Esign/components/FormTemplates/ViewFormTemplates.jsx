import React from "react";

import { Button, Stack } from "@mui/material";

// DefaultFormTemplates ...
// defines some default templates
export const DefaultFormTemplates = [
  {
    id: "form_1",
    name: "Lease Agreement",
    url: "/forms/residential-lease.pdf",
  },
  {
    id: "form_2",
    name: "Lease Extension",
    url: "/forms/residential-lease-extension.pdf",
  },
  {
    id: "form_3",
    name: "Early Termination",
    url: "/forms/residential-lease-early-termination.pdf",
  },
  {
    id: "form_4",
    name: "Lease Renewal",
    url: "/forms/lease-renewal.pdf",
  },
];

const ViewFormTemplates = ({ handleUpload }) => {
  const handleUploadFromTemplate = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();

    const file = new File([blob], "template.pdf", {
      type: "application/pdf",
    });

    handleUpload({
      target: {
        files: [file],
      },
    });
  };
  return (
    <Stack
      direction="row"
      spacing={1}
      justifyContent="center"
      paddingY={1}
      data-tour="esign-3"
    >
      {DefaultFormTemplates.map((form) => (
        <Button
          key={form.id}
          variant="outlined"
          onClick={() => handleUploadFromTemplate(form.url)}
        >
          {form.name}
        </Button>
      ))}
    </Stack>
  );
};

export default ViewFormTemplates;
