# pi-usage-simple

A lightweight pi extension that provides a single `/usage` command to display the **current provider's** daily and weekly usage limits.

## Features

- 🔍 Auto-detects the active provider (Codex, Claude, Z.AI, Gemini, Antigravity)
- 📊 Shows daily (session) and weekly usage as color-coded progress bars
- ⏱ Displays time until limits reset
- 🪶 No background polling, no status bar — only fetches when you run `/usage`

## Install

Add to your `~/.pi/agent/settings.json`:

```json
{
  "packages": ["git:github.com:<user>/pi-usage-simple"]
}
```

Or link locally:

```json
{
  "extensions": ["/path/to/pi-usage-simple/extensions/simple-usage/index.ts"]
}
```

## Usage

In pi, type:

```
/usage
```

A panel appears showing the current provider's daily and weekly limits with progress bars. Press Enter or Escape to close.

## Dependencies

This extension reuses the fetch and auth logic from [pi-usage-bars](../pi-usage-bars)

## Supported Providers

| Provider | Auth Method |
|----------|-------------|
| Codex (OpenAI) | OAuth (`/login`) |
| Anthropic (Claude) | OAuth (`/login`) |
| Z.AI | API key |
| Gemini CLI | OAuth (`/login`) |
| Antigravity (Google) | OAuth (`/login`) |

## License

MIT
