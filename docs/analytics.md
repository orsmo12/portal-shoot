# Analytics events (GA4)

Every event goes through `track(name, params)`. Add `?debug` to the URL to see them in the console. The latest events are also kept in `window.__psEvents`.

| Event | Params |
|---|---|
| `game_session_start` | — |
| `level_start` / `level_retry` | level, world |
| `level_complete` | level, world, stars, misses, first_clear, stars_gained, used_powerup, mode |
| `world_complete` | world |
| `world_prize` | world, item, cosmetic |
| `shot_missed` | level, world, reason, lives_left, shielded |
| `game_over` | level, world, mode, revives_this_world |
| `revive_purchase` | level, world, cost, revive_number |
| `revive_ad` | level, world |
| `world_restart` | world, from, reached_level |
| `powerup_purchase` / `powerup_use` | item, level |
| `gift_collect` | source, items / stars |
| `hint_free` | level |
| `ad_start` / `ad_reward` / `ad_cancel` | placement, level, ad_free |
| `iap_view` / `iap_start` / `iap_purchase` / `iap_cancel` | product, price |
| `cosmetic_equip` | item |
| `hard_reset` | reached_level |
| `app_install_prompt` / `app_installed` | — |

To see level numbers, items and placements in GA reports, register them once as **custom dimensions**: GA → Admin → Custom definitions.
