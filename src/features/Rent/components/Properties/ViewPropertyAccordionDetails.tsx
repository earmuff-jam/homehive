import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import {
  AssignmentLateRounded,
  CircleNotificationsRounded,
  LoopRounded,
  ReceiptRounded,
} from "@mui/icons-material";
import {
  CheckCircleOutlineRounded,
  EmailRounded,
  ExpandMoreRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import EmptyComponent from "common/EmptyComponent";
import { useCreateEmailMutation } from "features/Api/externalIntegrationsApi";
import { useLazyGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import { useGetTemplatesForPropertyIdQuery } from "features/Api/propertiesApi";
import { useGetTenantByPropertyIdQuery } from "features/Api/tenantsApi";
import {
  TProperty,
  TRentRecordPayload,
  TTemplateObject,
  TTenant,
} from "features/Rent/Rent.types";
import QuickConnectMenu from "features/Rent/components/QuickConnect/QuickConnectMenu";
import { handleQuickConnectAction } from "features/Rent/components/Settings/TemplateProcessor";
import useGetPropertyDetails from "features/Rent/hooks/useGetPropertyDetails";
import { displayNextPaymentDueDate } from "features/Rent/utils";
import { produce } from "immer";

// DefaultTemplateIconValues ...
// defines values that represent each template
export const DefaultTemplateIconValues = {
  invoice: <ReceiptRounded fontSize="small" />,
  reminder: <AssignmentLateRounded fontSize="small" />,
  rent: <CircleNotificationsRounded fontSize="small" />,
  noticeOfLeaseRenewal: <LoopRounded fontSize="small" />,
};

// TViewPropertyAccordionDetailsProps ...
type TViewPropertyAccordionDetailsProps = {
  property: TProperty;
  isRentDetailsLoading: boolean;
  rentDetails: TRentRecordPayload[];
};

const ViewPropertyAccordionDetails = ({
  property,
  rentDetails,
  isRentDetailsLoading,
}: TViewPropertyAccordionDetailsProps) => {
  const navigate = useNavigate();
  const redirectTo = (path: string) => navigate(path);

  const {
    data: propertyOwnerTemplates,
    isLoading: isPropertyOwnerTemplatesLoading,
    isSuccess: isPropertyOwnerTemplatesSuccess,
  } = useGetTemplatesForPropertyIdQuery();

  const { data: tenants = [], isLoading } = useGetTenantByPropertyIdQuery(
    property?.id,
    {
      skip: !property?.id,
    },
  );

  const [triggerGetPropertyOwnerData, propertyOwnerResult] =
    useLazyGetUserDataByIdQuery();

  const [createEmail, createEmailResult] = useCreateEmailMutation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [
    propertyOwnerTemplatesWithAttributes,
    setPropertyOwnerTemplatesWithAttributes,
  ] = useState<TTemplateObject>();

  const isOpen = Boolean(anchorEl);
  const isAnyPropertySoR = tenants?.some((tenant) => tenant.isSoR);
  const primaryTenant: TTenant = tenants?.find((tenant) => tenant.isPrimary);

  const handleCloseQuickConnect = () => setAnchorEl(null);
  const handleOpenQuickConnect = (ev: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(ev.currentTarget);

  const {
    color: statusColor,
    label: statusLabel,
    icon: statusIcon,
    totalRent,
  } = useGetPropertyDetails(
    primaryTenant?.gracePeriod,
    primaryTenant?.startDate,
    isAnyPropertySoR || false,
    property,
    tenants,
    rentDetails,
  );

  useEffect(() => {
    if (isPropertyOwnerTemplatesSuccess) {
      const propertyOwnerTemplatesWithIconAttribute = produce(
        propertyOwnerTemplates,
        (draft) => {
          draft.invoice.icon = DefaultTemplateIconValues[draft.invoice.title];
          draft.rent.icon = DefaultTemplateIconValues[draft.rent.title];
          draft.reminder.icon = DefaultTemplateIconValues[draft.reminder.title];
          draft.noticeOfLeaseRenewal.icon =
            DefaultTemplateIconValues[draft.noticeOfLeaseRenewal.title];
        },
      );
      setPropertyOwnerTemplatesWithAttributes(
        propertyOwnerTemplatesWithIconAttribute,
      );
    }
  }, [isPropertyOwnerTemplatesLoading]);

  useEffect(() => {
    if (createEmailResult.isSuccess) {
      setShowSnackbar(true);
    }
  }, [createEmailResult.isLoading]);

  if (isLoading || isRentDetailsLoading || propertyOwnerResult?.isLoading)
    return <Skeleton height="10rem" />;

  if (!tenants || tenants.length === 0) {
    return <EmptyComponent caption="Add tenants to begin." />;
  }

  return (
    <Stack spacing={2} flexWrap="wrap">
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT SECTION */}
        <Stack direction="row" spacing={2} flex={1}>
          <Avatar sx={{ bgcolor: "primary.main", mt: 0.5 }}>T</Avatar>
          <Stack flexGrow={1}>
            <Stack direction="row" spacing={1}>
              <Tooltip title={primaryTenant?.email}>
                <Typography
                  flexGrow={1}
                  variant="body2"
                  color="primary"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    alignContent: "center",
                    textOverflow: "ellipsis",
                    maxWidth: 150,
                  }}
                >
                  {primaryTenant?.email}
                </Typography>
              </Tooltip>
              <Tooltip title="Primary point of contact">
                <CheckCircleOutlineRounded color="primary" fontSize="small" />
              </Tooltip>
            </Stack>

            <Stack
              direction={{ md: "row", sm: "column" }}
              spacing={1}
              justifyContent="space-around"
              padding={1}
              textAlign="center"
            >
              <Stack>
                <Typography
                  variant="subtitle2"
                  fontSize="1.875rem"
                  color="primary"
                >
                  ${primaryTenant?.rent}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Monthly Rent
                </Typography>
              </Stack>
              <Stack>
                <Typography variant="subtitle2" fontSize="2rem" color="primary">
                  {dayjs(
                    displayNextPaymentDueDate(dayjs(primaryTenant?.startDate)),
                  ).format("MMM DD")}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Next payment due date
                </Typography>
              </Stack>
            </Stack>

            <Box>
              {statusLabel && (
                <Chip
                  size="small"
                  icon={statusIcon}
                  label={statusLabel}
                  color={statusColor}
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
          </Stack>
        </Stack>

        {/* RIGHT SECTION */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          minWidth={180}
          mt={{ xs: 2, sm: 0 }}
          justifyContent="flex-end"
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <Typography
                flexGrow={1}
                variant="body2"
                color="primary"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  alignContent: "center",
                  textOverflow: "ellipsis",
                  maxWidth: 150,
                }}
              >
                {primaryTenant?.email}
              </Typography>
              <Tooltip title="Send Email">
                <IconButton
                  size="small"
                  href={`mailto:${primaryTenant?.email}`}
                  target="_blank"
                >
                  <EmailRounded fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
            <AButton
              label="Quick Connect"
              disabled={tenants?.length <= 0}
              onClick={(e) => {
                e.stopPropagation();
                triggerGetPropertyOwnerData(property?.createdBy);
                handleOpenQuickConnect(e);
              }}
              size="small"
              variant="contained"
              endIcon={<ExpandMoreRounded />}
            />
            <QuickConnectMenu
              open={isOpen}
              anchorEl={anchorEl}
              onClose={handleCloseQuickConnect}
              onMenuItemClick={(action) =>
                handleQuickConnectAction(
                  action,
                  property,
                  totalRent,
                  primaryTenant,
                  propertyOwnerResult.data,
                  propertyOwnerTemplatesWithAttributes,
                  redirectTo,
                  createEmail,
                )
              }
            />
          </Stack>
        </Box>
      </Paper>
      <CustomSnackbar
        severity="success"
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Email sent successfully. Check spam if necessary."
      />
    </Stack>
  );
};

export default ViewPropertyAccordionDetails;
