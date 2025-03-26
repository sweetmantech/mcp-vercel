import { RecoupTools } from "./recoupTools";

export const TOOL_CONFIGS = {
  ...RecoupTools,
} as const;

export type ToolConfig = typeof TOOL_CONFIGS;
export type ToolName = keyof ToolConfig;
