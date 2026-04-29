import { describe, expect, it } from "bun:test";
import {
  detectProvider,
  fetchCodexUsage,
  type FetchLike,
  type FetchResponseLike,
} from "../extensions/usage/core.ts";

function jsonResponse(status: number, body: any): FetchResponseLike {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

function invalidJsonResponse(status = 200): FetchResponseLike {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => {
      throw new Error("bad json");
    },
  };
}

describe("usage core Codex support", () => {
  it("detects openai-codex models as Codex", () => {
    expect(detectProvider({ provider: "openai-codex", id: "gpt-5.4" })).toBe("codex");
  });

  it("fetches Codex daily and weekly usage from ChatGPT wham response", async () => {
    const calls: Array<{ url: string; authorization: string }> = [];
    const fetchFn: FetchLike = async (url, init) => {
      calls.push({
        url,
        authorization: String((init?.headers as any)?.Authorization ?? ""),
      });

      return jsonResponse(200, {
        rate_limit: {
          primary_window: { used_percent: 42, reset_after_seconds: 120 },
          secondary_window: { used_percent: 73, reset_after_seconds: 240 },
        },
      });
    };

    const usage = await fetchCodexUsage("codex-token", { fetchFn });

    expect(calls).toEqual([
      {
        url: "https://chatgpt.com/backend-api/wham/usage",
        authorization: "Bearer codex-token",
      },
    ]);
    expect(usage).toEqual({
      session: 42,
      weekly: 73,
      sessionResetsIn: "2m",
      weeklyResetsIn: "4m",
    });
  });

  it("returns explicit Codex errors for HTTP and invalid JSON failures", async () => {
    const badHttp = await fetchCodexUsage("codex-token", {
      fetchFn: async () => jsonResponse(401, {}),
    });
    expect(badHttp.error).toBe("HTTP 401");

    const badJson = await fetchCodexUsage("codex-token", {
      fetchFn: async () => invalidJsonResponse(),
    });
    expect(badJson.error).toBe("invalid JSON response");
  });
});
