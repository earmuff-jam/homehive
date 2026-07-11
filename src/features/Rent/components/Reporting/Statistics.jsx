import React, { useMemo, useState } from "react";

import {
  Box,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import { useGetMaintenanceRecordsQuery } from "features/Api/maintenanceApi";
import LeaseHealthAccordion from "features/Rent/components/Reporting/LeaseHealthAccordion";
import MaintenanceHealthAccordion from "features/Rent/components/Reporting/MaintenanceHealthAccordion";
import PropertyHealthAccordion from "features/Rent/components/Reporting/PropertyHealthAccordion";
import RentCollectionAccordion from "features/Rent/components/Reporting/RentCollectionAccordion";
import {
  DefaultAccordionOptions,
  DefaultMaintenanceCategoryTypes,
} from "features/Rent/constants";
import { useSelectedPropertyDetails } from "features/Rent/hooks/useGetSelectedPropertyDetails";

const Statistics = ({
  properties = [],
  existingTenants = [],
  existingRents = [],
}) => {
  const [selected, setSelected] = useState("");
  const handleChange = (event) => setSelected(event.target.value);

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
      <Box>
        <FormControl sx={{ m: 1, minWidth: 320 }} size="small">
          <InputLabel id="selected-property-label-id">
            Select Property
          </InputLabel>
          <Select
            labelId="selected-property-label-id"
            id="selected-property-id"
            value={selected}
            label="Selected Property"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {properties?.map((property) => (
              <MenuItem key={property?.id} value={property.id}>
                {property?.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

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
          />
          <Stack spacing={1} flexGrow={1} data-tour="report-stats-8">
            <Typography textTransform="uppercase">
              Top Maintenance Issues
            </Typography>
            <Paper sx={{ padding: 1, bgcolor: "background.default" }}>
              <List>
                {formattedMaintenanceCategoryOptions?.map((option) => (
                  <ListItem key={option?.id} sx={{ padding: 1, gap: 1 }}>
                    <Typography minWidth="8rem">{option?.label}</Typography>
                    <Slider
                      color="info"
                      value={option?.value ?? 0}
                      step={2}
                      min={option?.value === 0 ? 0 : option?.value - 2} // min is 0 or lowest number
                      max={option?.value + 10}
                      sx={{
                        pointerEvents: "none",
                        "& .MuiSlider-thumb": {
                          display: "none",
                        },
                        "& .MuiSlider-rail": {
                          opacity: 0,
                        },
                      }}
                    />
                    <Typography minWidth="5rem" textAlign="right">
                      {option?.value}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Stack>
        </>
      ) : (
        <EmptyComponent caption="Select a property to view statistics" />
      )}
    </Stack>
  );
};

export default Statistics;
