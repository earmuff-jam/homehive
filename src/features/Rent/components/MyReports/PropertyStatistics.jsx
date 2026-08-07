import React, { useMemo } from "react";

import { Stack } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import { useGetMaintenanceRecordsQuery } from "features/Api/maintenanceApi";
import LeaseHealthAccordion from "features/Rent/components/MyReports/LeaseHealthAccordion";
import MaintenanceHealthAccordion from "features/Rent/components/MyReports/MaintenanceHealthAccordion";
import PropertyHealthAccordion from "features/Rent/components/MyReports/PropertyHealthAccordion";
import RentCollectionAccordion from "features/Rent/components/MyReports/RentCollectionAccordion";
import {
  DefaultAccordionOptions,
  DefaultMaintenanceCategoryTypes,
} from "features/Rent/constants";
import { useSelectedPropertyDetails } from "features/Rent/hooks/useGetSelectedPropertyDetails";

const PropertyStatistics = ({
  properties = [],
  selected,
  existingTenants = [],
  existingRents = [],
}) => {
  const selectedProperty = properties.find(
    (property) => property?.id === selected,
  );

  const { totalRent } = useSelectedPropertyDetails(
    selectedProperty,
    existingTenants,
  );

  const { data: maintenanceRecords, isFetching: isMaintenanceRecordsFetching } =
    useGetMaintenanceRecordsQuery(
      { propertyId: selected },
      { skip: !selected },
    );

  const formattedMaintenanceCategoryOptions = useMemo(() => {
    const selectedPropertyRecords =
      maintenanceRecords?.filter((rc) => rc.propertyId === selected) || [];

    const categoryCounts = selectedPropertyRecords.reduce((acc, record) => {
      const category = record.maintenanceCategory;

      acc[category] = (acc[category] || 0) + 1;

      return acc;
    }, {});

    return DefaultMaintenanceCategoryTypes.map((category) => ({
      ...category,
      value: categoryCounts[category.label] || 0,
    }));
  }, [isMaintenanceRecordsFetching, selected]);

  if (properties?.length <= 0)
    return <EmptyComponent caption="Add properties to view statistics" />;

  return (
    <Stack marginTop={2}>
      {selected ? (
        <>
          <PropertyHealthAccordion
            dataTour="report-stats-4"
            label={DefaultAccordionOptions[0].label}
            selected={selected}
            properties={properties}
            existingTenants={existingTenants}
          />
          <LeaseHealthAccordion
            dataTour="report-stats-5"
            label={DefaultAccordionOptions[1].label}
            selected={selected}
            properties={properties}
            existingTenants={existingTenants}
          />
          <RentCollectionAccordion
            dataTour="report-stats-6"
            label={DefaultAccordionOptions[2].label}
            selected={selected}
            properties={properties}
            existingRents={existingRents}
            existingTenants={existingTenants}
          />
          <MaintenanceHealthAccordion
            dataTour="report-stats-7"
            label={DefaultAccordionOptions[3].label}
            maintenanceRecords={maintenanceRecords}
            totalRentalIncomeForYr={totalRent * 12}
            formattedMaintenanceCategoryOptions={
              formattedMaintenanceCategoryOptions
            }
          />
        </>
      ) : (
        <EmptyComponent caption="Select a property to view statistics" />
      )}
    </Stack>
  );
};

export default PropertyStatistics;
