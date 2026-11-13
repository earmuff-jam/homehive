import React, { useEffect, useRef } from "react";

import {
  CircularProgress,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/material";
import { ESIGN_DOCUMENT_PREVIEW_WIDTH } from "features/Esign/constants";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PdfDocumentPreview = ({ data, isLoading }) => {
  const canvasRef = useRef(null);
  const file = data?.file;

  useEffect(() => {
    if (isLoading || !file || !canvasRef.current) return;

    let pdf = null;

    const renderFirstPage = async () => {
      try {
        const bytes = await file.arrayBuffer();
        pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        const page = await pdf.getPage(1);
        if (!canvasRef.current) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const dpr = window.devicePixelRatio || 1;
        const viewport = page.getViewport({
          scale: (ESIGN_DOCUMENT_PREVIEW_WIDTH / baseViewport.width) * dpr,
        });

        const canvas = canvasRef.current;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${ESIGN_DOCUMENT_PREVIEW_WIDTH}px`;

        await page.render({
          canvasContext: canvas.getContext("2d"),
          viewport,
        }).promise;
      } catch (err) {
        console.debug("Unable to render preview.", err);
      }
    };

    renderFirstPage();

    return () => {
      pdf?.destroy();
    };
  }, [file, isLoading]);

  if (isLoading) {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "100%" }}
        spacing={1}
      >
        <CircularProgress />
        <FormHelperText>Loading Preview</FormHelperText>
      </Stack>
    );
  }

  if (!file) return null;

  return (
    <Stack
      alignItems="center"
      sx={{
        border: 1,
        borderRadius: 1,
        overflow: "hidden",
        borderColor: "divider",
      }}
    >
      <canvas ref={canvasRef} />
      <Typography variant="caption">
        Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
      </Typography>
    </Stack>
  );
};

export default PdfDocumentPreview;
