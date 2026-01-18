import { Card, CardContent, Skeleton, Stack } from "@mui/material";
import { TRentRecordPayload } from "features/Rent/Rent.types";
import RowHeader from "features/Rent/common/RowHeader";
import ViewRentalPaymentSummary from "features/Rent/components/Widgets/ViewRentalPaymentSummary";

// TRentalPaymentOverviewProps ...
type TRentalPaymentOverviewProps = {
  isRentListForPropertyLoading?: boolean;
  rentList?: TRentRecordPayload[];
  propertyName: string;
  dataTour: string;
};

const RentalPaymentOverview = ({
  isRentListForPropertyLoading = false,
  rentList = [],
  propertyName = "",
  dataTour,
}: TRentalPaymentOverviewProps) => {
  return (
    <Card sx={{ mb: 3 }} data-tour={dataTour}>
      <CardContent>
        <RowHeader
          title="Payments Overview"
          caption={`View payment summaries for ${propertyName}`}
          sxProps={{ textAlign: "left", color: "text.secondary" }}
        />
        <Stack spacing={2}>
          {isRentListForPropertyLoading ? (
            <Skeleton height="5rem" />
          ) : (
            <ViewRentalPaymentSummary rentData={rentList} />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RentalPaymentOverview;
