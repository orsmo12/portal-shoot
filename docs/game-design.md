# Game design notes

## Core rule
The sun portal shows a number **N**. The ball must bounce exactly N times and then enter the core. Fewer bounces, more bounces, coral, black holes or leaving through a gap all cost a life.

## World layout
`WORLD_SIZES = [5, 5, 6]`, then `FULL_WORLD = 8`. Helpers: `worldSize`, `firstOf`, `lastOf`, `worldOf`, `idxOf`, `isLastOf`.

| World | Levels | New idea per level |
|---|---|---|
| 1 Lumen Reach | 1–5 | direct shot → 1 bounce → 1 bounce → 2 bounces (hard) → victory lap. 2-bounce aim guide. |
| 2 Ember Nebula | 6–10 | boost relay → 2 bounces → first coral → coral + divider (hard) → lap |
| 3 Tidal Rift | 11–16 | moving wall → moving + coral → first black hole → everything (hard) → 3-bounce hall (hard) → lap |
| 4 The Eclipse Vault | 17–24 | **first Dark World**. No orbs, gaps or timing, and a longer look (5.5 s) before lights out. |
| 5+ | 8 each | wavy curve: 1–5 build up, 6–7 spike, 8 is an easy victory lap |

Dark Worlds: 4, 8, 12, then every 5th world (17, 22, …).

## Economy
- Stars are paid only when a level's best rating improves.
- Daily bonus: 10 ★.
- Revive price: `min(40, 5 + 3·(world−1))` × 1.5 for each earlier revive in the same world run. A revive gives 3 ♥ and **no** power-ups.
- World prize (first clear): Lumen → Perfect Path, Ember → Gravity Pull, Tidal → Ice Freeze, Rose → Ghost Ball, Gilded → Infinite Bounce, Aurora → Perfect Path. Dark → Searchlight (+ the Eclipse trail for the first one).
- Perfect World (3★ on every level): bonus kit for the next world, upgraded if no power-ups were used.

## Physics
Ball speed 1400 px/s. The pull range scales with the screen; launch power ranges from 72 % to 100 %. The level generator builds proven routes first, then adds decoys and hazards, and checks every route with the same `simulate()` the game uses.
