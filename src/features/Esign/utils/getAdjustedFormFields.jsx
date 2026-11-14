import { rgb } from "pdf-lib";

const drawRectangle = (page, isChecked, x, y) => {
  page.drawRectangle({
    x,
    y,
    width: 10,
    height: 10,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
    color: rgb(0, 0, 0),
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
};

const populateCheckboxUsingAcroForm = (form, field) => {
  try {
    const checkboxField = form.getCheckBox(field.name);
    if (["Yes", "On"].includes(field.value)) {
      checkboxField.check();
    } else {
      checkboxField.uncheck();
    }
  } catch (error) {
    // do nothing
    console.debug("failed to process checkbox using acro form: ", error);
  }
};

export const populateTextFields = (form, textFields = []) => {
  if (!form) return;
  textFields?.forEach((field) => {
    try {
      const textField = form.getTextField(field.name);
      textField.setText(field.value || "");
    } catch (error) {
      console.debug("failed to set text field: ", field.name, error);
    }
  });
};

export const populateCheckboxFields = (form, pages, checkboxFields = []) => {
  if (!form) return;
  for (const field of checkboxFields) {
    try {
      const pageIdx = field.pageNum - 1;
      if (pageIdx < 0 || pageIdx >= pages.length) continue;

      const page = pages[pageIdx];
      const [x1, y1] = field.rect;
      const isChecked = ["Yes", "On"].includes(field.value);
      const x = x1;
      const y = y1;

      drawRectangle(page, isChecked, x, y);

      try {
        const checkbox = form.getCheckBox(field.name);
        form.remove(checkbox);
      } catch (error) {
        // do nothing
        console.debug("failed to remove checkbox field: ", error);
      }
    } catch (error) {
      // do nothing
      console.debug("failed to process checkbox: ", field.name, error);
      // manually failed; let acro form handle checkboxes
      populateCheckboxUsingAcroForm(form, field);
    }
  }
};
