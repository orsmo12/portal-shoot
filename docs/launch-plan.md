# Launch plan (summary)

The full plan (in Hebrew) is a Claude Doc: https://claude.ai/artifact/YPxVm2pCGEUo41NAkj8od6

## Decisions taken
1. **World sizes:** 5, 5, 6, then 8 per world. ✅ done in 0.10.0
2. **First Dark World:** World 4. ✅
3. **Names:** keep "Searchlight". Dark World reward = the **Eclipse** ball trail. ✅
4. **Rewarded ads:** all five placements. ✅ (web adapter + test mode; AdMob in the Android app)
5. **Prices:** launch prices as in the store catalog, plus an **Ad-free Pass** at launch. ✅ (catalog + entitlements; real billing in the Android app)
6. **Developer account:** personal Google Play account. It needs a **closed test with 12 testers for 14 consecutive days** before production.

## Road to Google Play
1. Wrap `web/` in **Capacitor** (Android). A Trusted Web Activity can't use AdMob, so Capacitor it is.
2. Add the AdMob plugin and implement `window.PortalAds.show(placement)` with rewarded ads.
3. Add Google Play Billing and implement `window.PortalBilling` + `PortalGrant` (restore).
4. Target API level 36. Play Console: store listing, content rating, data-safety form (GA4 + AdMob), privacy policy.
5. Closed test: 12+ testers for 14 days → apply for production.
6. Public launch: remove `noindex`, update the Netlify site and `og:` tags.

## Store catalog (launch prices, USD)
| Product | Price | Contents |
|---|---|---|
| Starter Pack (once) | $1.99 | 150 ★ + one of every power-up |
| Pouch / Chest / Vault of Stars | $0.99 / $2.99 / $6.99 | 80 / 250 / 700 ★ |
| Night Explorer | $1.99 | 3 Searchlight, 2 Ghost Ball, 60 ★ |
| Sharpshooter | $1.99 | 2 Perfect Path, 3 Infinite Bounce, 60 ★ |
| Aurora Trail (once) | $0.99 | cosmetic ball trail |
| Ad-free Pass (once) | $3.99 | every ad reward instantly, no videos |
