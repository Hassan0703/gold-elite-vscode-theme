# Gold Elite — Privacy Policy

**Gold Elite makes zero network requests.** This extension does not:

- Collect telemetry, analytics, or usage data
- Send any data over the network (no `fetch()`, `XMLHttpRequest`, `axios`, or any HTTP client)
- Contact external servers or APIs
- Sync any data to cloud services
- Include third-party analytics or tracking code

All achievement data, streak counters, session statistics, and settings are stored exclusively in VS Code's local `globalState` and `workspaceState` — the same mechanism VS Code itself uses to remember window state and editor history. This data never leaves your machine.

The **Gold Elite: Open Font Download Page** command opens a URL in your default browser — it does not transmit any data. It simply calls `vscode.env.openExternal()` with a fixed URL to the Cascadia Code releases page on GitHub.

You can verify this claim by inspecting the extension source code for any `fetch(`, `http.`, `https.`, `XMLHttpRequest`, or `axios` usage — there are none outside the explicitly approved font-download-page opener.

You can wipe all locally stored Gold Elite data at any time via the **Gold Elite: Reset All Local Data** command.
