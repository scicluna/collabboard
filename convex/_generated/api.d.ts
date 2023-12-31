/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.2.1.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth_config from "../auth/config";
import type * as boards from "../boards";
import type * as http from "../http";
import type * as images from "../images";
import type * as lines from "../lines";
import type * as notes from "../notes";
import type * as pins from "../pins";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "auth/config": typeof auth_config;
  boards: typeof boards;
  http: typeof http;
  images: typeof images;
  lines: typeof lines;
  notes: typeof notes;
  pins: typeof pins;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
