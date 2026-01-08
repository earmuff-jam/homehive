import { PersonAddRounded } from "@mui/icons-material";
import {
  Badge,
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AButton from "common/AButton";
import AIconButton from "common/AIconButton";
import EmptyComponent from "common/EmptyComponent";
import { TProperty, TTenant } from "features/Rent/Rent.types";
import RowHeader from "features/Rent/common/RowHeader";
import Tenants from "features/Rent/components/Widgets/Tenants";

// TTenantsOverviewProps ...
type TTenantsOverviewProps = {
  property: TProperty;
  tenants?: TTenant[];
  isTenantsLoading: boolean;
  toggleAssociateTenantsPopup: () => void;
  dataTour?: string;
};

const TenantsOverview = ({
  property,
  tenants = [],
  isTenantsLoading,
  toggleAssociateTenantsPopup,
  dataTour,
}: TTenantsOverviewProps) => {
  const theme = useTheme();
  const medFormFactor = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Card sx={{ mb: 3 }} data-tour={dataTour}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ mb: "1rem" }}
        >
          <RowHeader
            title="Tenants"
            caption={`Active tenants for ${property?.name}`}
            sxProps={{
              textAlign: "left",
              color: "text.secondary",
            }}
          />

          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Associate tenants">
              <Badge badgeContent={tenants.length} color="error">
                <Box>
                  {medFormFactor ? (
                    <AIconButton
                      size="small"
                      label={<PersonAddRounded fontSize="small" />}
                      onClick={toggleAssociateTenantsPopup}
                    />
                  ) : (
                    <AButton
                      size="small"
                      variant="outlined"
                      label="Associate tenants"
                      onClick={toggleAssociateTenantsPopup}
                    />
                  )}
                </Box>
              </Badge>
            </Tooltip>
          </Stack>
        </Stack>

        {isTenantsLoading ? (
          <Skeleton height="5rem" />
        ) : tenants.length === 0 ? (
          <EmptyComponent caption="Associate tenants to begin." />
        ) : (
          <Tenants tenants={tenants} property={property} />
        )}
      </CardContent>
    </Card>
  );
};

export default TenantsOverview;
