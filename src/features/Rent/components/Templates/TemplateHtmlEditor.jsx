import React, { useEffect } from "react";

import { InfoRounded } from "@mui/icons-material";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CustomizedEditingButtons from "features/Rent/components/Templates/CustomizedEditingButtons";

const TemplateHtmlEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();
    if (content !== current) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center">
        <Typography fontWeight="medium" color="textPrimary">
          Customize message
        </Typography>
        <Tooltip title="Customize this template with text of your choice. You can even directly use html markup in the above template. Use the variables listed on the side to bring your templates to life.">
          <InfoRounded
            color="secondary"
            fontSize="small"
            sx={{ fontSize: "1rem", margin: "0.2rem" }}
          />
        </Tooltip>
      </Stack>
      <CustomizedEditingButtons editor={editor} />
      <Box
        sx={(theme) => ({
          borderRadius: 1,
          padding: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#121212" : "#e8f0f9",
          color: theme.palette.getContrastText(
            theme.palette.mode === "dark" ? "#121212" : "#e8f0f9",
          ),
          "& .ProseMirror:focus": {
            outline: "none",
            boxShadow: "none",
          },
        })}
      >
        <EditorContent editor={editor} />
      </Box>
    </Stack>
  );
};

export default TemplateHtmlEditor;
