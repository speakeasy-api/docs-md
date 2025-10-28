import { randomUUID } from "node:crypto";
import { createWriteStream, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";

import { RequestError } from "@octokit/request-error";
import { Octokit } from "@octokit/rest";

import { error, info } from "../logging.ts";
import type { CodeSampleWithSDK } from "../settings.ts";
import { InternalError } from "../util/internalError.ts";

type GithubSdkConfig = {
  owner: string;
  repo: string;
  version: string;
} & CodeSampleWithSDK;

export async function withGithubSdk(
  sdk: GithubSdkConfig,
  token?: string
): Promise<CodeSampleWithSDK> {
  const githubToken = token ?? process.env.GITHUB_TOKEN;
  if (githubToken === undefined) {
    error(
      "GitHub Personal Access Token is required. Please pass to withGithubSdks or set GITHUB_TOKEN environment variable"
    );
    process.exit(1);
  }

  const octokit = new Octokit({
    auth: githubToken,
  });

  const { owner, repo } = sdk;

  info(
    `Fetching ${sdk.language} SDK from ${owner}/${repo}@${sdk.version ? sdk.version : "latest"}`
  );

  const tarballUrl = await getTarballUrl(octokit, owner, repo, sdk.version);

  const tempDir = join(tmpdir(), `speakeasy-github-${randomUUID()}`);
  mkdirSync(tempDir, { recursive: true });

  const sdkTarballPath = join(tempDir, `${repo}-${sdk.version}.tar.gz`);

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

  const fileStream = createWriteStream(sdkTarballPath);
  await pipeline(response.body as unknown as NodeJS.ReadableStream, fileStream);

  return { ...sdk, sdkTarballPath };
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
