# Change Log

## 0.4.0 (2026-07-23)

### Dual-Tone v2 Signature Experience

- **Gold-emerald dual-tone identity** across all features: gold (`#FFD700`/`#BFA53A`) + emerald (`#2ECC9A`/`#1F8F6B`/`#0E3A2C`/`#17523F`)
- **Emerald color values** applied to theme tokens (`gitDecoration.addedResourceForeground`, `editorBracketHighlight.foreground4`, etc.) and canonical token JSON
- **Shared shape library** (`webview-assets/gold-elite-shapes.css`): facet cards, hex badges, diamond bullets, dual-tone sweep gradient with reduced-motion fallback
- **Boot sequence v2**: emerald hex-badge row added; skippable via keypress/click; transitions directly to Command Center
- **Command Center v2**: auto-opens on startup (configurable), dual-tone facet cards (gold for session/annotations, emerald for Git)
- **HUD v2**: achievement progress bar in status bar (`🏆 ▰▰▰▱▱▱ 3/8`), emerald save pulse rest color (`#1F8F6B`)
- **Achievement badges** rendered as hexagonal clip-path shapes (gold, emerald, nested for The Elite)
- **Product icon theme**: 26 gold-styled SVG icons (activity bar, common actions, navigation)
- **Heartbeat indicator**: `✦ GE` permanently visible in status bar
- **Diagnostics command**: `Gold Elite: Diagnostics` to check feature status
- **Activation reliability**: `onCommand` activation events, try-catch wrappers for all feature setup
- **Welcome page and dialog theming**: 14 new color keys for Get Started, Welcome tiles, links, dialogs
- **Visual polish (Milestone 1)**: consistent spacing, refined typography, improved card system, elegant separators
- **Git data display fix**: defensive null checks for Git API access (HEAD, exports, repositories)

## 0.3.0 (2026-07-10)

### Signature Experience Launch

- **Animated boot sequence**: SVG line-art intro with `stroke-dasharray` drawing, gold underline expand, fade-in text. Skippable, respects reduced-motion
- **Command Center dashboard** (sidebar webview): real-time session stats, Git snapshot, TODO/FIXME/NOTE counts, recent files, achievements. Polls every 5s, pauses when hidden
- **Living Status Bar**: focus timer (pauses on idle 2min+), save pulse dot (800ms glow), coding streak counter (🔥 days)
- **Save flash**: 2px gold left-border decoration animating over 400ms on every save
- **TODO/FIXME/NOTE gutter markers**: gold/amber/gray gutter indicators with debounced re-scan
- **8 local-only achievements**: First Light, Momentum, Night Owl, Streak Keeper, Bracket Master, Debugger, Clean Sweep, The Elite
- **Ecosystem theming**: one-time GitLens, Git Graph, Error Lens palette alignment (opt-in)
- **Master kill switch** (`goldElite.experience.enabled`)
- **Privacy-first**: zero network calls, PRIVACY.md, Reset All Local Data command
- **Getting Started walkthrough**: 6-step branded walkthrough

## 0.2.0 (2026-06-25)

### Premium Add-ons

- **Status bar refinements**: 16 new `statusBarItem.*` and `statusBar.*` keys (remote, debugging, error/warning)
- **Hover and interaction states**: tab hover border, list drop target, menu selection, link foreground, buttons, breadcrumbs
- **Search and Quick Input glow**: input option active bg, quick input list focus, picker headers, editor widget border, find match, peek view
- **Bracket pair colors**: 4-level highlighting (`#FFD700` → `#BFA53A` → `#C9B37E` → `#8A8578`)
- **Full ANSI terminal**: 16 colors for accurate terminal rendering
- **Configuration defaults**: bracket pair colorization, smooth cursor animation, font recommendation
- **New command**: `Gold Elite: Open Font Download Page`
- **164 total color keys**

## 0.1.0 (2026-06-10)

### Base Theme

- Near-black (`#0A0A0A`) workbench with no panel-to-panel tonal variation
- Single gold accent system: `#FFD700` bright gold + `#BFA53A` muted gold
- Full workbench chrome: activity bar, sidebar, tabs, status bar, panels, inputs, buttons, scrollbars, badges, notifications, menus, quick input, terminal
- Editor core colors: gold cursor, warm selection/highlight, muted indent guides, word highlighting, focus border
- Syntax tokens: JavaScript/TypeScript, Python, JSON, HTML+CSS, Markdown
- Semantic tokens: TypeScript/JavaScript (class, interface, enum, type parameter, property, parameter, function, variable, namespace, modifier)
- Safe glow via cursor, selection layering, and focus border only
