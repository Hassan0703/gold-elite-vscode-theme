# Frequently Asked Questions

## General

<details>
<summary><strong>What is Gold Elite?</strong></summary>

Gold Elite is a premium near-black VS Code color theme with a gold-emerald dual-tone accent system. It goes beyond colors to include a signature IDE experience: animated boot sequence, live Command Center dashboard, living status bar, achievement system, and more.

</details>

<details>
<summary><strong>Is Gold Elite free?</strong></summary>

Yes. Gold Elite is open-source under the MIT license. It's free to use, modify, and distribute.

</details>

<details>
<summary><strong>Why should I switch from my current theme?</strong></summary>

Gold Elite offers a more cohesive experience than traditional themes. Every pixel — from the activity bar to the terminal cursor to the save animation — follows the same gold-emerald design language. It's also privacy-first, with zero network calls and verifiable source code.

</details>

## Privacy & Security

<details>
<summary><strong>Does Gold Elite collect telemetry?</strong></summary>

No. Gold Elite makes zero network requests. No telemetry, no analytics, no external APIs, no cloud sync. See [PRIVACY.md](PRIVACY.md) for the full verification.

</details>

<details>
<summary><strong>Where is my data stored?</strong></summary>

All achievement data, streak counters, session statistics, and settings are stored exclusively in VS Code's local `globalState` and `workspaceState`. This data never leaves your machine.

</details>

<details>
<summary><strong>How do I reset my data?</strong></summary>

Run **Gold Elite: Reset All Local Data** from the Command Palette. This wipes all achievements, streaks, session data, and ecosystem theming preferences.

</details>

## Features

<details>
<summary><strong>Can I disable features I don't want?</strong></summary>

Yes. Every feature has its own toggle in `settings.json` under the `goldElite.*` namespace. The master switch `goldElite.experience.enabled` disables everything at once.

</details>

<details>
<summary><strong>Does the boot sequence respect reduced motion?</strong></summary>

Yes. If `workbench.reduceMotion` is enabled, the boot sequence shows a static reveal instead of animations.

</details>

<details>
<summary><strong>How does the focus timer work?</strong></summary>

The focus timer tracks active coding time. It pauses when VS Code is unfocused (Alt+Tab) or when there's no keyboard/editing activity for 2+ minutes.

</details>

<details>
<summary><strong>Can I keep my existing icon theme?</strong></summary>

Absolutely. Gold Elite does not require any specific icon theme. Your existing icon theme works unchanged.

</details>

## Compatibility

<details>
<summary><strong>What VS Code version do I need?</strong></summary>

Gold Elite requires VS Code 1.129.0 or later.

</details>

<details>
<summary><strong>Does Gold Elite work with GitLens?</strong></summary>

Yes. Gold Elite can optionally align GitLens colors to match the gold palette. Enable via `goldElite.ecosystemTheming.enabled`.

</details>

<details>
<summary><strong>Does Gold Elite work with Git Graph?</strong></summary>

Yes. Git Graph colors can be aligned to the gold-emerald palette through ecosystem theming.

</details>

<details>
<summary><strong>Does Gold Elite work with Error Lens?</strong></summary>

Yes. Error backgrounds can be aligned to the gold palette through ecosystem theming.

</details>

<details>
<summary><strong>Does Gold Elite work on Windows, Mac, and Linux?</strong></summary>

Yes. It's a VS Code extension and works on all platforms that VS Code supports.

</details>

## Font

<details>
<summary><strong>What font does Gold Elite recommend?</strong></summary>

Cascadia Code by Microsoft. It provides true italics and ligatures that complement the theme. Use the **Gold Elite: Open Font Download Page** command to download it.

</details>

<details>
<summary><strong>What if I don't want to use Cascadia Code?</strong></summary>

That's fine. Gold Elite works with any monospace font. The recommended font setting is just a suggestion in `configurationDefaults` — your font choices are always respected.

</details>

## Troubleshooting

<details>
<summary><strong>The Command Center won't open</strong></summary>

Check that `goldElite.commandCenter.enabled` is set to `true`. If it is, try reloading VS Code (Developer: Reload Window). If the issue persists, open an [issue](https://github.com/hassan-ali/gold-elite-2-0/issues).

</details>

<details>
<summary><strong>Status bar items are missing</strong></summary>

Check `goldElite.livingStatusBar.enabled` is `true`. Also verify the master switch `goldElite.experience.enabled` is not `false`.

</details>

<details>
<summary><strong>Achievements aren't unlocking</strong></summary>

Check `goldElite.achievements.enabled` is `true`. Some achievements require specific actions (e.g., "Bracket Master" requires typing 10,000 brackets across sessions). Make sure you haven't reset your data recently.

</details>

<details>
<summary><strong>Colors look different than screenshots</strong></summary>

Ensure you have the Gold_Elite-2.0 color theme selected. Some colors may vary slightly based on your VS Code version, installed extensions, and OS-level color settings.

</details>

<details>
<summary><strong>Other extensions aren't showing in the status bar</strong></summary>

This is caused by a conflict between Gold Elite and other installed Gold Elite-related extensions. Uninstall any old `gold-elite-studio` extensions and reload VS Code. See [GitHub issue #1](https://github.com/hassan-ali/gold-elite-2-0/issues) for details.

</details>
