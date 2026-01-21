import { useEffect, useState } from "react";

import dayjs from "dayjs";

import { ExpandMoreRounded } from "@mui/icons-material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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

//  groupReleaseNoteByFeatureType ...
// defines a function that groups array values by type of release note
const groupReleaseNoteByFeatureType = (
  items: TReleaseNotes[] = [],
): Record<string, TReleaseNotes[]> => {
  return items.reduce<Record<string, TReleaseNotes[]>>((acc, item) => {
    const type = item.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});
};

export default function ReleaseNotes() {
  const [releaseDetails, setReleaseDetails] = useState<TReleaseDetails[]>([]);

  useEffect(() => {
    const loadReleaseNotes = async () => {
      try {
        const res = await fetch("/release-docs.json");
        if (!res.ok) throw new Error("Failed to fetch release notes");
        const response = await res.json();

        setReleaseDetails(response);
      } catch (err) {
        console.error(err);
      }
    };

    loadReleaseNotes();
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

      {releaseDetails.map((releaseDetail, index) => {
        const groupedReleaseNotes = groupReleaseNoteByFeatureType(
          releaseDetail.notes,
        );

        return (
          <Box key={index} mb={4} px={2}>
            <Typography variant="subtitle2" gutterBottom>
              Version {releaseDetail.version}
            </Typography>
            <Typography variant="caption" fontStyle="italic" gutterBottom>
              Released on {dayjs(releaseDetail.date).format("MMMM-DD-YYYY")}
            </Typography>

            {Object.entries(groupedReleaseNotes).map(([type, items], index) => (
              <Accordion key={index} elevation={0}>
                <AccordionSummary
                  expandIcon={<ExpandMoreRounded fontSize="small" />}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    gutterBottom
                    textTransform="capitalize"
                  >
                    {typeLabels[type] || type}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense disablePadding>
                    {items.map((change, idx) => (
                      <ListItem key={idx} disableGutters alignItems="center">
                        <ListItemIcon sx={{ minWidth: 24, mt: 0.5 }}>
                          <FiberManualRecordIcon sx={{ fontSize: 6 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              color="text.secondary"
                              variant="subtitle2"
                            >
                              {change.value}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {change.caption}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        );
      })}
    </>
  );
}
