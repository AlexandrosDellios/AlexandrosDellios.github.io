---
# More projects, row 3 · copy mirrored in docs/CONTENT.md (keep both in sync).
# Not on the CV. Sources: the team's course code and commit history via
# private/research/repo_Classes-MA2-2026.json. The repo is teammate-owned: never link it.
# No quantitative results exist for this project: the copy describes the controller, not success rates.
title: "Fly navigation in NeuroMechFly"
shortTitle: "Fly navigation"
shortWord: "FLY"
order: 3
section: "more"
year: "2026"
context: "EPFL · Controlling Behavior in Animals and Robots course"
team: "Team of 3"
myPart: "Posture correction, odor attraction, level 1–2 movement logic"
oneLiner: "A hierarchical controller steers a simulated fruit fly to an odor source past obstacles, wind, hills and a predator, using its eyes, antennae and smell."
metric: "4 SENSES · 5 LEVELS"
tags: ["Bio-inspired control", "Sensor fusion", "MuJoCo (flygym)", "Python"]
accent: "#7BAE2F" # grass green, from the arena's grass obstacles
accentInk: "#456A13"
cvMatch: false

poster: "../../assets/projects/fly-navigation/poster.jpg"
posterAlt: "Chase-camera view of the simulated fruit fly walking between green grass obstacles in MuJoCo"
focus: "50% 50%"
video:
  mp4: "/media/fly-navigation/loop.mp4"
  webm: "/media/fly-navigation/loop.webm"
  poster: "/media/fly-navigation/loop-poster.jpg"

lead: "How do you walk a simulated fly to its food when *every sense tells a different story*?"
tldr:
  problem: "Walk a simulated fruit fly to an attractive odor source through five levels of rising difficulty (obstacles, wind, hilly terrain, a predator), using only its on-board senses."
  built: "A priority-based controller on top of a CPG walking model: escape the predator, avoid obstacles, turn toward the odor, then track it, with posture correction throughout."
  result: "One controller that fuses compound-eye vision, smell, antenna wind sensing and body tilt, built to handle all five levels."
  stack: "Python, NumPy/SciPy, MuJoCo, flygym (NeuroMechFly v2)"
---

## The *approach*

1. **Walking.** flygym’s CPG-based walking model turns two descending signals, a left and a right drive, into a six-legged gait. The controller only decides those two drives.
2. **Escape first.** The predator shows up as red pixels in the compound eyes, and the fly sprints away from it.
3. **Avoid obstacles.** Green-pixel density in the upper field of each eye flags grass ahead. The turn direction accounts for the wind, sensed as antenna deflection against a calibrated baseline, and for the hill tilt, read from the body’s roll and pitch.
4. **Find the food.** Two olfactory sensors first turn the fly in place toward the odor, with a smooth fade-out, then keep it on course with a left/right steering bias.
5. **Stay upright.** A pitch and roll posture correction is added on top of the drives the whole time.

## What it *achieved*

- **Four senses, one controller.** Compound-eye vision, smell, antenna wind sensing and body orientation feed a single priority-based decision tree.
- **Five levels.** Odor tracking, grass obstacles, wind, hilly terrain and a dragonfly predator, all handled by the same controller.
- **My part:** the pitch and roll posture correction, the odor-attraction module, and the movement logic for the first two levels.

## *Notes*

NeuroMechFly, its CPG walking model, the arenas and the simulated senses come from the course framework (flygym). We wrote the controller as a team of 3. The code lives in a teammate’s repository.
