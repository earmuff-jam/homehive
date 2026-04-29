import React from "react";

import {
  FormatAlignCenterRounded,
  FormatAlignJustifyRounded,
  FormatAlignLeftRounded,
  FormatAlignRightRounded,
  FormatBoldRounded,
  FormatItalicRounded,
  FormatUnderlinedRounded,
} from "@mui/icons-material";
import { Divider, Paper, ToggleButton } from "@mui/material";

const CustomizedEditingButtons = ({ editor }) => {
  if (!editor) return null;

  const setAlignment = (alignment) => {
    editor.chain().focus().setTextAlign(alignment).run();
  };

  const toggle = (command) => (e) => {
    e.preventDefault();
    editor.chain().focus()[command]().run();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 0.5,
        p: 0.5,
      }}
    >
      {/* TEXT FORMATTING */}
      <ToggleButton
        size="small"
        value="bold"
        selected={editor.isActive("bold")}
        onMouseDown={toggle("toggleBold")}
      >
        <FormatBoldRounded />
      </ToggleButton>

      <ToggleButton
        size="small"
        value="italic"
        selected={editor.isActive("italic")}
        onMouseDown={toggle("toggleItalic")}
      >
        <FormatItalicRounded />
      </ToggleButton>

      <ToggleButton
        size="small"
        value="underline"
        selected={editor.isActive("underline")}
        onMouseDown={toggle("toggleUnderline")}
      >
        <FormatUnderlinedRounded />
      </ToggleButton>

      <Divider flexItem orientation="vertical" sx={{ mx: 1 }} />

      {/* ALIGNMENT */}
      <ToggleButton
        size="small"
        value="left"
        selected={
          editor.getAttributes("paragraph").textAlign === "left" ||
          !editor.getAttributes("paragraph").textAlign
        }
        onMouseDown={(e) => {
          e.preventDefault();
          setAlignment("left");
        }}
      >
        <FormatAlignLeftRounded />
      </ToggleButton>

      <ToggleButton
        size="small"
        value="center"
        selected={editor.getAttributes("paragraph").textAlign === "center"}
        onMouseDown={(e) => {
          e.preventDefault();
          setAlignment("center");
        }}
      >
        <FormatAlignCenterRounded />
      </ToggleButton>

      <ToggleButton
        size="small"
        value="right"
        selected={editor.getAttributes("paragraph").textAlign === "right"}
        onMouseDown={(e) => {
          e.preventDefault();
          setAlignment("right");
        }}
      >
        <FormatAlignRightRounded />
      </ToggleButton>

      <ToggleButton
        size="small"
        value="justify"
        selected={editor.getAttributes("paragraph").textAlign === "justify"}
        onMouseDown={(e) => {
          e.preventDefault();
          setAlignment("justify");
        }}
      >
        <FormatAlignJustifyRounded />
      </ToggleButton>
    </Paper>
  );
};

export default CustomizedEditingButtons;
