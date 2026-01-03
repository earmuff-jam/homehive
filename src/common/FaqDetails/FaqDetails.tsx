import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import RowHeader from "common/RowHeader/RowHeader";
import { InvoicerFrequentlyAskedQuestion } from "features/Invoice/components/Faq/FrequentlyAskedQuestions";

type FrequentlyAskedQuestionsProps = {
  data: InvoicerFrequentlyAskedQuestion[];
};

export default function FaqDetails({ data }: FrequentlyAskedQuestionsProps) {
  return (
    <Stack spacing={2} alignItems="center">
      <RowHeader
        title="Frequently asked questions"
        caption="Answers to common questions you may have."
      />

      <Box
        sx={{
          mx: "auto",
          maxWidth: { sm: "none", md: "50%" },
        }}
      >
        {data?.map((item, index) => {
          return (
            <Accordion
              key={index}
              defaultExpanded={index === 0}
              disableGutters
              elevation={0}
              sx={{ marginBottom: "1rem" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon fontSize="small" />}
              >
                <Stack direction="row" spacing={1}>
                  <IconButton size="small">{item.icon}</IconButton>
                  <Typography fontWeight="bold" fontSize="0.875rem">
                    {item.question}
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Stack>
  );
}
