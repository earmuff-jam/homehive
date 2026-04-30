import React from "react";

import { CheckRounded, RemoveCircleOutlineRounded } from "@mui/icons-material";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuList,
  Stack,
} from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader";

const ViewMissingFields = ({ fields = [], templateHtml }) => {
  const missingFields =
    fields?.filter((field) => !templateHtml.includes(field)) || [];

  return (
    <Stack
      elevation={1}
      sx={(theme) => ({
        flex: 1,
        color: theme.palette.text.primary,
        boxShadow: 1,
        backgroundColor: theme.palette.background.paper,
        padding: 1,
        borderRadius: 1,
      })}
    >
      <RowHeader
        title="Available Fields"
        caption="Use these fields in your template"
        sxProps={{ textAlign: "left" }}
      />
      {fields?.length <= 0 ? (
        <EmptyComponent
          title="Sorry, no missing fields to display."
          sxProps={{ variant: "caption", fontStyle: "italic" }}
        />
      ) : null}
      <Stack marginTop={1}>
        {fields.map((mf, idx) => (
          <MenuList
            key={mf}
            sx={{
              padding: 0,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              backgroundColor:
                idx % 2 === 0
                  ? "rgba(248, 151, 7, 0.06)" // ultra light orange
                  : "rgba(16, 121, 208, 0.06)", // ultra light blue
            }}
          >
            <ListItem
              sx={{
                paddingY: 1,
              }}
            >
              <ListItemText
                primary={mf}
                secondary={`Use as {{${mf}}`}
                slotProps={{
                  primary: {
                    variant: "caption",
                    sx: { textTransform: "capitalize", fontWeight: "bold" },
                  },
                  secondary: {
                    variant: "caption",
                    fontStyle: "italic",
                  },
                }}
              />
            </ListItem>
            <ListItemIcon>
              {missingFields.includes(mf) ? (
                <RemoveCircleOutlineRounded fontSize="small" color="error" />
              ) : (
                <CheckRounded fontSize="small" color="success" />
              )}
            </ListItemIcon>
          </MenuList>
        ))}
      </Stack>
    </Stack>
  );
};

export default ViewMissingFields;
