import React, { useState } from "react";

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
import LeaseHealthAccordion from "features/Rent/components/Reporting/LeaseHealthAccordion";
import MaintenanceHealthAccordion from "features/Rent/components/Reporting/MaintenanceHealthAccordion";
import PropertyHealthAccordion from "features/Rent/components/Reporting/PropertyHealthAccordion";
import RentCollectionAccordion from "features/Rent/components/Reporting/RentCollectionAccordion";

// DefaultMaintenanceOptions ...
// defines the default maintenance options
const DefaultMaintenanceOptions = [
  {
    id: 1,
    label: "HVAC",
    value: 0,
  },
  {
    id: 2,
    label: "Plumbing",
    value: 0,
  },
  {
    id: 3,
    label: "Appliances",
    value: 0,
  },
  {
    id: 4,
    label: "Electrical",
    value: 0,
  },
];

// DefaultAccordionOptions ...
// defines the default accordion options
const DefaultAccordionOptions = [
  {
    id: 1,
    label: "Vacancy & Occupancy",
  },
  {
    id: 2,
    label: "Lease Health",
  },
  {
    id: 3,
    label: "Rent Collection",
  },
  {
    id: 4,
    label: "Maintenance",
  },
];

const Statistics = ({
  properties = [],
  existingTenants = [],
  existingRents = [],
}) => {
  const [selected, setSelected] = useState("");

  const handleChange = (event) => setSelected(event.target.value);

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
            label={DefaultAccordionOptions[0].label}
            selected={selected}
            properties={properties}
            existingTenants={existingTenants}
          />
          <LeaseHealthAccordion
            label={DefaultAccordionOptions[1].label}
            selected={selected}
            properties={properties}
            existingTenants={existingTenants}
          />
          <RentCollectionAccordion
            label={DefaultAccordionOptions[2].label}
            selected={selected}
            properties={properties}
            existingRents={existingRents}
            existingTenants={existingTenants}
          />
          <MaintenanceHealthAccordion
            label={DefaultAccordionOptions[3].label}
            selected={selected}
            properties={properties}
            existingRents={existingRents}
            existingTenants={existingTenants}
          />
          <Stack spacing={1} flexGrow={1}>
            <Typography textTransform="uppercase">
              Top Maintenance Issues
            </Typography>
            <Paper sx={{ padding: 1, bgcolor: "background.default" }}>
              <List>
                {DefaultMaintenanceOptions?.map((option) => (
                  <ListItem key={option?.id} sx={{ padding: 1, gap: 1 }}>
                    <Typography minWidth="8rem">{option?.label}</Typography>
                    <Slider
                      color="info"
                      defaultValue={option?.value}
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
