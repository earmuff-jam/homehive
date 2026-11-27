import React, { useCallback, useEffect, useRef, useState } from "react";

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";

import { Box, Stack, useMediaQuery, useTheme } from "@mui/material";
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
  useRemoveEsignDocumentMutation,
} from "features/Api/esignApi";
import { useSendPreparedDocumentMutation } from "features/Api/externalIntegrationMultipart";
import EditPdfDocumentPanel from "features/Esign/components/EditPdfDocumentPanel/EditPdfDocumentPanel";
import ViewTokenAlert from "features/Esign/components/Esign/ViewTokenAlert";
import EsignPdfActionButton from "features/Esign/components/EsignPdfActionButton/EsignPdfActionButton";
import ViewFormTemplates from "features/Esign/components/FormTemplates/ViewFormTemplates";
import PdfDocumentReviewBox from "features/Esign/components/PdfDocumentReviewBox/PdfDocumentReviewBox";
import PdfDocumentWorkHistory from "features/Esign/components/PdfDocumentWorkHistory/PdfDocumentWorkHistory";
import PdfDocumentReviewDialog from "features/Esign/components/Signers/PdfDocumentReviewDialog";
import SigningBox from "features/Esign/components/ViewPdf/SigningBox";
import ViewPdf from "features/Esign/components/ViewPdf/ViewPdf";
import {
  ACTIVE_FORM_TYPE_ENUM_VALUES,
  COLOR_ENUM_VALUES,
  INITIAL_SIGNER_ENUM_VALUES,
  SCALE,
} from "features/Esign/constants";
import getAnnotationsForDocument from "features/Esign/utils/getAnnotationsForDocument";
import { getEditablePDFData } from "features/Esign/utils/getEditablePDFData";
import getFinalFormData from "features/Esign/utils/getFinalFormData";
import getSigningFields from "features/Esign/utils/getSigningFields";
import withDisclaimer from "features/Esign/withDisclaimer";
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

  const { data: esignDocuments = [] } = useGetEsignDocumentsByUserIdQuery(
    user?.uid,
    { skip: !user?.uid },
  );

  const [
    executePreparedDocument,
    {
      isLoading: isExecutePreparedDocumentLoading,
      isSuccess: isExecutePreparedDocumentSuccess,
    },
  ] = useSendPreparedDocumentMutation();

  const [
    removeEsignDocument,
    {
      isLoading: isRemoveEsignDocumentLoading,
      isSuccess: isRemoveEsignDocumentSuccess,
    },
  ] = useRemoveEsignDocumentMutation();

  const [
    createEsignDocument,
    {
      isLoading: isCreateEsignDocumentLoading,
      originalArgs: createEsignDocumentOrginalArgs,
    },
  ] = useCreateEsignDocumentMutation();

  const [file, setFile] = useState(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [tokenAnchor, setTokenAnchor] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showConfirmationBox, setShowConfirmationBox] = useState(
    DefaultConfirmationBoxProps,
  );

  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      pdfForm: [],
      signatureBoxes: [],
      activeSignerId: null,
      signers: INITIAL_SIGNER_ENUM_VALUES,
      activeFieldType: ACTIVE_FORM_TYPE_ENUM_VALUES.Signature,
    },
  });

  const { fields: pdfFormFields, replace: replacePdfForm } = useFieldArray({
    control,
    name: "pdfForm",
  });

  const {
    fields: signerFields,
    append: appendSigner,
    remove: removeSigner,
    replace: replaceSigners,
  } = useFieldArray({
    control,
    name: "signers",
    keyName: "fieldId",
  });

  const {
    fields: signatureBoxes,
    append: appendSignatureBox,
    remove: removeSignatureBox,
    replace: replaceSignatureBox,
  } = useFieldArray({
    control,
    name: "signatureBoxes",
    keyName: "signatureBoxId",
  });

  const signers =
    useWatch({
      control,
      name: "signers",
    }) || [];

  const activeSignerId = useWatch({
    control,
    name: "activeSignerId",
  });

  const activeFieldType = useWatch({
    control,
    name: "activeFieldType",
  });

  const activeSigner =
    signers.find((signer) => signer.id === activeSignerId) ?? null;

  const ltMediumFormFactor = useMediaQuery(theme.breakpoints.down("md"));

  const addFollowUpSigners = () => {
    const currentSigners = getValues("signers") || [];
    const idx = currentSigners.length;
    const colorIdx = (idx - 2) % COLOR_ENUM_VALUES.length;

    appendSigner({
      id: `signer_${idx}`,
      role: `Signer ${idx}`,
      name: "",
      email_address: "",
      color: COLOR_ENUM_VALUES[Math.abs(colorIdx)],
      order: idx,
    });
  };

  const handleSelectSigner = (signer) => {
    const currentActiveSignerId = getValues("activeSignerId");

    setValue(
      "activeSignerId",
      currentActiveSignerId === signer?.id ? null : signer?.id,
    );
  };

  const handleSelectFieldType = (signer, fieldType) => {
    setValue("activeSignerId", signer.id);
    setValue("activeFieldType", fieldType);
  };

  const handleRemoveSigner = (signerId) => {
    if (signerId === "creator") return;

    const currentSigners = getValues("signers") || [];
    const signerIndex = currentSigners.findIndex(
      (signer) => signer.id === signerId,
    );

    removeSigner(signerIndex);

    // removes all signature boxes for the removed signer
    removeSignatureBox(
      signatureBoxes.reduce((acc, el, index) => {
        if (el.signerId === signerId) acc.push(index);
        return acc;
      }, []),
    );

    getValues("activeSignerId") === signerId &&
      setValue("activeSignerId", null);
  };

  const removeBox = (boxId) => removeSignatureBox(boxId);

  const setPdfFormFields = (updater) => {
    const currentFields = getValues("pdfForm") || [];

    const updatedFields =
      typeof updater === "function" ? updater(currentFields) : updater;

    setValue("pdfForm", updatedFields, {
      shouldDirty: true,
    });
  };

  const handlePrepareEsign = async (fileUniqueId) => {
    const signingFormFields = getSigningFields(signatureBoxes);

    const { formBytes: populatedEsignDocument } = await getEditablePDFData(
      file,
      pdfFormFields,
      false, // Does not draw checkboxes since this is not the final version.
    );

    if (!fileUniqueId || !populatedEsignDocument) return;

    const previewPopulatedEsignDocument = new Blob([populatedEsignDocument], {
      type: "application/pdf",
    });

    createEsignDocument({
      file: previewPopulatedEsignDocument,
      path: `esign/${user?.uid}/documents/${fileUniqueId}`,
      fileId: fileUniqueId,
      fileName: file?.name,
      userId: user?.uid,
      signers,
      pdfFormFields,
      signatureBoxes,
      signingFormFields,
      createdAt: dayjs().toISOString(),
      createdBy: user?.uid,
    });

    setShowConfirmationBox({
      value: true,
      updateKey: "review_esign_document",
    });
  };

  const getEditablePdfDocument = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) {
      setScrollTop(0);
      setFile(null);
      replacePdfForm([]);
      replaceSigners([]);
      setValue("signatureBoxes", []);
      setValue("activeSignerId", null);
      setValue("activeFieldType", ACTIVE_FORM_TYPE_ENUM_VALUES.Signature);
      return;
    }

    setScrollTop(0);
    setFile(uploadedFile);
    replacePdfForm(e?.pdfFormFields || []);
    replaceSignatureBox(e?.signatureBoxes || []);
    replaceSigners(
      e?.signers?.length > 0 ? e?.signers : INITIAL_SIGNER_ENUM_VALUES,
    );

    setValue("activeSignerId", null);
    setValue("activeFieldType", ACTIVE_FORM_TYPE_ENUM_VALUES.Signature);

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
      getAnnotationsForDocument(
        annotations,
        newFields,
        setPdfFormFields,
        e?.pdfFormFields,
        {
          pageNumber: pageNum,
          viewport,
          pageDiv,
          container,
        },
      );

      container.appendChild(pageDiv);
    }

    replacePdfForm(newFields);

    requestAnimationFrame(() => {
      Array.from(container.querySelectorAll("[data-page]")).forEach((div) => {
        const pn = parseInt(div.dataset.page, 10);
        pageOffsets.current[pn] = div.offsetTop;
      });
    });
  };

  const exportPdf = async () => {
    const {
      pdfDoc,
      form,
      formBytes: populatedEsignDocument,
    } = await getEditablePDFData(file, pdfFormFields);

    if (!populatedEsignDocument || !form) return;

    try {
      form.flatten();
    } catch (err) {
      console.debug("Unable to flatten form.", err);
    }
    const finalBytes = await pdfDoc.save();
    const generatedFormData = getFinalFormData(
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

      appendSignatureBox({
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
      });
    },
    [getCoordsForCanvas, activeFieldType],
  );

  const shouldReviewEsignDoc =
    showConfirmationBox?.updateKey === "review_esign_document";

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
    if (isRemoveEsignDocumentSuccess && !isRemoveEsignDocumentLoading) {
      setShowConfirmationBox({ value: false, updateKey: "" });
    }
  }, [isRemoveEsignDocumentLoading]);

  useEffect(() => {
    if (isExecutePreparedDocumentSuccess) {
      setFile(null);
      replacePdfForm([]);
      replaceSigners([]);
      replaceSignatureBox([]);

      setShowSnackbar(true);
      setShowConfirmationBox({ value: false, updateKey: "" });
      navigate(0);
      celebrations.commonConfetti();
    }
  }, [isExecutePreparedDocumentSuccess, navigate]);

  return (
    <Stack data-tour="esign-0">
      <form>
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
            fields={pdfFormFields}
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
              errorStr="Due to the nature of document security, electronic signatures are prohibited from being created in smaller screen sizes. Please use laptop or a tablet to proceed."
            />
          ) : (
            <Stack>
              <ViewFormTemplates
                savedOptions={esignDocuments}
                handleUpload={getEditablePdfDocument}
                handleRemove={(id) =>
                  setShowConfirmationBox({
                    value: true,
                    updateKey: id,
                  })
                }
              />
              {!file ? (
                <EmptyComponent caption="Upload pdf file to begin." />
              ) : (
                <Stack spacing={1} direction="row" paddingY={1}>
                  <EditPdfDocumentPanel
                    signerFields={signerFields}
                    control={control}
                    errors={{ errors }}
                    signers={signers}
                    activeSigner={activeSigner}
                    handleSelectSigner={handleSelectSigner}
                    handleSelectFieldType={handleSelectFieldType}
                    activeFieldType={activeFieldType}
                    addFollowUpSigners={addFollowUpSigners}
                    handleRemoveSigner={handleRemoveSigner}
                  />
                  <Box sx={{ position: "relative", flexShrink: 0 }}>
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
                  <PdfDocumentWorkHistory
                    removeBox={removeBox}
                    signatureBoxes={signatureBoxes}
                  />
                </Stack>
              )}
            </Stack>
          )}
        </Box>
      </form>

      <ConfirmationBox
        maxWidth={shouldReviewEsignDoc ? "md" : undefined}
        isBlocked={validTokensForETSS <= 0}
        title={shouldReviewEsignDoc ? "Send document to signers?" : undefined}
        captionText={
          shouldReviewEsignDoc
            ? "Action consumes 1 non-refundable token. Proceed?"
            : "Removed esign documents disrupt auto renewal workflow. Are you sure you want to proceed with this action?"
        }
        isOpen={showConfirmationBox?.value}
        isLoading={isExecutePreparedDocumentLoading}
        handleCancel={() =>
          setShowConfirmationBox({ value: false, updateKey: "" })
        }
        handleConfirm={
          shouldReviewEsignDoc
            ? () => exportPdf()
            : () =>
                removeEsignDocument({
                  fileId: showConfirmationBox?.updateKey,
                  path: `esign/${user?.uid}/documents/${showConfirmationBox?.updateKey}`,
                })
        }
      >
        {shouldReviewEsignDoc && (
          <PdfDocumentReviewDialog
            signers={signers}
            tokenCount={validTokensForETSS}
            signatureBoxes={signatureBoxes}
            previewData={createEsignDocumentOrginalArgs}
            isCreateEsignDocumentLoading={isCreateEsignDocumentLoading}
          />
        )}
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
