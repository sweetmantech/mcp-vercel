import { z } from "zod";

export const MantleTools = {
  GET_TOKEN_PRICE: {
    name: "get-token-price",
    description: "Get the price of a token in mantle network",
    parameters: {
      contract_address: z.string(),
    },
  },
  GET_LTV: {
    name: "get-ltv",
    description: "Get the total value locked of mantle network",
    parameters: {},
  },
  GET_MERCHANT_MOE: {
    name: "get-protocol-merchant-moe-summary",
    description: "Get key metrics for the Merchant Moe protocol on Mantle",
    parameters: {},
  },
  GET_TREEHOUSE: {
    name: "get-protocol-treehouse-protocol-summary",
    description: "Get key metrics for a Tree House on Mantle",
    parameters: {},
  },
  GET_USDT_TVL: {
    name: "get-USDT-tvl",
    description: "Get the total value locked of USDT on Mantle",
    parameters: {},
  },
  GET_USDC_TVL: {
    name: "get-USDC-tvl",
    description: "Get the total value locked of USDC on Mantle",
    parameters: {},
  },
} as const;
