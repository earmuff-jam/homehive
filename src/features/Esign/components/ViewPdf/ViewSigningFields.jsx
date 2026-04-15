import React from "react";

import { Chip, Stack, Typography } from "@mui/material";

const ViewSigningFields = ({ signatureBoxes = [], removeBox }) => {
  const signatureFields = signatureBoxes.filter(
    (box) => box.fieldType === "signature",
  );

  const dateFields = signatureBoxes.filter((box) => box.fieldType === "date");

  return (
    <Stack mt={1} spacing={0.5}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        sx={{ textTransform: "uppercase", letterSpacing: 1 }}
      >
        Placed Fields
      </Typography>

      {signatureFields.length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {signatureFields.map((box) => (
            <Chip
              key={box.id}
              label={`${box.signerRole} — Page ${box.pageNum}`}
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

      {dateFields.length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {dateFields.map((box) => (
            <Chip
              key={box.id}
              label={`${box.signerRole} (Date) — Page ${box.pageNum}`}
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
};

export default ViewSigningFields;
