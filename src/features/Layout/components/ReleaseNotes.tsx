import { useEffect, useState } from "react";

import dayjs from "dayjs";

import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { TReleaseDetails, TReleaseNotes } from "src/types";

// TFeatureTag ...
type TFeatureTag = "Features";
// TImprovementTag ...
type TImprovementTag = "Improvements";
// TFixTag ...
type TFixTag = "Fixes";

// TTypeLabelTypes ...
type TTypeLabelTypes = {
  Features: TFeatureTag;
  Improvements: TImprovementTag;
  Fixes: TFixTag;
};

const typeLabels: TTypeLabelTypes = {
  Features: "Features",
  Improvements: "Improvements",
  Fixes: "Fixes",
};

//  groupReleaseNotes ...
// defines a function that groups array values by type of release note
const groupReleaseNotes = (
  items: TReleaseNotes[],
): Record<string, TReleaseNotes[]> => {
  return items.reduce<Record<string, TReleaseNotes[]>>((acc, item) => {
    const type = item.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});
};

export default function ReleaseNotes() {
  const [data, setData] = useState<TReleaseDetails | null>(null);

  const groupedNotes = groupReleaseNotes(data.notes);

  useEffect(() => {
    fetch("/release-docs.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <>
      <Box margin="2rem 1rem">
        <Typography variant="h5" component="h2" gutterBottom>
          Release Notes
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textTransform="initial"
        >
          View the latest updates and changes to HomeHiveSolutions.
        </Typography>
      </Box>
      <Box mb={4} px={2}>
        <Typography variant="subtitle2" gutterBottom>
          Version {data.version} &mdash;&nbsp;
          <em>Released on {dayjs(data.date).format("MMMM-DD-YYYY")}</em>
        </Typography>

        {Object.entries(groupedNotes).map(([type, items]) => (
          <Box key={type} mt={2}>
            <Typography
              variant="body2"
              fontWeight={600}
              gutterBottom
              textTransform="capitalize"
            >
              {typeLabels[type] || type}
            </Typography>

            <List dense disablePadding>
              {items.map((change, idx) => (
                <ListItem key={idx} disableGutters alignItems="center">
                  <ListItemIcon sx={{ minWidth: 24, mt: 0.5 }}>
                    <FiberManualRecordIcon sx={{ fontSize: 6 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography color="text.secondary" variant="subtitle2">
                        {change.value}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {change.caption}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>
    </>
  );
}
