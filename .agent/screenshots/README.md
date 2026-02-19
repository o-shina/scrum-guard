# Screenshots

Before/After screenshots for UI validation should be stored here.

Required screens:
- title
- game
- result
- gameover

Required viewports:
- 1366x768
- 390x844

Current environment status:
- `agent-browser` command is not installed.
- `playwright` CLI is not installed.
- `npx playwright --version` could not be run to completion due environment/network constraints.

Execution instructions when tool is available:
1. Start local server from repo root.
2. For each viewport in `1366x768`, `390x844`, capture before and after for each screen.
3. Save files as:
   - `title-before-{width}x{height}.png`
   - `title-after-{width}x{height}.png`
   - `game-before-{width}x{height}.png`
   - `game-after-{width}x{height}.png`
   - `result-before-{width}x{height}.png`
   - `result-after-{width}x{height}.png`
   - `gameover-before-{width}x{height}.png`
   - `gameover-after-{width}x{height}.png`
