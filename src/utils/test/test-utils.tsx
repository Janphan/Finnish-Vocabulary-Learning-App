import { render as rtlRender, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

const render = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => rtlRender(ui, { wrapper: BrowserRouter, ...options });

export * from "@testing-library/react";
export default render;
