import { MantleTools } from "./mantleTools";
import { RecoupTools } from "./recoupTools";

export const TOOL_CONFIGS = {
  ...MantleTools,
  ...RecoupTools,
} as const;

export type ToolConfig = typeof TOOL_CONFIGS;
export type ToolName = keyof ToolConfig;
