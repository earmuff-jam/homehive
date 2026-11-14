import React from "react";

import { Stack } from "@mui/material";

const Preview = ({ previewData }) => {
  console.log(previewData);
  return <Stack>
    
    {JSON.stringify(previewData)}</Stack>;
};

export default Preview;
