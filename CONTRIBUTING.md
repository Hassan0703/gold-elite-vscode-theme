# Contributing to Gold Elite

Thank you for considering contributing to Gold Elite! We welcome contributions of all kinds.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## How to Contribute

### Reporting Bugs

1. Check existing [issues](https://github.com/hassan-ali/gold-elite-2-0/issues) to avoid duplicates
2. Use the [Bug Report template](https://github.com/hassan-ali/gold-elite-2-0/issues/new?template=bug_report.md)
3. Include:
   - VS Code version
   - OS version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Developer Tools console output (Help → Toggle Developer Tools)

### Suggesting Features

1. Check existing [issues](https://github.com/hassan-ali/gold-elite-2-0/issues) to avoid duplicates
2. Use the [Feature Request template](https://github.com/hassan-ali/gold-elite-2-0/issues/new?template=feature_request.md)
3. Describe the problem you're solving, not just the solution you want

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Make your changes
4. Test thoroughly in VS Code
5. Commit with a clear message (`feat: add amazing feature`)
6. Push and open a Pull Request

### Development Setup

```bash
git clone https://github.com/hassan-ali/gold-elite-2-0.git
cd gold-elite-2-0
npm install
```

To test locally:

1. Open the project folder in VS Code
2. Press `F5` to launch the Extension Development Host
3. In the new window, apply the Gold_Elite-2.0 theme

### Packaging

```bash
npx @vscode/vsce package
```

### Code Style

- Follow existing patterns in the codebase
- No external runtime dependencies
- Zero network calls
- Respect reduced-motion preferences
- No telemetry
- Every feature needs its own off-switch

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `style:` formatting, no code change
- `refactor:` code restructuring
- `perf:` performance improvement
- `test:` adding tests
- `chore:` maintenance

## Questions?

Open a [Discussion](https://github.com/hassan-ali/gold-elite-2-0/discussions) or check the [FAQ](FAQ.md).
