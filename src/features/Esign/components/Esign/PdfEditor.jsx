import React, { useCallback, useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { CurrencyLiraRounded } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ConfirmationBox, {
  DefaultConfirmationBoxProps,
} from "common/ConfirmationBox";
import CustomSnackbar from "common/CustomSnackbar";
import RowHeader from "common/RowHeader";
import { fetchLoggedInUser } from "common/utils";
import {
  useCreateEsignDocumentMutation,
  useGetEsignDocumentsByUserIdQuery,
  useGetEtssTokensByEmailIdQuery,
} from "features/Api/esignApi";
import { useSendPreparedDocumentMutation } from "features/Api/externalIntegrationMultipart";
import UploadEsignDocument from "features/Esign/components/Esign/UploadEsignDocument";
import ViewFile from "features/Esign/components/Esign/ViewFile";
import ViewTokenAlert from "features/Esign/components/Esign/ViewTokenAlert";
import ViewFormTemplates from "features/Esign/components/FormTemplates/ViewFormTemplates";
import ViewSigners from "features/Esign/components/Signers/ViewSigners";
import ViewTokenMenu from "features/Esign/components/TokenMenu/ViewTokenMenu";
import {
  COLOR_ENUM_VALUES,
  GLITTER_KEYFRAMES,
  INITIAL_SIGNER_ENUM_VALUES,
  SCALE,
} from "features/Esign/constants";
import { getSigningFields } from "features/Esign/utils/getSigningFields";
import withDisclaimer from "features/Esign/withDisclaimer";
import { produce } from "immer";
import { PDFDocument } from "pdf-lib";
import { rgb } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
import { celebrations } from "src/utils/celebrations";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PdfEditor = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const user = fetchLoggedInUser();

  const pageHeights = useRef({});
  const pageOffsets = useRef({});

  const dragState = useRef(null);
  const overlayRef = useRef(null);
  const containerRef = useRef(null);

  const {
    data: validTokensForETSS = 0,
    isLoading: isLoadingValidTokensForETSS,
  } = useGetEtssTokensByEmailIdQuery(user?.email, { skip: !user?.email });

  const {
    data: esignDocuments = [],
    isLoading: isEsignDocumentsLoading,
    isSuccess: isEsignDocumentsSuccess,
  } = useGetEsignDocumentsByUserIdQuery(user?.uid, { skip: !user?.uid });

  const [
    executePreparedDocument,
    {
      isLoading: isExecutePreparedDocumentLoading,
      isSuccess: isExecutePreparedDocumentSuccess,
    },
  ] = useSendPreparedDocumentMutation();

  const [createEsignDocument] = useCreateEsignDocumentMutation();

  const [file, setFile] = useState(null);
  const [fields, setFields] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [tokenAnchor, setTokenAnchor] = useState(null);
  const [activeSigner, setActiveSigner] = useState(null);
  const [signers, setSigners] = useState(INITIAL_SIGNER_ENUM_VALUES);
  const [activeFieldType, setActiveFieldType] = useState("signature");

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [signatureBoxes, setSignatureBoxes] = useState([]);
  const [showConfirmationBox, setShowConfirmationBox] = useState(
    DefaultConfirmationBoxProps,
  );

  const isTokenAnchorOpen = Boolean(tokenAnchor);
  const ltMediumFormFactor = useMediaQuery(theme.breakpoints.down("md"));

  const handleCloseTokenAnchorMenu = () => setTokenAnchor(null);
  const handleClickTokenAnchorMenu = (event) => {
    event.stopPropagation();
    setTokenAnchor(event.currentTarget);
  };

  const addFollowUpSigners = () => {
    const idx = signers?.length;
    const colorIdx = (idx - 2) % COLOR_ENUM_VALUES.length;
    const newSigner = {
      id: `signer_${idx}`,
      role: `Signer ${idx}`,
      name: "",
      email_address: "",
      color: COLOR_ENUM_VALUES[Math.abs(colorIdx)],
      order: signers.length,
    };
    setSigners((prev) => [...prev, newSigner]);
  };

  const updateSignerDetails = (data) => {
    const updatedSignerData = produce(signers, (draft) => {
      const signer = draft.find((s) => s?.role === data?.role);

      if (signer) {
        signer.name = data.name;
        signer.email_address = data.email_address;
      }
    });

    setSigners(updatedSignerData);
  };

  const handleConfirm = () =>
    setShowConfirmationBox({ value: true, updateKey: "tenant" });

  const handleUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setScrollTop(0);
    setSignatureBoxes([]);

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

          const DEFAULT_TEXT_SIZE = "16";

          Object.assign(input.style, {
            position: "absolute",
            left: `${left}px`,
            top: `${top}px`,
            width: `${width}px`,
            height: `${height}px`,
            fontSize: `${DEFAULT_TEXT_SIZE}px`,
            lineHeight: `${DEFAULT_TEXT_SIZE}px`,
            padding: "2px 4px",
            boxSizing: "border-box",
            border: "1px solid #ccc",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "500",
          });

          pageDiv.appendChild(input);

          // always adds to newFields, even if hidden to protect export pdf from crashing out
          newFields.push({
            name: fieldName,
            value: a.fieldValue || "",
            type: "text",
          });
        }

        if (a.fieldType === "Btn" && !a.radioButton) {
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
                  rect: a.rect,
                });
              }

              return copy;
            });
          };

          pageDiv.appendChild(input);

          // always adds to newFields, even if hidden to protect export pdf from crashing out
          newFields.push({
            name: fieldName,
            type: "checkbox",
            value: checked ? "Yes" : "Off",
            pageNum,
            rect: a.rect,
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

  const handleRemoveSigner = (signerId) => {
    if (signerId !== "creator") {
      setSigners((prev) => prev.filter((s) => s.id !== signerId));
      setSignatureBoxes((prev) => prev.filter((b) => b.signerId !== signerId));
      if (activeSigner?.id === signerId) setActiveSigner(null);
    }
  };

  const handleSelectSigner = (signer) => {
    if (activeSigner) {
      const activeSignerId = activeSigner?.id;
      if (signer?.id === activeSignerId) {
        setActiveSigner(null);
        return;
      }
    }
    setActiveSigner(signer);
  };

  const removeBox = (boxId) => {
    setSignatureBoxes((prev) => prev.filter((b) => b.id !== boxId));
  };

  const exportPdf = async () => {
    if (!file) return;

    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    const form = pdfDoc.getForm();
    const pages = pdfDoc.getPages();

    const textFields = fields.filter((f) => f.type === "text");
    const checkboxFields = fields.filter((f) => f.type === "checkbox");

    textFields.forEach((stateField) => {
      try {
        const textField = form.getTextField(stateField.name);
        textField.setText(stateField.value || "");
      } catch (err) {
        console.debug("Failed to set text:", stateField.name, err);
      }
    });

    // handle checkboxes differently, since we have to burn the false values
    // as well in the application
    for (const stateField of checkboxFields) {
      try {
        const pageIndex = stateField.pageNum - 1;
        if (pageIndex < 0 || pageIndex >= pages.length) continue;

        const page = pages[pageIndex];
        const [x1, y1] = stateField.rect;

        const isChecked =
          stateField.value === "Yes" || stateField.value === "On";

        const x = x1;
        const y = y1;

        // draw checkbox field
        page.drawRectangle({
          x,
          y,
          width: 10,
          height: 10,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
          color: rgb(1, 1, 1),
        });

        // if checked, draw X
        if (isChecked) {
          page.drawLine({
            start: { x: x + 2, y: y + 2 },
            end: { x: x + 8, y: y + 8 },
            thickness: 1,
            color: rgb(0, 0, 0),
          });

          page.drawLine({
            start: { x: x + 8, y: y + 2 },
            end: { x: x + 2, y: y + 8 },
            thickness: 1,
            color: rgb(0, 0, 0),
          });
        }

        try {
          const field = form.getCheckBox(stateField.name);
          form.removeField(field);
        } catch (e) {
          // eat the exception; no error
          console.debug("Failed to remove the checkbox field", e);
        }
      } catch (err) {
        console.debug("Failed to process checkbox:", stateField.name, err);

        // if buring the checkbox fails, we let the acroForm handle it
        try {
          const cb = form.getCheckBox(stateField.name);
          if (stateField.value === "Yes" || stateField.value === "On") {
            cb.check();
          } else {
            cb.uncheck();
          }
        } catch (e) {
          // do nothing; eat the exception
          console.debug(
            "Failed to process checkbox using acroform after attempting to burn the checkboxes. ",
            e,
          );
        }
      }
    }

    try {
      form.flatten();
    } catch (err) {
      console.debug("Unable to flatten form.", err);
    }

    const finalBytes = await pdfDoc.save();
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([finalBytes], { type: "application/pdf" }),
      "prepared-esign.pdf",
    );
    formData.append("fUrl", "0029_SendPreparedEsignDocument");
    formData.append("fMethod", "POST");
    formData.append("title", "Lease agreement");
    formData.append("subject", "Requesting electronic signature");
    formData.append("signers", JSON.stringify(signers));
    formData.append("userId", user?.uid);
    formData.append("stripeCustomerEmail", user?.email);
    formData.append(
      "message",
      "Please review and sign the provided document at your earliest convenience",
    );

    const formFields = getSigningFields(signatureBoxes);
    formData.append("formFieldsPerDocument", JSON.stringify(formFields));

    console.log(formData);
    await createEsignDocument(formData).unwrap();
    executePreparedDocument(formData);
  };

  const getCoordsForCanvas = useCallback((clientX, clientY) => {
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

  const handleMouseDown = useCallback(
    (e) => {
      if (!activeSigner) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      const hit = getCoordsForCanvas(e.clientX, e.clientY);
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
    [activeSigner, getCoordsForCanvas],
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!dragState.current || !overlayRef.current) return;
      const hit = getCoordsForCanvas(e.clientX, e.clientY);
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
    [getCoordsForCanvas],
  );

  const handleMouseUp = useCallback(
    (e) => {
      if (!dragState.current || !overlayRef.current) return;

      const hit = getCoordsForCanvas(e.clientX, e.clientY);
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
          fieldType: activeFieldType,
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
    [getCoordsForCanvas, activeFieldType],
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
    if (isExecutePreparedDocumentSuccess && !isExecutePreparedDocumentLoading) {
      setFields([]);
      setFile(null);
      setShowSnackbar(true);
      setShowConfirmationBox({ value: false, updateKey: "" });
      navigate(0);
      celebrations.commonConfetti();
    }
  }, [isExecutePreparedDocumentLoading]);

  useEffect(() => {
    if (isEsignDocumentsSuccess && !isEsignDocumentsLoading) {
      // populate the field with the document
      console.log(esignDocuments);
    }
  }, [isEsignDocumentsLoading]);

  return (
    <Stack data-tour="esign-0">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        paddingBottom="1rem"
      >
        <RowHeader
          title="Create E-signature"
          caption="Create or revise documents for Esign"
          sxProps={{
            textAlign: "left",
            fontWeight: "bold",
            color: "text.secondary",
          }}
        />
        <Stack>
          <Tooltip
            title={
              !isTokenAnchorOpen ? "Add non-refundable tokens for E-sign" : null
            }
          >
            <Stack
              spacing={1}
              direction="row"
              alignItems="flex-end"
              justifyContent="center"
              onClick={handleClickTokenAnchorMenu}
              data-tour="esign-1"
              sx={{
                border: 1,
                paddingY: 0.5,
                marginBottom: 0.5,
                cursor: "pointer",
                borderColor: "primary.main",
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  animation: `${GLITTER_KEYFRAMES} 1s ease-in-out infinite`,
                }}
              >
                <CurrencyLiraRounded fontSize="small" color="primary" />
              </Box>
              <Typography variant="caption" color="primary">
                Non-Refundable Tokens: {validTokensForETSS}
              </Typography>
            </Stack>
          </Tooltip>
          <ViewTokenMenu
            anchorEl={tokenAnchor}
            open={isTokenAnchorOpen}
            handleClose={handleCloseTokenAnchorMenu}
          />
          <Stack direction="row" spacing={1}>
            <UploadEsignDocument
              handleUpload={handleUpload}
              isDisabled={ltMediumFormFactor}
            />
            <Box data-tour="esign-7">
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
      </Stack>
      <ViewTokenAlert tokenCount={validTokensForETSS} />
      {!ltMediumFormFactor && <ViewFormTemplates handleUpload={handleUpload} />}
      {ltMediumFormFactor ? (
        <Alert severity="error">
          <Typography variant="subtitle2">
            Due to the nature of document security, electronic signatures are
            prohibited from being created in smaller screen sizes. Please use
            laptop or a tablet to proceed.
          </Typography>
        </Alert>
      ) : (
        <ViewFile
          file={file}
          containerRef={containerRef}
          signers={signers}
          activeSigner={activeSigner}
          handleSelectSigner={handleSelectSigner}
          updateSignerDetails={updateSignerDetails}
          setScrollTop={setScrollTop}
          signatureBoxes={signatureBoxes}
          removeBox={removeBox}
          scrollTop={scrollTop}
          pageOffsets={pageOffsets}
          activeFieldType={activeFieldType}
          setActiveFieldType={setActiveFieldType}
          addFollowUpSigners={addFollowUpSigners}
          handleRemoveSigner={handleRemoveSigner}
        />
      )}

      <ConfirmationBox
        isBlocked={validTokensForETSS <= 0}
        title="Send document to signers?"
        captionText="Action consumes 1 non-refundable token. Proceed?"
        isOpen={showConfirmationBox?.value}
        isLoading={isExecutePreparedDocumentLoading}
        handleCancel={() =>
          setShowConfirmationBox({ value: false, updateKey: "" })
        }
        handleConfirm={exportPdf}
      >
        <ViewSigners
          signers={signers}
          tokenCount={validTokensForETSS}
          signatureBoxes={signatureBoxes}
        />
      </ConfirmationBox>

      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved. Processing request to E-sign"
      />
    </Stack>
  );
};

export default withDisclaimer(PdfEditor);
