import React, { useEffect } from "react";

import { useForm } from "react-hook-form";

import { Box, Stack } from "@mui/material";
import AButton from "common/AButton";
import TextFieldWithLabel from "common/TextFieldWithLabel";
import TemplateHtmlEditor from "features/Rent/components/Templates/TemplateHtmlEditor";

const EditTemplate = ({ template, handleSave }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (template) {
      reset({
        ...template,
      });
    }
  }, [template]);

  return (
    <Stack spacing={2} sx={{ flex: 3 }}>
      <form>
        <TextFieldWithLabel
          label="Subject *"
          id="subject"
          size="small"
          placeholder="Subject of your email template"
          errorMsg={errors.subject?.message}
          inputProps={{
            ...register("subject", {
              required: "Subject is required",
            }),
          }}
        />
        <TextFieldWithLabel
          label="Message Body *"
          id="body"
          fullWidth
          size="small"
          placeholder="The message body of your template"
          errorMsg={errors.body?.message}
          inputProps={{
            ...register("body", {
              required: "Message Body is required",
            }),
          }}
        />
        <TemplateHtmlEditor
          label="Message HTML *"
          content={watch("html")}
          onChange={(html) => setValue("html", html, { shouldValidate: true })}
        />
        <Box alignSelf="flex-end" marginTop={1}>
          <AButton
            type="submit"
            label="Save"
            variant="outlined"
            size="small"
            disabled={!isValid}
            onClick={handleSubmit(handleSave)}
          />
        </Box>
      </form>
    </Stack>
  );
};

export default EditTemplate;
