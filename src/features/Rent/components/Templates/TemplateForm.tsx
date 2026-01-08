import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { Stack, Tooltip } from "@mui/material";
import AButton from "common/AButton";
import TextFieldWithLabel from "common/TextFieldWithLabel";
import { TTemplate, TTemplateForm } from "features/Rent/Rent.types";

// TTemplateProps ...
type TTemplateProps = {
  template: TTemplate;
  handleSave: (val: TTemplate) => void;
};

export default function TemplateForm({ template, handleSave }: TTemplateProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<TTemplateForm>({
    mode: "onChange",
    defaultValues: {
      subject: "",
      body: "",
      html: "",
    },
  });

  useEffect(() => {
    if (template) {
      reset({
        ...template,
      });
    }
  }, [template]);

  return (
    <form>
      <Stack spacing={2}>
        <TextFieldWithLabel
          label="Subject *"
          name="subject"
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
          name="body"
          fullWidth
          placeholder="The message body of your template"
          errorMsg={errors.body?.message}
          inputProps={{
            ...register("body", {
              required: "Message Body is required",
            }),
          }}
        />

        <Tooltip title="Customize this template with text of your choice. You can even directly use html markup in the above template. Use the variables listed on the side to bring your templates to life.">
          <TextFieldWithLabel
            label="Message HTML *"
            name="html"
            fullWidth
            multiline
            maxRows={15}
            placeholder="The message to submit in HTML format"
            errorMsg={errors.html?.message}
            inputProps={{
              ...register("html", {
                required: "Message HTML is required",
              }),
            }}
          />
        </Tooltip>
        <AButton
          type="submit"
          label="Save"
          variant="outlined"
          size="small"
          disabled={!isValid}
          onClick={handleSubmit(handleSave)}
        />
      </Stack>
    </form>
  );
}
