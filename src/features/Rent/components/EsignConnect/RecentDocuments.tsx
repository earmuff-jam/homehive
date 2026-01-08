import { Card, Skeleton, Typography } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";

// TRecentDocumentsProps ...
export type TRecentDocumentsProps = {
  documents: string[];
  loading: boolean;
};

export default function RecentDocuments({
  documents = [],
  loading,
}: TRecentDocumentsProps) {
  return (
    <Card elevation={0} sx={{ p: 1 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Recent documents
      </Typography>

      {loading ? (
        <Skeleton variant="rectangular" height={100} />
      ) : documents.length === 0 ? (
        <EmptyComponent
          caption="Create records to begin."
          sxProps={{ variant: "subtitle2" }}
        />
      ) : null}
    </Card>
  );
}
