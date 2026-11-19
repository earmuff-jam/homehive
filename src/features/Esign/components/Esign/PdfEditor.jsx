import React, { useCallback, useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";

import { Box, Divider, Stack, useMediaQuery, useTheme } from "@mui/material";
import ConfirmationBox, {
  DefaultConfirmationBoxProps,
} from "common/ConfirmationBox";
import CustomSnackbar from "common/CustomSnackbar";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader";
import { fetchLoggedInUser } from "common/utils";
import {
  useCreateEsignDocumentMutation,
  useGetEsignDocumentsByUserIdQuery,
  useGetEtssTokensByEmailIdQuery,
} from "features/Api/esignApi";
import { useSendPreparedDocumentMutation } from "features/Api/externalIntegrationMultipart";
import EditPdfDocumentPanel from "features/Esign/components/EditPdfDocumentPanel/EditPdfDocumentPanel";
import ViewTokenAlert from "features/Esign/components/Esign/ViewTokenAlert";
import EsignPdfActionButton from "features/Esign/components/EsignPdfActionButton/EsignPdfActionButton";
import ViewFormTemplates from "features/Esign/components/FormTemplates/ViewFormTemplates";
import PdfDocumentReviewBox from "features/Esign/components/PdfDocumentReviewBox/PdfDocumentReviewBox";
import PdfDocumentReviewDialog from "features/Esign/components/Signers/PdfDocumentReviewDialog";
import SigningBox from "features/Esign/components/ViewPdf/SigningBox";
import ViewPdf from "features/Esign/components/ViewPdf/ViewPdf";
import {
  ACTIVE_FORM_TYPE_ENUM_VALUES,
  COLOR_ENUM_VALUES,
  DEFAULT_TEXT_SIZE,
  INITIAL_SIGNER_ENUM_VALUES,
  SCALE,
} from "features/Esign/constants";
import { getEditablePDFData } from "features/Esign/utils/getEditablePDFData";
import { getPdfContentsFromURL } from "features/Esign/utils/getPdfContentsFromFile";
import {
  getSigningFields,
  populateFinalFormData,
} from "features/Esign/utils/getSigningFields";
import withDisclaimer from "features/Esign/withDisclaimer";
import { produce } from "immer";
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

  const [
    createEsignDocument,
    {
      isLoading: isCreateEsignDocumentLoading,
      originalArgs: createEsignDocumentOrginalArgs,
    },
  ] = useCreateEsignDocumentMutation();

  const [file, setFile] = useState(null);
  const [fields, setFields] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);

  const [tokenAnchor, setTokenAnchor] = useState(null);
  const [activeSigner, setActiveSigner] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const [signatureBoxes, setSignatureBoxes] = useState([]);
  const [signers, setSigners] = useState(INITIAL_SIGNER_ENUM_VALUES);

  const [activeFieldType, setActiveFieldType] = useState(
    ACTIVE_FORM_TYPE_ENUM_VALUES.Signature,
  );

  const [showConfirmationBox, setShowConfirmationBox] = useState(
    DefaultConfirmationBoxProps,
  );

  const ltMediumFormFactor = useMediaQuery(theme.breakpoints.down("md"));

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

  const getEditablePdfDocument = async (e, savedFields = []) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) {
      setFile(null);
      setScrollTop(0);
      setSignatureBoxes([]);
      return;
    }

    setScrollTop(0);
    setFile(uploadedFile);
    setFields(e?.fields || []);
    setSigners(e?.signers || []);
    setSignatureBoxes(e?.signatureBoxes || []);

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
            fontSize: `${DEFAULT_TEXT_SIZE}px`,
            padding: "2px 4px",
            boxSizing: "border-box",
            border: "1px solid #ccc",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: "bold",
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

          const savedField = savedFields.find(
            (field) =>
              field.type === "checkbox" &&
              field.name === fieldName &&
              field.pageNum === pageNum,
          );

          const checked = savedField
            ? savedField.value === "Yes"
            : a.fieldValue === "Yes" || a.fieldValue === "On";

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

  const handlePrepareEsign = async (fileUniqueId) => {
    const signingFormFields = getSigningFields(signatureBoxes);
    const { formBytes: populatedEsignDocument } = await getEditablePDFData(
      file,
      fields,
      false, // does not draw checkboxes; since not final version
    );

    if (!populatedEsignDocument) return;
    const previewPopulatedEsignDocument = new Blob([populatedEsignDocument], {
      type: "application/pdf",
    });

    // TODO: creating a document two or more times is just adding the fileName and making it longer why?
    createEsignDocument({
      file: previewPopulatedEsignDocument,
      path: `esign/${user?.uid}/documents/${fileUniqueId}`,
      fileId: fileUniqueId,
      fileName: file?.name,
      userId: user?.uid,
      signers: signers,
      fields: fields,
      signatureBoxes: signatureBoxes,
      signingFormFields: signingFormFields,
      createdAt: dayjs().toISOString(),
      createdBy: user?.uid,
    });

    setShowConfirmationBox({ value: true, updateKey: "esign" });
  };

  const exportPdf = async () => {
    const {
      pdfDoc,
      form,
      formBytes: populatedEsignDocument,
    } = await getEditablePDFData(file, fields);

    if (!populatedEsignDocument || !form) return;

    try {
      form.flatten();
    } catch (err) {
      console.debug("Unable to flatten form.", err);
    }
    const finalBytes = await pdfDoc.save();
    const generatedFormData = populateFinalFormData(
      finalBytes,
      signatureBoxes,
      signers,
      user,
    );

    executePreparedDocument(generatedFormData);
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
          id: `sigbox_${uuidv4()}`,
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
        <EsignPdfActionButton
          file={file}
          fields={fields}
          tokenAnchor={tokenAnchor}
          setTokenAnchor={setTokenAnchor}
          validTokensForETSS={validTokensForETSS}
          ltMediumFormFactor={ltMediumFormFactor}
          handlePrepareEsign={handlePrepareEsign}
          selectedEsignDocument={esignDocuments[0]}
          getEditablePdfDocument={getEditablePdfDocument}
          isLoadingValidTokensForETSS={isLoadingValidTokensForETSS}
          isCreateEsignDocumentLoading={isCreateEsignDocumentLoading}
        />
      </Stack>
      <ViewTokenAlert tokenCount={validTokensForETSS} />
      <Box>
        {ltMediumFormFactor ? (
          <PdfDocumentReviewBox
            isValid={!ltMediumFormFactor}
            errorStr="Due to the nature of document security, electronic signatures are
              prohibited from being created in smaller screen sizes. Please use
              laptop or a tablet to proceed."
          />
        ) : (
          <Stack>
            <ViewFormTemplates
              handleUpload={getEditablePdfDocument}
              savedOptions={esignDocuments}
            />
            {!file ? (
              <EmptyComponent caption="Upload pdf file to begin." />
            ) : (
              <Stack
                direction={{ xs: "column", lg: "row" }}
                spacing={1}
                sx={{
                  alignItems: "center",
                }}
              >
                <Box flex={1} />
                <Box sx={{ position: "relative" }}>
                  <ViewPdf
                    containerRef={containerRef}
                    activeSigner={activeSigner}
                    setScrollTop={setScrollTop}
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
                </Box>
                <EditPdfDocumentPanel
                  signers={signers}
                  activeSigner={activeSigner}
                  handleSelectSigner={handleSelectSigner}
                  activeFieldType={activeFieldType}
                  setActiveFieldType={setActiveFieldType}
                  updateSignerDetails={updateSignerDetails}
                  addFollowUpSigners={addFollowUpSigners}
                  handleRemoveSigner={handleRemoveSigner}
                  removeBox={removeBox}
                  signatureBoxes={signatureBoxes}
                />
              </Stack>
            )}
          </Stack>
        )}
      </Box>

      <ConfirmationBox
        maxWidth="md"
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
        <PdfDocumentReviewDialog
          signers={signers}
          tokenCount={validTokensForETSS}
          signatureBoxes={signatureBoxes}
          previewData={createEsignDocumentOrginalArgs}
          isCreateEsignDocumentLoading={isCreateEsignDocumentLoading}
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
