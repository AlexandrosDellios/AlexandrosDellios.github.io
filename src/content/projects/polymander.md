---
# More projects, row 1 · copy mirrored in docs/CONTENT.md (keep both in sync).
# Not on the CV. Sources: the team's course report and code via
# private/research/repo_Classes-MA2-2026.json. The repo is private and teammate-owned: never link it.
title: "Polymander: a salamander robot that swims and walks"
shortTitle: "Polymander"
shortWord: "POLYMANDER"
order: 1
section: "more"
year: "2026"
context: "EPFL · Computational Motor Control course"
team: "Team of 3"
oneLiner: "Spinal-cord-style oscillators plus stretch feedback make a simulated amphibious robot swim faster on less energy, then switch to walking on land."
metric: "+20% SPEED · −16% CoT"
tags: ["CPG", "Sensory feedback", "MuJoCo (FARMS)", "Bio-inspired control"]
accent: "#7377C7" # periwinkle, sampled from the water render
accentInk: "#474BA3"
cvMatch: false
privateRepo: true

poster: "../../assets/projects/polymander/poster.jpg"
posterAlt: "Top view of the simulated Polymander salamander robot swimming with a traveling body wave"
focus: "10% 50%" # lines the 16:9 loop up with the 4:3 poster (docs/MEDIA.md §0)
video:
  mp4: "/media/polymander/loop.mp4"
  webm: "/media/polymander/loop.webm"
  poster: "/media/polymander/loop-poster.jpg"
figures:
  - src: "../../assets/projects/polymander/fig-metrics-vs-feedback-gain.png"
    alt: "Swimming speed, cost of transport, neural frequency and amplitude as the stretch-feedback gain increases"
    caption: "Stretch-feedback gain sweep. As the gain grows, swimming gets faster and cheaper, and the network's rhythm speeds up."
    credit: "Team figure · course report"
  - src: "../../assets/projects/polymander/fig-disruption-4conditions.png"
    alt: "Speed and cost of transport for the combined (coupled) and decoupled networks, with and without 20% neural disruption"
    caption: "Robustness to 20% random disruption of sensors and couplings. The combined (coupled) network nearly stops; the decoupled, sensory-driven network keeps swimming at a far lower cost of transport."
    credit: "Team figure · course report"
  - src: "../../assets/projects/polymander/fig-swim2walk-forces.png"
    alt: "Ground reaction and hydrodynamic forces on the body as the drive moves from walking to swimming"
    caption: "Forces on the body across the drive range: ground reaction dominates at walking drives, and hydrodynamic force takes over past the walk/swim cut-off at d = 3."
    credit: "Team figure"
extraVideos:
  - mp4: "/media/polymander/walk.mp4"
    webm: "/media/polymander/walk.webm"
    poster: "/media/polymander/walk-poster.jpg"
    caption: "Walking: the limb oscillators take over at low drive."
  - mp4: "/media/polymander/swim2walk.mp4"
    webm: "/media/polymander/swim2walk.webm"
    poster: "/media/polymander/swim2walk-poster.jpg"
    clickToPlay: true
    caption: "Swim to walk: when the feet touch the ground, the drive drops into the walking range."
  - mp4: "/media/polymander/walk2swim.mp4"
    webm: "/media/polymander/walk2swim.webm"
    poster: "/media/polymander/walk2swim-poster.jpg"
    clickToPlay: true
    caption: "Walk to swim: without ground contact, the drive rises into the swimming range."

lead: "How much does a little *sensory feedback* help a spinal-cord-like controller, especially when parts of it fail?"
tldr:
  problem: "Produce efficient, robust swimming and walking from coupled oscillators driven by a single descending drive signal."
  built: "In stages: an open-loop traveling wave, a 16-oscillator double-chain CPG tuned to X-ray recordings of real salamanders, stretch feedback, then contact-driven switching between swimming and walking."
  result: "+20% swimming speed and −16% cost of transport with feedback, 61% lower joint error against the animal data, and 2.4× more distance under neural damage."
  stack: "Python, NumPy/SciPy, FARMS (MuJoCo), Matplotlib"
---

## The *approach*

1. **Baseline.** An open-loop traveling wave drives Ekeberg muscle models; a 5 × 5 sweep of amplitude and wave lag maps out what works.
2. **Spinal CPG.** A double chain of 16 amplitude-phase oscillators, swept over drive and phase lag. Steering comes from left/right drive asymmetry.
3. **Match the animal.** We compared joint trajectories with X-ray recordings of swimming salamanders, then retuned the network to match their uneven phase lag along the body.
4. **Feedback and damage.** Proprioceptive stretch feedback with a gain sweep, then a robustness study with 0–20% random disruption of sensors and couplings.
5. **Amphibious switching.** A body and limb CPG where ground contact pulls the drive toward walking (d = 2.5) and its absence toward swimming (d = 4.5).

## What it *achieved*

- **+20% speed, −16% cost of transport.** Stretch feedback (w_ipsi = 3) raised swimming speed from 0.201 to 0.241 m/s and cut cost of transport by 16% at the same drive.
- **61% closer to the animal.** Tuning to the X-ray data cut mean joint-trajectory error from 0.236 to 0.092 rad.
- **2.4× more travel under damage.** With 20% random disruption, the decoupled, sensory-driven network kept about 2.4 times more forward travel than the combined (coupled) network.
- **Steering.** Asymmetric drive turns the robot, with curvatures of about +16 and −20 m⁻¹.
- **Swim-to-walk and walk-to-swim.** Both transitions happen in an amphibious arena, triggered by ground contact alone.

## *Notes*

The Polymander robot model, the simulation setup and the salamander X-ray recordings were provided by the course. The code lives in a private team repository.
