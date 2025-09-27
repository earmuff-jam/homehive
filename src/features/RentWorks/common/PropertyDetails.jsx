import React from "react";

import dayjs from "dayjs";

import { Business } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import RowHeader from "common/RowHeader/RowHeader";

export default function PropertyDetails({
  dataTour,
  property,
  isPropertyLoading,
}) {
  return (
    <Card sx={{ mb: 3 }} data-tour={dataTour}>
      <CardContent data-tour="rental-5">
        <RowHeader
          title="Property Details"
          sxProps={{
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: "flex-end",
            gap: 1,
            textAlign: "left",
            variant: "subtitle2",
            fontWeight: "bold",
          }}
          caption={<Business color="primary" />}
        />
        {isPropertyLoading ? (
          <Skeleton height="10rem" />
        ) : (
          <Stack spacing={2}>
            <Stack direction="row">
              <Stack textAlign="center" flexGrow={1}>
                <Typography variant="h4" color="success.main">
                  {property?.units}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Bedrooms
                </Typography>
              </Stack>
              <Stack textAlign="center" flexGrow={1}>
                <Typography variant="h4" color="success.main">
                  {property?.bathrooms}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Bathrooms
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row">
              <Stack textAlign="center" flexGrow={1}>
                <Tooltip
                  title={dayjs(property?.createdOn).format("MMM DD, YYYY")}
                >
                  <Stack>
                    <Typography variant="subtitle2">
                      {dayjs(property?.createdOn).format("MM DD YYYY")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Created
                    </Typography>
                  </Stack>
                </Tooltip>
              </Stack>
              <Stack textAlign="center" flexGrow={1}>
                <Tooltip title={dayjs(property?.updatedOn).toISOString()}>
                  <Stack>
                    <Typography variant="subtitle2">
                      {dayjs(property?.updatedOn).fromNow()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                  </Stack>
                </Tooltip>
              </Stack>
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
