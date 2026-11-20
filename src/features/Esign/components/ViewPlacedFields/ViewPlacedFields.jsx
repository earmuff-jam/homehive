import React from "react";

import { Chip, Divider, Stack, Typography } from "@mui/material";

const ViewPlacedFields = ({ signatureBoxes = [], removeBox }) => (
  <Stack marginTop={1} spacing={1}>
    <Divider>
      <Typography variant="caption" color="textSecondary">
        Placed Fields
      </Typography>
    </Divider>
    {signatureBoxes?.length > 0 && (
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {signatureBoxes.map((box) => (
          <Chip
            key={box.id}
            label={`${box.signerRole} ${box.fieldType} — Page ${box.pageNum}`}
            onDelete={() => removeBox(box.id)}
            size="small"
            sx={{
              borderWidth: 1.5,
              borderStyle: "solid",
              borderColor: box.color,
              color: box.color,
              backgroundColor: `${box.color}18`,
              "& .MuiChip-deleteIcon": { color: box.color },
            }}
          />
        ))}
      </Stack>
    )}
  </Stack>
);

export default ViewPlacedFields;
