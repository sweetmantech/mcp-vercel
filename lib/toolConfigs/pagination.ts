import { z } from "zod";

export const PaginationParams = {
  page: z
    .number()
    .min(1)
    .optional()
    .describe("The page number to retrieve (default: 1)"),
  limit: z
    .number()
    .min(1)
    .optional()
    .describe("The number of records per page (default: 20, max: 100)"),
} as const;
