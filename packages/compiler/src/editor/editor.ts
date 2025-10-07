import type { Chunk, OperationChunk } from "@speakeasy-api/docs-md-shared";

export type { Settings } from "../settings.ts";
export type { FrameworkConfig } from "../types/FrameworkConfig.ts";

import {
  renderParameters as renderParametersInternal,
  renderRequestBody as renderRequestBodyInternal,
  renderResponseBodies as renderResponseBodiesInternal,
  renderSecurity as renderSecurityInternal,
} from "../content/chunks/operation.ts";
import { MdxSite } from "../renderers/mdx.ts";
import type { Settings } from "../settings.ts";
import { setSettings } from "../settings.ts";
import type { FrameworkConfig } from "../types/FrameworkConfig.ts";

export function renderSecurity(
  docsData: Map<string, Chunk>,
  security: OperationChunk,
  settings: Settings,
  frameworkConfig: FrameworkConfig
) {
  setSettings(settings);
  const site = new MdxSite(frameworkConfig);
  site.setDocsData(docsData);
  const renderer = site.createPage("");
  renderSecurityInternal(security.chunkData.security, renderer);
  return renderer.render().contents;
}

export function renderParameters(
  docsData: Map<string, Chunk>,
  operationChunk: OperationChunk,
  settings: Settings,
  frameworkConfig: FrameworkConfig
) {
  setSettings(settings);
  const site = new MdxSite(frameworkConfig);
  site.setDocsData(docsData);
  const renderer = site.createPage("");
  renderParametersInternal(operationChunk.chunkData.parameters, renderer);
  return renderer.render().contents;
}

export function renderRequestBody(
  docsData: Map<string, Chunk>,
  operationChunk: OperationChunk,
  settings: Settings,
  frameworkConfig: FrameworkConfig
) {
  setSettings(settings);
  const site = new MdxSite(frameworkConfig);
  site.setDocsData(docsData);
  const renderer = site.createPage("");
  renderRequestBodyInternal(operationChunk.chunkData.requestBody, renderer);
  return renderer.render().contents;
}

export function renderResponseBodies(
  docsData: Map<string, Chunk>,
  operationChunk: OperationChunk,
  settings: Settings,
  frameworkConfig: FrameworkConfig
) {
  setSettings(settings);
  const site = new MdxSite(frameworkConfig);
  site.setDocsData(docsData);
  const renderer = site.createPage("");
  renderResponseBodiesInternal(operationChunk.chunkData.responses, renderer);
  return renderer.render().contents;
}
