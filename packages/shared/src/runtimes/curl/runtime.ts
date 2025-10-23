import { Runtime } from "../runtime.ts";
import type { CurlRuntimeEvent } from "./events.ts";

export class CurlRuntime extends Runtime<CurlRuntimeEvent> {
  constructor() {
    super({
      "curl:parse:started": [],
      "curl:parse:finished": [],
      "curl:parse:error": [],
      "curl:fetch:started": [],
      "curl:fetch:finished": [],
      "curl:fetch:error": [],
    });
  }

  public run(code: string) {
    void this.#run(code);
  }

  #tokenize(code: string) {
    // Normalize the cURL command
    const normalizedCode = code
      .split("\n")
      // Remove BASH newline escapes
      .map((line) => line.replace(/\s*\\$/, " "))
      .join(" ")
      .trim();

    let state:
      | "whitespace"
      | "scanning"
      | "single-quote-string"
      | "double-quote-string" = "whitespace";

    // Tokenize the string
    const tokens: string[] = [];
    let tokenStart = 0;
    let i = 0;
    while (i < normalizedCode.length) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const char = normalizedCode[i]!;
      switch (state) {
        case "whitespace": {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          while (i < normalizedCode.length && /\s/.test(normalizedCode[i]!)) {
            i++;
          }
          tokenStart = i;
          state = "scanning";
          break;
        }
        case "scanning": {
          if (char === "'") {
            state = "single-quote-string";
            tokenStart = i + 1;
          } else if (char === '"') {
            state = "double-quote-string";
            tokenStart = i + 1;
          } else if (/\s/.test(char)) {
            state = "whitespace";
            tokens.push(normalizedCode.slice(tokenStart, i));
            tokenStart = i;
          }
          i++;
          break;
        }
        case "single-quote-string": {
          if (char === "'") {
            tokens.push(normalizedCode.slice(tokenStart, i));
            tokenStart = i + 1;
            state = "whitespace";
          }
          i++;
          break;
        }
        case "double-quote-string": {
          if (char === '"') {
            tokens.push(normalizedCode.slice(tokenStart, i));
            tokenStart = i + 1;
            state = "whitespace";
          }
          i++;
          break;
        }
      }
    }

    // Push the last token, if one exists
    if (tokenStart < normalizedCode.length) {
      tokens.push(normalizedCode.slice(tokenStart));
    }

    return tokens;
  }

  // We can get away with a pretty basic parser because
  // a) We're in the browser and can't support most options
  // b) Our cURL generator only creates a few options
  //
  // See packages/compiler/src/data/generateCodeSamples.ts
  #parse(tokens: string[]) {
    if (tokens[0] !== "curl") {
      throw new Error("Invalid cURL command");
    }

    let i = 1;
    let url: string | undefined;
    let method: string | undefined;
    let body: string | undefined;
    const headers: Record<string, string> = {};
    while (i < tokens.length) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const token = tokens[i]!;
      if (token.startsWith("--") || token.startsWith("-")) {
        switch (token) {
          case "--request":
          case "-X": {
            method = tokens[i + 1];
            i += 2;
            break;
          }
          case "--header":
          case "-H": {
            const header = tokens[i + 1];
            if (!header || header.startsWith("-")) {
              this.emit({
                type: "curl:parse:error",
                error: { message: "Missing header value" },
              });
              return;
            }
            const [key, value] = header.split(":");
            if (!key || !value) {
              this.emit({
                type: "curl:parse:error",
                error: { message: `Could not parse header value "${header}"` },
              });
              return;
            }
            headers[key] = value;
            i += 2;
            break;
          }
          // TODO: support "--data-raw", "--data-urlencode", "--data-ascii"?
          case "--data":
          case "-d": {
            body = tokens[i + 1];
            i += 2;
            break;
          }
          // TODO: add --basic, -b, --cookie, --digest, -F, --form,
          // --form-string, --json, --oauth2-bearer, -u, --user
          // All other options aren't applicable to browser requests
          default: {
            this.emit({
              type: "curl:parse:error",
              error: { message: `Unsupported option "${token}"` },
            });
            return;
          }
        }
      } else {
        url = token;
        i++;
      }
    }

    if (!url) {
      this.emit({
        type: "curl:parse:error",
        error: { message: "No URL provided" },
      });
      return;
    }

    method ??= "get";

    return { url, method: method.toLowerCase(), headers, body };
  }

  async #run(code: string) {
    this.emit({ type: "curl:parse:started" });
    const tokens = this.#tokenize(code);
    const data = this.#parse(tokens);
    if (!data) {
      return;
    }
    this.emit({ type: "curl:fetch:started" });
    try {
      const response = await fetch(data.url, {
        method: data.method,
        headers: data.headers,
        body: data.body,
      });
      if (response.status >= 400) {
        // API error occurred: Status 401 Content-Type "application/json; charset=utf-8". Body: {"detail":"Unauthorized"}"
        const status = `Status ${response.status}`;
        const statusText = response.statusText
          ? `: ${response.statusText}`
          : "";
        const contentType = response.headers.has("content-type")
          ? ` Content-Type "${response.headers.get("content-type")}"`
          : "";
        const bodyText = await response.text();
        const body = bodyText ? `. Body: ${bodyText}` : "";
        this.emit({
          type: "curl:fetch:error",
          error: {
            message: `API error occurred: ${status}${statusText}${contentType}${body}`,
          },
        });
      } else {
        if (response.headers.get("content-type") === "application/json") {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const body = await response.json();
          this.emit({ type: "curl:fetch:finished", response, body });
        } else {
          // TODO: handle binary responses, or maybe just don't show them?
          const body = await response.text();
          this.emit({ type: "curl:fetch:finished", response, body });
        }
      }
    } catch (error) {
      this.emit({ type: "curl:fetch:error", error });
    }
  }

  public cancel() {
    // TODO
    console.log("Canceling");
  }
}
