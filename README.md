# The Franchise

A 90s-style 2D browser game. Frank, a quarterback, chases a ring thief down a Rushville alley, loses a grapple, stumbles on to the police, dreams his way into a football game that ends in a legendary fumble, and wakes up handcuffed to a hospital bed. All characters, teams and places are fictional.

## Play

Open `index.html` in a browser, or serve the folder with any static web server. It is built for a phone held sideways; on a computer use the arrow keys or A and D.

The title screen has a "Start at" menu for jumping straight to any of the six sequences, and the end box has a Levels button that returns to it.

## Controls

| Scene | L / R |
| --- | --- |
| Alley sprint | Alternate to run |
| Grapple | Alternate to push back |
| Stumble | Alternate to limp forward |
| Football run | L cuts up a lane, R cuts down |
| Loose ball | Alternate to crawl |
| Hospital bed | Alternate as fast as you can to break the cuffs |
| Hospital hallway | R jumps, L slides |

## How it is put together

`index.html` holds the markup and loads one stylesheet and twelve scripts, in this order. The scripts are plain files that share global variables, so the order matters.

| File | What it does |
| --- | --- |
| `css/style.css` | Layout, HUD, title screen and the L and R buttons |
| `js/core.js` | Canvas setup, constants and small shared helpers |
| `js/state.js` | Game state: `S` (overall), `C` (alley confrontation), `D` (dream level), `HS` (hospital) |
| `js/audio.js` | Sound effects, city and crowd ambience, sirens, music tracks |
| `js/scenery.js` | Alley wall layout, fences, lamp poles, neon sign, code-drawn props |
| `js/characters.js` | Sprite sheets and character drawing for the alley scenes |
| `js/input.js` | Title screen, buttons, keyboard, and what a tap does in each alley scene |
| `js/scene-alley.js` | Arriving at the van, the confrontation timeline, reaching the police |
| `js/scene-dream.js` | The football level: run, collision, loose ball, touchdown, and its drawing |
| `js/scene-hospital.js` | The hospital scene: waking up, the handcuffs, breaking free, and its drawing |
| `js/scene-hallway.js` | The escape: the hallway run with obstacles to jump and slide past, and the leap through the window |
| `js/render.js` | Draws one frame of the alley scenes |
| `js/main.js` | The game loop and start-up |

Before committing a change, run `python3 stamp.py`. It puts a fresh version number on the stylesheet and script links in `index.html`, so browsers and GitHub Pages pick up the new files straight away and never mix old and new ones.

## Assets

Images are in `assets/img`, audio in `assets/audio`. Sprite sheets are single rows of equal-size cells; cell sizes are hard-coded next to where each sheet is drawn.

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
| `hosp_faces.webp`, `hosp_wide.webp` | Hospital: five close-up face panels, and three wide shots of the bed (cuffed, left free, both free) |
| `hosp_wide_v1.webp` | The earlier set of wide shots, kept for reference and not used by the game |
| `title2.webp`, `portrait.png` | Title art and HUD portrait |
| `title.mp3`, `game.mp3`, `hospital.mp3` | Title music, gameplay music and the hospital voice track |
