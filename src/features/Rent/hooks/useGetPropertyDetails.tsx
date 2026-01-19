import dayjs, { Dayjs } from "dayjs";

import {
  AssignmentLateRounded,
  ManageHistoryRounded,
  MoneyOffRounded,
  PaidRounded,
  PaymentRounded,
} from "@mui/icons-material";
import { TProperty } from "features/Rent/Rent.schema";
import {
  TRentRecordPayload,
  TTenant,
  TUseGetPropertyDetailsResponse,
} from "features/Rent/Rent.types";
import {
  ManualRentStatusEnumValue,
  PaidRentStatusEnumValue,
} from "features/Rent/utils";

// useGetPropertyDetails ...
// defines a function to return various property stats
const useGetPropertyDetails = (
  gracePeriod: number,
  rentStartDate: string,
  isAnyTenantSor: boolean,
  property: TProperty,
  tenants: TTenant[],
  rents: TRentRecordPayload[],
): TUseGetPropertyDetailsResponse => {
  const currentMonth = dayjs().format("MMMM");
  const rent = rents?.find(
    (rent) =>
      rent.rentMonth === currentMonth &&
      (PaidRentStatusEnumValue === rent.status?.toLowerCase() ||
        ManualRentStatusEnumValue === rent.status?.toLowerCase()),
  );

  let totalRent = property.rent + property.additionalRent;
  let occupancyRate = tenants?.length > 0 ? 100 : 0;
  if (isAnyTenantSor) {
    totalRent = tenants.reduce(
      (total: number, tenant: TTenant) =>
        total + tenant.rent + property.additionalRent,
      0,
    );
    const totalUnits = property.units;
    const occupiedUnits = tenants.length;
    occupancyRate =
      totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  }

  if (!rent || !rentStartDate)
    return {
      color: "warning",
      label: "In process",
      icon: <ManageHistoryRounded />,
      totalRent: totalRent,
      occupancyRate: occupancyRate,
    };

  const leaseStart = dayjs(rentStartDate, "MM-DD-YYYY");
  if (dayjs().isBefore(leaseStart, "day"))
    return {
      color: "info",
      label: "Processing",
      icon: <PaymentRounded />,
      totalRent: totalRent,
      occupancyRate: occupancyRate,
    };
  const graceDate = dayjs().startOf("month").add(gracePeriod, "day");
  const pastGracePeriod = dayjs().isAfter(graceDate, "day");

  if (
    rent?.status.toLowerCase() === PaidRentStatusEnumValue ||
    rent?.status.toLowerCase() === ManualRentStatusEnumValue
  ) {
    return {
      color: "success",
      label: "Paid",
      icon: <PaidRounded />,
      totalRent: totalRent,
      occupancyRate: occupancyRate,
    };
  } else if (pastGracePeriod) {
    return {
      color: "error",
      label: "Overdue",
      icon: <AssignmentLateRounded />,
      totalRent: totalRent,
      occupancyRate: occupancyRate,
    };
  } else {
    return {
      color: "warning",
      label: "Unpaid",
      icon: <MoneyOffRounded />,
      totalRent: totalRent,
      occupancyRate: occupancyRate,
    };
  }
};

export default useGetPropertyDetails;
