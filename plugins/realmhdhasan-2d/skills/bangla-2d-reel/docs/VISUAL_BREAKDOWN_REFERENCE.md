# VISUAL BREAKDOWN — realmhdhasan Bengali 2D Reels (v3)

All values below were **pixel-sampled from reference frames**, not estimated.
When in doubt, trust this file over intuition.

## 1. Canvas & HUD
| | |
|---|---|
| Canvas | 1080 × 1920, 30fps |
| Brand pill | centre y 92, plate 424×72 r36, `— realmhdhasan —`, Playfair italic 40px, gold |
| Context pill | centre y 190, plate 300×58 r29, gold dot + Bengali label |
| Subtitle panel | **centre y 1548**, width 984, height 150 (1 line) → 232 (2 lines) |
| Stat/pin card | ~(862, 352), plate 268×156 r18, rotate −5° |
| Safe zone | important type inside the middle ~75% vertically |

## 2. Colour tokens (sampled)
| Role | Hex | Source |
|---|---|---|
| Subtitle panel | `#1D3A2C` | reference board `#1B362A`, bar `#293531` |
| Panel hi / lo | `#274938` / `#14291F` | gradient stops |
| Panel border | `#C79A47` | |
| Normal word | `#F6EFDF` | reference white text |
| **Accent word** | **`#F0C86A`** | reference gold `#E9C766`, `#F3D081` |
| Glyph stroke / shadow | `#10231B` | |
| Outline (line art) | `#26201C` | |
| Wall hi / mid / lo | `#F3E7CF` / `#DFCDAB` / `#AE946F` | |
| Floor | `#8E5340` → `#6F4133` | |
| Key light tint | `#FFD9A0` | |

**There is no red type anywhere.** Red (`#B33030`) appears only as the push-pin dot.

## 3. Premium fill — the measured numbers
| Part | Lit | Shade | Multiplier |
|---|---|---|---|
| Skin | `#B87D4F` | `#A87146` | **0.90** |
| Cloth | `#DFAA39` | `#BA8D32` | **0.83** |
| Hair | — | — | **0.88** |

Gradient: 4 stops — `tint(lit, warm, 0.22)` → base @36% → base @**64% (hold)** → `shade(base, mul)`.
The 64% hold is what makes it read as cel shading rather than airbrush.

Other layers: AO `#241307` @ 0.24 · rim `#FFE7C6` @ 0.42–0.62 · DOF `stdDeviation 8`
(groups only) · bloom 0.34 · vignette 0.46 · grain 0.05.

## 4. Front-facing character rig
- Height ~565 units, ~4.3 heads, `(0,0)` = ground between the feet
- Head ±52 wide, −71…61 tall; eyes at `(±21, −2)`, r 12 / 12.6, pupil r 7.2
- Thick upper lid `M -12 -5 Q 0 -16 12 -4` — omit it and the eyes read as buttons
- Brows `(±)` mirrored, rotate inner ends: angry −14°, sad +14°, happy −4°
- Shoulders ±64 @ −400, waist ±86 @ −334, hem ±80 @ −208
- Arms: ONE path stroked 3× (outline / sleeve gradient / rim-or-AO), `AW 27`,
  anchored `(±74, −390)`. **Drawn in front of the body.**
- Draw order: legs → body → both arms → head
- Idle: blink every ~118f (scaleY→0.1), breathe amp 3.2 period 112, gaze drift ±1.8

## 5. Layout
- Feet `y ≈ 1418–1430`, scale `1.42–1.46`
- Two characters: `x ≈ 356` and `≈ 730`
- Background character: scale ~1.0, higher on the floor plane, inside `DepthLayer`

## 6. Typography
- `Noto Serif Bengali` 700 for everything Bengali (Hind Siliguri is too uniform —
  it loses the flared terminals visible in the reference boards)
- Every glyph: `paintOrder="stroke"`, stroke `#10231B` @ 7, plus `feDropShadow dx2 dy4 sd1.2`
- Accent words add a single 3px `#FFC95E` sheen and nothing else
- **Never a gaussian glow on Bengali text** — it smears the conjuncts
- Word widths measured with canvas `measureText`, never hand-written numbers

## 7. Motion
HIT → hold 15–20 static frames → build → HIT. Visuals land 4–6 frames before the
word. Nothing sits longer than 90 frames without a new visual. Slow camera push
1.0 → 1.052 across the shot; the HUD stays outside the push.

## 8. Sound
5–7 synthesized WAVs, 0.20–0.35 volume, firing 2–3 frames before their HIT.
Short (0.1–0.7s), soft attack, fast decay. No cartoon beeps or metallic hits.

## 9. Files in this folder
- `reference-look-6.5s.mp4` — the approved look, rendered from this spec
- `type-reference-1.png`, `type-reference-2.png` — the Bengali type the spec matches
