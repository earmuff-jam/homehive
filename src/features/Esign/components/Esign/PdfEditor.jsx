import React, { useCallback, useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";

import { CurrencyLiraRounded } from "@mui/icons-material";
import {
  Alert,
  Box,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AButton from "common/AButton";
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
  ACTIVE_FORM_TYPE_ENUM_VALUES,
  COLOR_ENUM_VALUES,
  DEFAULT_TEXT_SIZE,
  GLITTER_KEYFRAMES,
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

  const getEditablePdfDocument = async (e, savedFields = []) => {
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

  const handleConfirm = async (fileUniqueId) => {
    const fileName = `${uuidv4()}-${file.name}`;
    const signingFormFields = getSigningFields(signatureBoxes);
    const populatedEsignDocument = await getEditablePDFData(
      file,
      fields,
      false,
    );

    if (!populatedEsignDocument) return;

    // TODO: creating a document two or more times is just adding the fileName and making it longer why?
    createEsignDocument({
      file: new Blob([populatedEsignDocument], {
        type: "application/pdf",
      }),
      path: `esign/${user?.uid}/documents/${fileName}`,
      fileId: fileUniqueId,
      fileName: fileName,
      userId: user?.uid,
      signers: signers,
      fields: fields,
      signatureBoxes: signatureBoxes,
      signingFormFields: signingFormFields,
      createdAt: dayjs().toISOString(),
      createdBy: user?.uid,
    });

    setShowConfirmationBox({ value: true, updateKey: "tenant" });
  };

  const exportPdf = async () => {
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

    console.log("end result = ", JSON.stringify(generatedFormData));
    // executePreparedDocument(generatedFormData);
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
    // TODO: Limit users to the number of properties they have to create document.
    // TODO: We currently fetch all documents, refactor to allow users to chose which document to pursue
    if (isEsignDocumentsSuccess && !isEsignDocumentsLoading) {
      const fetchPdf = async () => {
        const firstDocument = esignDocuments[0];

        if (!firstDocument) return;

        try {
          const pdfContentsFromFile = await getPdfContentsFromURL(
            firstDocument.filePath,
            firstDocument.fileName,
          );

          await getEditablePdfDocument(
            {
              target: {
                files: [pdfContentsFromFile],
              },
            },
            firstDocument.fields || [],
          );

          setSigners(firstDocument?.signers || []);
          setActiveSigner(firstDocument?.signers[0]);
          setSignatureBoxes(firstDocument?.signatureBoxes || []);
        } catch (error) {
          console.debug("unable to fetch saved document.", error);
        }
      };

      fetchPdf();
    }
  }, [isEsignDocumentsSuccess, isEsignDocumentsLoading]);

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
              isDisabled={ltMediumFormFactor}
              handleUpload={getEditablePdfDocument}
            />
            <Box data-tour="esign-7">
              <AButton
                size="small"
                variant="contained"
                onClick={() => handleConfirm(esignDocuments[0]?.id || uuidv4())}
                disabled={!file || fields.length === 0}
                isLoading={isCreateEsignDocumentLoading}
                label="Prepare Esign"
              />
            </Box>
          </Stack>
        </Stack>
      </Stack>
      <ViewTokenAlert tokenCount={validTokensForETSS} />
      {!ltMediumFormFactor && (
        <ViewFormTemplates handleUpload={getEditablePdfDocument} />
      )}
      <Box>
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
        <ViewSigners
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
