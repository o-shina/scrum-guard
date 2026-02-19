#!/usr/bin/env python3
from pathlib import Path

root = Path(__file__).resolve().parent.parent
index = (root / "index.html").read_text(encoding="utf-8")
style = (root / "style.css").read_text(encoding="utf-8")
js = (root / "game.js").read_text(encoding="utf-8")

required_ids = [
    "start-btn",
    "approve-btn",
    "deny-btn",
    "next-btn",
    "restart-btn",
    "game-screen",
    "result-screen",
    "gameover-screen",
]

for rid in required_ids:
    needle = f'id="{rid}"'
    if needle not in index:
        raise SystemExit(f"Missing required id in index.html: {rid}")

required_css = [".action-btn", ".stamp-btn", ".screen.active", "@media (max-width: 768px)"]
for token in required_css:
    if token not in style:
        raise SystemExit(f"Missing expected CSS token: {token}")

required_js = ["isTransitioning", "setTransitioning", "judge(isDeny)", "showResult(isCorrect)"]
for token in required_js:
    if token not in js:
        raise SystemExit(f"Missing expected JS token: {token}")

print("ui_sanity_check: ok")
