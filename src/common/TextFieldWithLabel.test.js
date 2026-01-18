import React from "react";

import TextFieldWithLabel from "./TextFieldWithLabel";
import { fireEvent, render, screen } from "@testing-library/react";

describe("TextFieldWithLabel Jest Tests", () => {
  describe("TextFieldWithLabel snapshot tests", () => {
    it("should render the correct snapshot", () => {
      const { asFragment } = render(<TextFieldWithLabel />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("TextFieldWithLabel component tests", () => {
    it("renders label correctly", () => {
      render(<TextFieldWithLabel label="Username" />);
      expect(screen.getByText("Username")).toBeInTheDocument();
    });

    it("renders helper text when errorMsg is provided", () => {
      render(<TextFieldWithLabel label="Email" errorMsg="Invalid email" />);
      expect(screen.getByText("Invalid email")).toBeInTheDocument();
    });

    it("passes value, onChange and onBlur correctly", () => {
      const handleChange = jest.fn();
      const handleBlur = jest.fn();

      render(
        <TextFieldWithLabel
          label="Password"
          value="123"
          onChange={handleChange}
          onBlur={handleBlur}
        />,
      );

      const input = screen.getByRole("textbox");
      expect(input.value).toBe("123");

      fireEvent.blur(input);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("supports multiline and maxRows", () => {
      render(<TextFieldWithLabel label="Description" multiline maxRows={4} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("rows", "4");
    });
  });
});
