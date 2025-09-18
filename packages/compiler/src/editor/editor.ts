import type { OperationChunk } from "@speakeasy-api/docs-md-shared/types";

export type { Settings } from "../settings.ts";
export type { FrameworkConfig } from "../types/compilerConfig.ts";

import {
  renderParameters as renderParametersInternal,
  renderRequestBody as renderRequestBodyInternal,
  renderResponseBodies as renderResponseBodiesInternal,
  renderSecurity as renderSecurityInternal,
} from "../content/chunks/operation.ts";
import { MdxSite } from "../renderers/mdx.ts";
import type { Settings } from "../settings.ts";
import { setSettings } from "../settings.ts";
import type { FrameworkConfig } from "../types/compilerConfig.ts";

export function renderSecurity(
  security: OperationChunk,
  settings: Settings,
  frameworkConfig: FrameworkConfig
) {
  setSettings(settings);
  const site = new MdxSite(frameworkConfig);
  const renderer = site.createPage("");
  renderSecurityInternal(security.chunkData.security, renderer);
  return renderer.render().contents;
}

export function renderParameters(
  operationChunk: OperationChunk,
  settings: Settings,
  frameworkConfig: FrameworkConfig
) {
  setSettings(settings);
  const site = new MdxSite(frameworkConfig);
  const renderer = site.createPage("");
  renderParametersInternal(operationChunk.chunkData.parameters, renderer);
  return renderer.render().contents;
}

export function renderRequestBody(
  operationChunk: OperationChunk,
  settings: Settings,
  frameworkConfig: FrameworkConfig
) {
  setSettings(settings);
  const site = new MdxSite(frameworkConfig);
  const renderer = site.createPage("");
  renderRequestBodyInternal(operationChunk.chunkData.requestBody, renderer);
  return renderer.render().contents;
}

export function renderResponseBodies(
  operationChunk: OperationChunk,
  settings: Settings,
  frameworkConfig: FrameworkConfig
) {
  setSettings(settings);
  const site = new MdxSite(frameworkConfig);
  const renderer = site.createPage("");
  renderResponseBodiesInternal(operationChunk.chunkData.responses, renderer);
  return renderer.render().contents;
}
