import { randomUUID } from "node:crypto";
import { createWriteStream, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";

import { RequestError } from "@octokit/request-error";
import { Octokit } from "@octokit/rest";

import { error, info } from "../logging.ts";
import type { CodeSample, Settings } from "../settings.ts";
import { InternalError } from "../util/internalError.ts";

type GithubSdkConfig = {
  owner: string;
  repo: string;
  version: string;
} & CodeSample;

export async function withGithubSdks({
  sdks,
  token,
}: {
  sdks: GithubSdkConfig[];
  token: string;
}): Promise<Pick<Settings, "codeSamples">> {
  const octokit = new Octokit({
    auth: token,
  });

  const codeSamples: CodeSample[] = [];

  for (const sdk of sdks) {
    // `curl` has no SDK
    if (sdk.language === "curl") {
      codeSamples.push(sdk);
      continue;
    }
    const { owner, repo } = sdk;

    info(
      `Fetching ${sdk.language} SDK from ${owner}/${repo}@${sdk.version ? sdk.version : "latest"}`
    );

    const tarballUrl = await getTarballUrl(octokit, owner, repo, sdk.version);

    const tempDir = join(tmpdir(), `speakeasy-github-${randomUUID()}`);
    mkdirSync(tempDir, { recursive: true });

    const tarballPath = join(tempDir, `${repo}-${sdk.version}.tar.gz`);

    const response = await fetch(tarballUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok || !response.body) {
      error(
        `Failed to download archive for repo ${repo}}: ${response.status} ${response.statusText}`
      );
      process.exit(1);
    }

    const fileStream = createWriteStream(tarballPath);
    await pipeline(
      response.body as unknown as NodeJS.ReadableStream,
      fileStream
    );

    codeSamples.push({
      ...sdk,
      sdkTarballPath: tarballPath,
    });
  }

  return { codeSamples };
}

export async function withGithubSpec({
  owner,
  repo,
  ref = "main",
  specPath,
  token,
}: {
  owner: string;
  repo: string;
  ref?: string;
  specPath: string;
  token: string;
}): Promise<Pick<Settings, "spec">> {
  info(`Fetching OpenAPI spec from ${specPath}`);

  const octokit = new Octokit({
    auth: token,
  });

  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path: specPath,
    ref,
    mediaType: { format: "raw" },
  });

  const tempDir = join(tmpdir(), `speakeasy-github-${randomUUID()}`);
  mkdirSync(tempDir, { recursive: true });
  const tempPath = join(tempDir, getSpecFileName(specPath));

  const fileStream = createWriteStream(tempPath);
  await pipeline(data as unknown as NodeJS.ReadableStream, fileStream);

  return { spec: tempPath };
}

async function getTarballUrl(
  octokit: Octokit,
  owner: string,
  repo: string,
  version?: string
): Promise<string> {
  try {
    const { data } =
      version && version !== "latest"
        ? await octokit.repos.getReleaseByTag({
            owner,
            repo,
            tag: version,
          })
        : await octokit.repos.getLatestRelease({
            owner,
            repo,
          });

    if (!data.tarball_url) {
      error(`No tarball URL found for release ${version} in ${owner}/${repo}`);
      process.exit(1);
    }
    return data.tarball_url;
  } catch (e) {
    if (e instanceof RequestError) {
      if (e.status === 404) {
        error(
          `Release ${version} not found in ${owner}/${repo}. Make sure the tag exists and the token has access to the repository.`
        );
        process.exit(1);
      }
    }
    throw new InternalError(
      `Failed to fetch artifact from Github: ${(e as Error).message}`
    );
  }
}

function getSpecFileName(specUrl: string): string {
  const segments = specUrl.split("/");
  const fileName = segments.at(-1);

  if (!fileName || fileName === "") {
    error(
      "Invalid path to spec provided. Please provide a path to a valid OpenAPI spec file."
    );
    process.exit(1);
  }

  return fileName;
}
