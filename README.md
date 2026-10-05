# The Franchise

A 90s-style 2D browser game. Frank, a quarterback, chases a ring thief down a Rushville alley, loses a grapple, stumbles on to the police, and then dreams his way into a football game that ends in a legendary fumble. All characters, teams and places are fictional.

## Play

Open `index.html` in a browser, or serve the folder with any static web server. It is built for a phone held sideways; on a computer use the arrow keys or A and D.

## Controls

| Scene | L / R |
| --- | --- |
| Alley sprint | Alternate to run |
| Grapple | Alternate to push back |
| Stumble | Alternate to limp forward |
| Football run | L cuts up a lane, R cuts down |
| Loose ball | Alternate to crawl |

## How it is put together

Everything is in `index.html`: styles at the top, then the markup, then one script. The script is organised in this order:

1. Setup and helpers (`fit`, `R`, `rng`)
2. Scenery layout for the alley (`layout`, the `SEC` wall sections)
3. State, input and audio (`S`, `C`, `D`, `step`, `audio`, `tick`, sound effects)
4. Scene logic: `arrive` and `cutUpdate` (confrontation), `arrive2` (police), `startDream`, `dreamTap` and `dreamUpdate` (football)
5. Drawing: `figure` (code-drawn fallback characters), `drawMark`, `drawDream`, `draw`
6. The main loop (`frame`)

## Assets

Sprite sheets are single rows of equal-size cells. Cell sizes are hard-coded next to where each sheet is drawn.

| File | What it is |
| --- | --- |
| `mark.png` | Hero: 8 run, 4 idle, 2 skid frames |
| `mark2.png` | Hero: shouting, winded, kneeling, on his back |
| `limp.png` | Hero: 6-frame limp |
| `worker.png`, `worker2.png` | The thief: idle, startled, reaching, jabbing |
| `grap.png` | The two-man grapple |
| `van.png`, `dumpster.png`, `cop.png` | Vehicles and props |
| `qb.png`, `lineman.png`, `defender.png` | Football players |
| `sec1.webp` to `sec5.webp`, `sky.webp`, `street.webp` | Alley walls, skyline, street |
| `stands.png` | Stadium backdrop |
| `title2.webp`, `portrait.png` | Title art and HUD portrait |
| `title2.mp3`, `game.mp3` | Title and gameplay music |
