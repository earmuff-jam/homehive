import React, { useState } from "react";

import { InfoRounded } from "@mui/icons-material";
import {
  Box,
  Card,
  Grid,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Menu } from "@mui/material";
import AButton from "common/AButton";
import RowHeader from "common/RowHeader/RowHeader";

export default function Template(props) {
  const { id, template, handleSave, handleTemplateChange } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);

  return (
    <Grid item xs={12} md={6} key={id}>
      <Card elevation={0} sx={{ p: 3, height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            justifyContent: "space-between",
          }}
        >
          <RowHeader
            title={template?.label || "Template"}
            caption="Create custom templates using static fields"
            sxProps={{
              textAlign: "left",
              fontSize: "1.125rem",
              fontWeight: "600",
            }}
          />
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Missing fields are marked in red color.">
              <InfoRounded fontSize="small" />
            </Tooltip>
            <AButton
              size="small"
              variant="outlined"
              label="Show valid fields"
              onClick={handleClick}
            />
          </Stack>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                "aria-labelledby": "basic-button",
              },
            }}
          >
            {template?.fieldsToUse?.map((item) => (
              <Typography
                key={item}
                variant="subtitle2"
                sx={{ padding: "0.4rem" }}
                color={!template.html.includes(item) ? "error" : "inherit"}
              >
                {item}
              </Typography>
            ))}
          </Menu>
        </Box>
        <Stack spacing={2}>
          <TextField
            label="Subject"
            value={template.subject}
            onChange={handleTemplateChange(id, "subject")}
            fullWidth
            size="small"
          />
          <TextField
            label="Message Body"
            value={template.body || template.description}
            onChange={handleTemplateChange(
              id,
              template.body ? "body" : "description",
            )}
            fullWidth
            multiline
            rows={3}
            size="small"
          />
          <Tooltip title="Customize this template with text of your choice. You can even directly use html markup in the above template. Use the variables listed on the side to bring your templates to life.">
            <TextField
              label="Message HTML"
              value={template.html || template.description}
              onChange={handleTemplateChange(
                id,
                template.html ? "html" : "description",
              )}
              fullWidth
              multiline
              rows={15}
              size="small"
            />
          </Tooltip>
          <AButton
            label="Save"
            variant="outlined"
            size="small"
            onClick={handleSave}
          />
        </Stack>
      </Card>
    </Grid>
  );
}
