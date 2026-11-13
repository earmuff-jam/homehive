import { DEFAULT_TEXT_SIZE, SCALE } from "features/Esign/constants";

const buildAnnotationForTxFieldType = (
  annotation,
  newFields,
  setFields,
  fieldName,
  { leftPx, topPx, widthPx, heightPx, pageDiv, container },
) => {
  let input;
  if (annotation?.datetimeType === "date") {
    input = document.createElement("input");
    input.type = "date";
  } else if (annotation?.mutiLine) {
    input = document.createElement("textarea");
    input.style.resize = "none";
  } else {
    input = document.createElement("input");
    input.type = "text";
  }

  if (annotation?.fieldValue) {
    if (annotation?.datetimeType === "date") {
      const [mm, dd, yyyy] = annotation.fieldValue.split("/");
      input.value = `${yyyy}-${mm}-${dd}`;
    } else {
      input.value = annotation.fieldValue;
    }
  }

  input.oninput = (ev) => {
    let value = ev.target.value;
    if (annotation.datetimeType === "date" && value) {
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
    left: `${leftPx}px`,
    top: `${topPx}px`,
    width: `${widthPx}px`,
    height: `${heightPx}px`,
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
    value: annotation.fieldValue || "",
    type: "text",
  });

  container.appendChild(pageDiv);
};

const buildAnnotationForCheckboxFieldType = (
  annotation,
  newFields,
  setFields,
  savedFields,
  fieldName,
  { leftPx, topPx, widthPx, heightPx, x1, y1, pageDiv, container, pageNumber },
) => {
  const input = document.createElement("input");
  input.type = "checkbox";

  const savedField = savedFields?.find(
    (field) =>
      field.type === "checkbox" &&
      field.name === fieldName &&
      field.pageNum === pageNumber,
  );

  const checked = savedField
    ? savedField.value === "Yes"
    : annotation.fieldValue === "Yes" || annotation.fieldValue === "On";

  input.checked = checked;

  Object.assign(input.style, {
    position: "absolute",
    left: `${leftPx}px`,
    top: `${topPx}px`,
    width: `${widthPx}px`,
    height: `${heightPx}px`,
    cursor: "pointer",
    opacity: "0.7",
    margin: "0",
  });

  input.onChange = () => {
    setFields((prev) => {
      const copy = [...prev];
      const existing = copy.find(
        (f) =>
          f.name === fieldName &&
          f.pageNum === pageNumber &&
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
          pageNumber,
          rect: annotation.rect,
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
    pageNumber,
    rect: annotation.rect,
  });

  container.appendChild(pageDiv);
};

const getAnnotationsForDocument = (
  annotations = [],
  newFields,
  setFields,
  savedFields = [],
  { pageNumber, viewport, pageDiv, container },
) => {
  annotations?.forEach((annotation) => {
    if (annotation?.subtype !== "Widget") return;
    const fieldName =
      annotation?.fieldName || `field_${pageNumber}_${annotation.id}`;

    const [x1, y1, x2, y2] = annotation.rect;
    const leftPx = x1 * SCALE;
    const topPx = viewport.height - y2 * SCALE;
    const widthPx = (x2 - x1) * SCALE;
    const heightPx = (y2 - y1) * SCALE;

    annotation?.fieldType === "Tx" &&
      buildAnnotationForTxFieldType(
        annotation,
        newFields,
        setFields,
        fieldName,
        { leftPx, topPx, widthPx, heightPx, pageDiv, container },
      );

    annotation?.fieldType === "Btn" &&
      !annotation.radioButton &&
      buildAnnotationForCheckboxFieldType(
        annotation,
        newFields,
        setFields,
        savedFields,
        fieldName,
        {
          leftPx,
          topPx,
          widthPx,
          heightPx,
          x1,
          y1,
          pageDiv,
          container,
          pageNumber,
        },
      );
  });
};

export default getAnnotationsForDocument;
