import React, { useCallback, useEffect, useRef, useState } from "react";

import { Box, Button, Stack } from "@mui/material";
import ConfirmationBox, {
  DefaultConfirmationBoxProps,
} from "common/ConfirmationBox";
import CustomSnackbar from "common/CustomSnackbar";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader";
import { useSendPreparedDocumentMutation } from "features/Api/externalIntegrationMultipart";
import UploadEsignDocument from "features/Esign/components/Esign/UploadEsignDocument";
import AddSigner from "features/Esign/components/Signers/AddSigner";
import ViewSigners from "features/Esign/components/Signers/ViewSigners";
import SigningBox from "features/Esign/components/ViewPdf/SigningBox";
import ViewPdf from "features/Esign/components/ViewPdf/ViewPdf";
import ViewSigningFields from "features/Esign/components/ViewPdf/ViewSigningFields";
import { produce } from "immer";
import { PDFDocument } from "pdf-lib";
import { StandardFonts, rgb } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const SCALE = 1.5;
const CONTAINER_PADDING_TOP = 16; // 1rem

// ColorEnumValues ...
// used to color code the follow up signers
const ColorEnumValues = ["#dc2626", "#9333ea", "#ea580c", "#0891b2"];

// InitialSignerEnumValues ...
// defines a constant default signer option when a new pdf is added to esign
const InitialSignerEnumValues = [
  {
    id: "creator",
    role: "Creator",
    name: "",
    email: "",
    color: "#2563eb",
    order: 0,
  },
];

export default function PdfEditor() {
  const containerRef = useRef(null);
  const dragState = useRef(null);

  const overlayRef = useRef(null);
  const pageHeights = useRef({});
  const pageOffsets = useRef({});

  const [sendPreparedDocument, sendPrepareDocumentResult] =
    useSendPreparedDocumentMutation();

  const [file, setFile] = useState(null);
  const [fields, setFields] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [activeSigner, setActiveSigner] = useState(null);
  const [signers, setSigners] = useState(InitialSignerEnumValues);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [signatureBoxes, setSignatureBoxes] = useState([]);
  const [showConfirmationBox, setShowConfirmationBox] = useState(
    DefaultConfirmationBoxProps,
  );

  const addFollowUpSigners = () => {
    const idx = signers?.length;
    const colorIdx = (idx - 2) % ColorEnumValues.length;
    const newSigner = {
      id: `signer_${idx}`,
      role: `Signer ${idx}`,
      name: "",
      email: "",
      color: ColorEnumValues[Math.abs(colorIdx)],
      order: signers.length,
    };
    setSigners((prev) => [...prev, newSigner]);
  };

  const updateSignerDetails = (data) => {
    const updatedSignerData = produce(signers, (draft) => {
      const signer = draft.find((s) => s?.role === data?.role);

      if (signer) {
        signer.name = data.name;
        signer.email = data.email;
      }
    });

    setSigners(updatedSignerData);
  };

  const handleConfirm = () =>
    setShowConfirmationBox({ value: true, updateKey: "tenant" });

  // handleUpload ...
  // defines a function that is used to upload a pdf to the canvas for editing
  // purposes. this function sets up the conditions to fill the pdf acro form
  const handleUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setSignatureBoxes([]);
    setScrollTop(0);
    pageHeights.current = {};
    pageOffsets.current = {};

    const bytes = await uploadedFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
    const container = containerRef.current;
    container.innerHTML = "";

    const newFields = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      const viewport = page.getViewport({ scale: SCALE });

      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      await page.render({ canvasContext: ctx, viewport }).promise;

      const pageDiv = document.createElement("div");
      pageDiv.dataset.page = pageNum;
      pageDiv.style.position = "relative";
      pageDiv.style.marginBottom = "12px";
      pageDiv.appendChild(canvas);

      pageHeights.current[pageNum] = viewport.height;

      const annotations = await page.getAnnotations();
      annotations.forEach((a) => {
        if (a.subtype !== "Widget") return;
        const fieldName = a.fieldName || `field_${pageNum}_${a.id}`;
        const [x1, y1, x2, y2] = a.rect;
        const left = x1 * SCALE;
        const top = viewport.height - y2 * SCALE;
        const width = (x2 - x1) * SCALE;
        const height = (y2 - y1) * SCALE;

        if (a.fieldType === "Tx") {
          let input;
          if (a.datetimeType === "date") {
            input = document.createElement("input");
            input.type = "date";
          } else if (a.multiLine) {
            input = document.createElement("textarea");
            input.style.resize = "none";
          } else {
            input = document.createElement("input");
            input.type = "text";
          }
          if (a.fieldValue) {
            if (a.datetimeType === "date") {
              const [mm, dd, yyyy] = a.fieldValue.split("/");
              input.value = `${yyyy}-${mm}-${dd}`;
            } else {
              input.value = a.fieldValue;
            }
          }
          input.oninput = (ev) => {
            let value = ev.target.value;
            if (a.datetimeType === "date" && value) {
              const [yyyy, mm, dd] = value.split("-");
              value = `${mm}/${dd}/${yyyy}`;
            }
            setFields((prev) => {
              const copy = [...prev];
              const existing = copy.find((f) => f.name === fieldName);
              if (existing) existing.value = value;
              else copy.push({ name: fieldName, value, type: "text" });
              return copy;
            });
          };
          Object.assign(input.style, {
            position: "absolute",
            left: `${left}px`,
            top: `${top}px`,
            width: `${width}px`,
            height: `${height}px`,
          });
          pageDiv.appendChild(input);
          newFields.push({
            name: fieldName,
            value: a.fieldValue || "",
            type: "text",
          });
        }

        if (a.fieldType === "Btn" && !a.radioButton) {
          const input = document.createElement("input");
          input.type = "checkbox";
          input.checked = a.fieldValue === "Yes" || a.fieldValue === "On";
          Object.assign(input.style, {
            position: "absolute",
            left: `${left}px`,
            top: `${top}px`,
            width: `${width}px`,
            height: `${height}px`,
            cursor: "pointer",
            opacity: "0.7",
            margin: "0",
          });
          input.onchange = () => {
            setFields((prev) => {
              const copy = [...prev];
              const f = copy.find(
                (f) => f.name === fieldName && f.pageNum === pageNum,
              );
              if (f) f.value = input.checked ? "Yes" : "Off";
              return copy;
            });
          };
          pageDiv.appendChild(input);
          newFields.push({
            name: fieldName,
            type: "checkbox",
            value: a.fieldValue || a.defaultFieldValue || "",
            pageNum,
          });
        }

        if (a.fieldType === "Btn") {
          const input = document.createElement("input");
          input.type = "checkbox";

          const checked = a.fieldValue === "Yes" || a.fieldValue === "On";

          input.checked = checked;

          Object.assign(input.style, {
            position: "absolute",
            left: `${left}px`,
            top: `${top}px`,
            width: `${width}px`,
            height: `${height}px`,
            cursor: "pointer",
            opacity: "0.7",
            margin: "0",
          });

          input.onchange = () => {
            setFields((prev) => {
              const copy = [...prev];

              const existing = copy.find(
                (f) =>
                  f.name === fieldName &&
                  f.pageNum === pageNum &&
                  f.rect?.[0] === x1 &&
                  f.rect?.[1] === y1,
              );

              const value = input.checked ? "Yes" : "Off";

              if (existing) {
                existing.value = value;
              } else {
                copy.push({
                  name: fieldName,
                  type: "checkbox",
                  value,
                  pageNum,
                  rect: a.rect, // leave original placement for [x] mark
                });
              }

              return copy;
            });
          };

          pageDiv.appendChild(input);

          newFields.push({
            name: fieldName,
            type: "checkbox",
            value: checked ? "Yes" : "Off",
            pageNum,
            rect: a.rect, // leave original placement for [x] mark
          });
        }
      });

      container.appendChild(pageDiv);
    }

    setFields(newFields);

    requestAnimationFrame(() => {
      Array.from(container.querySelectorAll("[data-page]")).forEach((div) => {
        const pn = parseInt(div.dataset.page, 10);
        pageOffsets.current[pn] = div.offsetTop;
      });
    });
  };

  // handleRemoveSigner ...
  // defines a function that removes the selected signer.
  const handleRemoveSigner = (signerId) => {
    if (signerId !== "creator") {
      setSigners((prev) => prev.filter((s) => s.id !== signerId));
      setSignatureBoxes((prev) => prev.filter((b) => b.signerId !== signerId));
      if (activeSigner?.id === signerId) setActiveSigner(null);
    }
  };

  // removeBox ...
  // defines a function that removes the selected box.
  const removeBox = (boxId) => {
    setSignatureBoxes((prev) => prev.filter((b) => b.id !== boxId));
  };

  // generatedSignatureFields ...
  // defines a function that creates new signature fields based
  // on the placement of the signature boxes
  const generatedSignatureFields = (signatureBoxes = []) => {
    if (signatureBoxes.length <= 0) {
      console.debug("Unable to generate signature boxes");
      return;
    }

    return signatureBoxes?.map((signatureBox) => ({
      document_index: 0,
      api_id: "test_sig",
      type: "signature",
      signer:
        signatureBox?.signerId === "landlord"
          ? 0
          : Number(signatureBox?.signerId?.split("_")[1]), // reads tenant_x number to determine the tenant number to sign
      page: signatureBox?.pageNum,
      x: signatureBox?.pdfX,
      y: signatureBox?.pdfY,
      width: signatureBox?.pdfW,
      height: signatureBox?.pdfH,
      required: true,
    }));
  };

  // exportPdf ...
  // defines a function that re-creates the pdf with added signatures
  // and populated values
  const exportPdf = async () => {
    if (!file) return;

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const form = pdfDoc.getForm();
    const pdfFields = form.getFields();

    pdfFields.forEach((f) => {
      try {
        const stateField = fields.find((sf) => sf.name === f.getName());
        if (!stateField) return;

        if (stateField.type === "text") {
          const field = form.getTextField(stateField.name);
          field.setText(stateField.value || "");
        }
      } catch (err) {
        console.debug("Skipping field due to error", f.getName(), err);
      }
    });

    fields.forEach((stateField) => {
      if (
        stateField.type === "checkbox" &&
        (stateField.value === "Yes" || stateField.value === "On")
      ) {
        const rect = stateField.rect;
        if (!rect) return;

        const [x1, y1, , y2] = rect;
        const page = pdfDoc.getPage(stateField.pageNum - 1);
        const boxHeight = y2 - y1;
        const fontSize = boxHeight * 0.75;

        page.drawText("X", {
          x: x1,
          y: y1 + boxHeight * 0.15,
          size: fontSize + 3,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      }
    });

    const newBytes = await pdfDoc.save();

    // --- 4. Optional: download locally for testing ---
    const blob = new Blob([newBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prepared-esign.pdf";
    a.click();

    const formData = new FormData();
    formData.append(
      "file",
      new Blob([newBytes], { type: "application/pdf" }),
      "prepared-esign.pdf",
    );
    formData.append("fUrl", "0029_SendPreparedEsignDocument");
    formData.append("fMethod", "POST");
    formData.append("title", "Lease agreement");
    formData.append("subject", "Requesting electronic signature");
    formData.append(
      "message",
      "Please review and sign the provided document at your earliest convenience",
    );

    const createdSignatureFields = generatedSignatureFields(signatureBoxes);
    formData.append(
      "formFieldsPerDocument",
      JSON.stringify(createdSignatureFields),
    );

    sendPreparedDocument(formData);
  };

  // getPageAndLocalCoords ...
  // defines a function that retrieves local co-ordinates when the mouse is moved in the canvas
  const getPageAndLocalCoords = useCallback((clientX, clientY) => {
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const scroll = container.scrollTop;

    const relX = clientX - containerRect.left;
    const relY = clientY - containerRect.top + scroll;

    const pageDivs = Array.from(container.querySelectorAll("[data-page]"));
    for (const div of pageDivs) {
      const pageNum = parseInt(div.dataset.page, 10);
      const top = div.offsetTop;
      const height = div.offsetHeight;
      if (relY >= top && relY <= top + height) {
        return { pageNum, localX: relX, localY: relY - top };
      }
    }
    return null;
  }, []);

  // handleMouseDown ...
  // defines a function that handles mouse button click events in the canvas
  const handleMouseDown = useCallback(
    (e) => {
      if (!activeSigner) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      const hit = getPageAndLocalCoords(e.clientX, e.clientY);
      if (!hit) return;

      e.preventDefault();

      const container = containerRef.current;
      const div = document.createElement("div");
      div.style.cssText = `
        position: absolute;
        border: 2px dashed ${activeSigner.color};
        background: ${activeSigner.color}22;
        pointer-events: none;
        z-index: 100;
        left: ${hit.localX}px;
        top: ${hit.localY}px;
        width: 0px;
        height: 0px;
      `;
      const pageDiv = container.querySelector(`[data-page="${hit.pageNum}"]`);
      pageDiv.appendChild(div);
      overlayRef.current = div;

      dragState.current = {
        pageNum: hit.pageNum,
        startX: hit.localX,
        startY: hit.localY,
        pageDiv,
        signer: activeSigner,
      };
    },
    [activeSigner, getPageAndLocalCoords],
  );

  // handleMouseMove ...
  // defines a function that handles mouse events when the mouse is moved in the canvas
  const handleMouseMove = useCallback(
    (e) => {
      if (!dragState.current || !overlayRef.current) return;
      const hit = getPageAndLocalCoords(e.clientX, e.clientY);
      if (!hit || hit.pageNum !== dragState.current.pageNum) return;

      const { startX, startY } = dragState.current;
      const x = Math.min(hit.localX, startX);
      const y = Math.min(hit.localY, startY);
      const w = Math.abs(hit.localX - startX);
      const h = Math.abs(hit.localY - startY);

      overlayRef.current.style.left = `${x}px`;
      overlayRef.current.style.top = `${y}px`;
      overlayRef.current.style.width = `${w}px`;
      overlayRef.current.style.height = `${h}px`;
    },
    [getPageAndLocalCoords],
  );

  // handleMouseMove ...
  // defines a function that handles mouse events when the mouse is moved in the canvas
  const handleMouseUp = useCallback(
    (e) => {
      if (!dragState.current || !overlayRef.current) return;

      const hit = getPageAndLocalCoords(e.clientX, e.clientY);
      const { startX, startY, pageNum, signer } = dragState.current;

      overlayRef.current.remove();
      overlayRef.current = null;
      dragState.current = null;

      if (!hit || hit.pageNum !== pageNum) return;

      const screenX = Math.min(hit.localX, startX);
      const screenY = Math.min(hit.localY, startY);
      const screenW = Math.abs(hit.localX - startX);
      const screenH = Math.abs(hit.localY - startY);

      if (screenW < 20 || screenH < 10) return;

      const pdfX = screenX / SCALE;
      const pdfY = screenY / SCALE;
      const pdfW = screenW / SCALE;
      const pdfH = screenH / SCALE;

      setSignatureBoxes((prev) => [
        ...prev,
        {
          id: `sigbox_${Date.now()}`,
          signerId: signer.id,
          signerRole: signer.role,
          color: signer.color,
          pageNum,
          screenX,
          screenY,
          screenW,
          screenH,
          pdfX,
          pdfY,
          pdfW,
          pdfH,
        },
      ]);
    },
    [getPageAndLocalCoords],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (
      !sendPrepareDocumentResult.isLoading &&
      sendPrepareDocumentResult.isSuccess
    ) {
      setShowSnackbar(true);
      setShowConfirmationBox({ value: false, updateKey: "" });
    }
  }, [sendPrepareDocumentResult.isLoading]);

  return (
    <Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        paddingBottom="1rem"
      >
        <RowHeader
          title="Create E-signature"
          caption="Create or revise documents for Esign"
          sxProps={{ textAlign: "left" }}
        />
        <Stack direction="row" spacing={1}>
          <UploadEsignDocument handleUpload={handleUpload} />
          <Box>
            <Button
              size="small"
              variant="contained"
              onClick={handleConfirm}
              disabled={!file || fields.length === 0}
            >
              Prepare Esign
            </Button>
          </Box>
        </Stack>
      </Stack>

      {file && (
        <AddSigner
          signers={signers}
          activeSigner={activeSigner}
          setActiveSigner={setActiveSigner}
          updateSignerDetails={updateSignerDetails}
          addFollowUpSigners={addFollowUpSigners}
          handleRemoveSigner={handleRemoveSigner}
        />
      )}

      {file ? (
        <Box sx={{ position: "relative" }}>
          <ViewPdf
            containerRef={containerRef}
            activeSigner={activeSigner}
            setScrollTop={setScrollTop}
            paddingTopPx={CONTAINER_PADDING_TOP}
          />

          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "800px",
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            {signatureBoxes.map((box) => (
              <SigningBox
                key={box.id}
                createdBox={box}
                removeBox={removeBox}
                scrollTop={scrollTop}
                pageOffsets={pageOffsets}
              />
            ))}
          </Box>

          {signatureBoxes.length > 0 && (
            <ViewSigningFields
              removeBox={removeBox}
              signatureBoxes={signatureBoxes}
            />
          )}
        </Box>
      ) : (
        <EmptyComponent caption="Upload pdf file to begin." />
      )}

      <ConfirmationBox
        title="Send document to signers?"
        captionText="Action consumes 1 non-refundable token. Proceed?"
        isOpen={showConfirmationBox?.value}
        handleCancel={() =>
          setShowConfirmationBox({ value: false, updateKey: "" })
        }
        handleConfirm={exportPdf}
      >
        <ViewSigners signers={signers} signatureBoxes={signatureBoxes} />
      </ConfirmationBox>

      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved. Processing request to E-sign"
      />
    </Stack>
  );
}
