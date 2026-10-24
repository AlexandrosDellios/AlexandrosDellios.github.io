---
# Selected work, tile 2 · copy mirrored in docs/CONTENT.md (keep both in sync).
# Sources: the team's course report (local only, never published), the CV "RL-Driven Glider Co-Design"
# (claims), the team's code (teammate-owned: never link it), and an inference run of its trained policy
# rendered for this site (2026-10-24).
title: "Glider perching with wing co-design"
shortTitle: "Glider co-design"
shortWord: "GLIDER"
order: 2
year: "2026"
context: "EPFL · Reinforcement Learning course · in collaboration with the CV Lab"
team: "Team of 3"
myPart: "SAC agent, in parallel with a teammate’s PPO"
oneLiner: "Reinforcement learning teaches a glider to land precisely while the agent redesigns its own wing, reaching success 29.7% faster."
metric: "29.7% FASTER CONVERGENCE"
tags: ["PPO", "Co-design", "GPU-batched sim", "Curriculum"]
accent: "#3A9AD9" # sky
accentInk: "#1A6796" # 4.85:1 on paper-2 (the TL;DR box), 5.35:1 on paper
cvMatch: true

# The final frame of the animation (a real inference run of the trained co-design policy, rendered for this site).
poster: "../../assets/projects/glider-codesign/poster.png"
posterAlt: "Simulation render: the glider perched on its target post after a pitch-up, its flight path traced behind it"
focus: "50% 50%"
video:
  mp4: "/media/glider-codesign/loop.mp4"
  webm: "/media/glider-codesign/loop.webm"
  poster: "/media/glider-codesign/loop-poster.jpg"
figures:
  - src: "../../assets/projects/glider-codesign/fig-training-curve-neuralfoil.png"
    alt: "Training curve of mean episode reward over 200 million timesteps, with three sharp drops at the curriculum stage changes"
    caption: "Training with NeuralFoil aerodynamics: each sharp drop is the curriculum tightening the perch, and the policy recovers every time. 200M timesteps in under 6 minutes."
    credit: "Team figure · course report"
  - src: "../../assets/projects/glider-codesign/fig-algorithm-comparison.png"
    alt: "Normalised training curves of PPO, SAC and TD3 over the first 4 million timesteps"
    caption: "PPO, SAC and TD3, normalised training curves over the first 4M timesteps: PPO was kept, for its stability across curriculum stages and its scaling to thousands of parallel gliders."
    credit: "Team figure · course report"
  - src: "../../assets/projects/glider-codesign/fig-optimized-airfoils.png"
    alt: "Airfoil outlines: the NACA 4412 baseline dashed, the co-designed wing close to it, and the thinner CEM winner"
    caption: "The wings: the NACA 4412 baseline, the co-designed wing, and the CEM winner, visibly thinner."
    credit: "Team figure · course report"
  - src: "../../assets/projects/glider-codesign/fig-convergence.svg"
    alt: "Bar chart of PPO updates to reach the final curriculum stage per frozen wing: NACA 4412 285, random direction 252, co-designed wing 208, random co-design sample 200, CEM winner 200"
    caption: "Learning speed per wing: PPO updates until the controller reaches the final curriculum stage, with each wing frozen (mean ± sd, 5 seeds). The CEM winner gets there 29.7% sooner than the NACA 4412."
    credit: "Redrawn for this site from our course report"
  - src: "../../assets/projects/glider-codesign/fig-rl-vs-ocp.png"
    alt: "Two glider trajectories from the same start to the perch: the trained policy and the optimal-control baseline"
    caption: "The trained policy against the optimal-control baseline from the same start: both reach the perch."
    credit: "Team figure · course report"
  - src: "../../assets/projects/glider-codesign/fig-success-heatmap.png"
    alt: "Heatmap of perching success rate over initial x and z positions, green almost everywhere, red at low and far starts and in one top corner"
    caption: "Success rate over start positions (perch within 5 cm at under 1 m/s): the policy perches from most of the region, and fails only where there is too little height or distance for the pitch-up."
    credit: "Team figure · course report"
  - src: "../../assets/projects/glider-codesign/poster-session.jpg"
    alt: "Three students next to their research poster, Reinforcement Learning for Glider Trajectory Planning, at a poster session in an EPFL hall"
    caption: "Presenting our poster at the poster session."
    photo: true

lead: "What if a robot could *redesign its own wing* while learning to fly?"
tldr:
  problem: "Perching, landing on a point at near-zero speed, needs a post-stall pitch-up, and the wing’s shape limits what any controller can do. Optimal-control co-design plans one open-loop trajectory for one start."
  built: "A closed-loop PPO controller for the elevator, trained to adapt to varying starting speeds, positions and flight directions in a GPU-native simulator with NeuralFoil aerodynamics, plus two searches for a better wing: one learned alongside the controller, one black-box."
  result: "Perches within 5 cm at under 1 m/s, matching optimal control from its start and generalizing beyond it; the best wing found cuts training time by 29.7%."
  stack: "Python, PyTorch, PPO, REINFORCE, cross-entropy method, NeuralFoil"
---

## The *approach*

1. **A simulator built for RL.** The planar glider dynamics (RK4) and the NeuralFoil aerodynamics surrogate run natively in PyTorch, so everything stays on the GPU: 4,096 gliders in parallel, about 600,000 steps per second on one RTX 5090. The agent sees a 7-D state and commands the elevator rate, within ±5 rad/s.
2. **Curriculum.** First a simple flat-plate aerodynamics model, then NeuralFoil, then four stages that tighten the perch from 0.5 m to 0.05 m, always under 1 m/s.
3. **Algorithm.** I built the SAC agent while a teammate built the PPO one, in parallel, both to replace the optimal-control planner with RL. SAC solved the flat-plate perch, but PPO was kept: it stays stable when the curriculum tightens (SAC’s replay buffer goes stale) and scales with thousands of parallel gliders, while TD3 never reliably found the pitch-up.
4. **Robustness.** Every episode starts from a randomized state: nine base positions 3 to 10 m from the perch, Gaussian noise, and a 30° spread on the velocity direction, so the controller learns a strategy, not one trajectory.
5. **Wing co-design.** The 18-D wing shape (Kulfan/CST parameters, 0 = NACA 4412) joins the policy’s state and learns by REINFORCE with a design critic as baseline. A second, black-box search (the cross-entropy method, 8 generations × 24 wings) looks directly for the wing the controller learns fastest.

## What it *achieved*

- **5 cm, under 1 m/s.** The NeuralFoil policy cleared all four curriculum stages in 200M timesteps, trained in under 6 minutes.
- **Optimal-control quality, closed loop.** From the optimal-control baseline’s start it perches with a trajectory of comparable quality, and it keeps perching from most other starts, where an open-loop plan would have to be solved again.
- **29.7% faster learning.** With the CEM wing, the controller reaches the final curriculum stage in 200 PPO updates instead of 285 for the NACA 4412, and masters perching in 244 instead of 336 (5 seeds); the co-designed wing is 27.1% faster.
- **The direction matters.** A random change of the same size is only 11.6% faster and was the only wing that once failed to master: co-design points somewhere real.

## *Notes*

The animation at the top is a real inference run of the trained co-design policy flying its co-designed wing, rendered for this site from the logged states: it perches 4.5 cm off target at 0.91 m/s after 2.42 s (shown at ×0.48, the glider drawn larger than scale). From 12 random starts, it perched every time.

A team of 3 in EPFL’s Reinforcement Learning course, in collaboration with the CV Lab: the project builds on the lab’s gradient-based co-design framework for winged robots, and NeuralFoil is an open-source aerodynamics surrogate. The code lives in a team repository.
