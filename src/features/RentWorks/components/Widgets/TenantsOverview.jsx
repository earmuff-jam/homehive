import { GroupOutlined } from "@mui/icons-material";
import {
  Badge,
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader/RowHeader";
import Tenants from "features/RentWorks/components/Widgets/Tenants";

export default function TenantsOverview({
  property,
  tenants = [],
  isTenantsLoading,
  toggleAssociateTenantsPopup,
  dataTour,
}) {
  return (
    <Card sx={{ mb: 3 }} data-tour={dataTour}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ margin: "0rem 0rem 1rem 0rem" }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box>
              {tenants.length !== 0 ? (
                <Tooltip title="Total number of currently active tenants">
                  <Badge badgeContent={tenants.length} color="textSecondary">
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <GroupOutlined color="info" />
                    </Typography>
                  </Badge>
                </Tooltip>
              ) : null}
            </Box>
            <RowHeader
              title="Tenants"
              caption={`Active tenants for ${property?.name}`}
              sxProps={{
                alignItems: "flex-start",
                color: "text.secondary",
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Box>
              <Tooltip title="Associate tenants">
                <AButton
                  size="small"
                  variant="outlined"
                  onClick={() => toggleAssociateTenantsPopup()}
                  label="Associate tenants"
                />
              </Tooltip>
            </Box>
          </Stack>
        </Stack>
        {isTenantsLoading ? (
          <Skeleton height="5rem" />
        ) : tenants.length === 0 ? (
          <EmptyComponent
            caption="Associate tenants to begin."
            sxProps={{ textTransform: "initial" }}
          />
        ) : (
          <Tenants tenants={tenants || []} property={property} />
        )}
      </CardContent>
    </Card>
  );
}
