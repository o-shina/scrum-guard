# ExecPlan: Scrum Guard UI改善（世界観維持・デザイン刷新）

## Summary
- 検問所×スクラム審査の世界観を維持しつつ、UIを大幅刷新する。
- 対象は `index.html`, `style.css`, `game.js`。`scenarios.js` は変更しない。
- 検証は「手動E2E + 軽量自動チェック」を採用する。

## Scope
- 情報階層の再設計（判定に必要な情報を優先）
- 視認性改善（配色、余白、タイポ、状態の見え方）
- 入力安全性改善（判定連打による二重処理防止）
- モバイル表示最適化（固定フッターと本文干渉解消）
- `AGENTS.md` へ ExecPlans 運用ルール追加

## Non-Scope
- `scenarios.js` のシナリオ・仕様変更
- バックエンド導入、フレームワーク移行

## Interfaces / Contracts
- 維持対象
  - `SCENARIOS`, `RULES_BY_DAY` 利用契約
  - 主要DOM ID: `start-btn`, `approve-btn`, `deny-btn`, `next-btn`, `restart-btn`, `game-screen`, `result-screen`, `gameover-screen`
- 追加可能
  - 補助クラス（例: `is-transitioning`）と補助属性（`aria-*`）

## Implementation Checklist
- [x] `.agent/PLANS.md` を ExecPlans 形式へ更新
- [x] `AGENTS.md` を新規作成し ExecPlans ルールを追加
- [x] `index.html` の情報階層・アクセシビリティを改善
- [x] `style.css` を再設計（世界観維持・デザイン刷新）
- [x] `game.js` に遷移中フラグと入力保護を追加
- [x] `.agent/screenshots/` ディレクトリを作成

## Screenshot Protocol
- ツール: `agent-browser --headed`
- 保存先: `.agent/screenshots`
- 粒度: 画面単位で Before/After
- 必須Viewports: `1366x768`, `390x844`
- 必須画面: `title`, `game`, `result`, `gameover`

## Validation
- 実施済み
  - `node --check game.js`
  - `python3 -m py_compile scripts/ui_sanity_check.py`
  - `python3 scripts/ui_sanity_check.py`
- 手動E2E
  - 本環境では `agent-browser` コマンドが未インストールのため自動取得不可
  - 実行時は `agent-browser --headed` で同一シナリオの Before/After を取得する

## Acceptance Criteria
1. 開始後に `game-screen` へ遷移する
2. 判定後に `result-screen` へ遷移する
3. 判定連打で二重更新しない
4. 3ミスで `gameover-screen` へ遷移する
5. 再プレイで `score=0`, `strikes=0`, `day=1`
6. `1366x768` と `390x844` で主要操作要素が視認・操作可能
7. 結果/ゲームオーバーでスクロール破綻がない
