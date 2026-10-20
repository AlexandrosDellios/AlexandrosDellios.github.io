---
# Featured project 6 · copy mirrored in docs/CONTENT.md (keep both in sync).
# Sources: CV "RL-Driven Glider Co-Design" (claims, used as written: beats optimal control,
# wind and starting-speed robustness, 29.7% faster convergence) + the team's public code
# via private/research/repo_Classes-MA2-2026.json (method, numbers).
# The repo is teammate-owned: never link it. No real media yet; the poster is an ILLUSTRATION.
title: "Glider perching with wing co-design"
shortTitle: "Glider co-design"
shortWord: "GLIDER"
order: 6
year: "2026"
context: "EPFL · Course project"
team: "Team of 4"
oneLiner: "Reinforcement learning teaches a glider to land precisely while the agent redesigns its own wing, reaching success 29.7% faster."
metric: "29.7% FASTER CONVERGENCE"
tags: ["PPO", "Co-design", "GPU-batched sim", "Curriculum"]
accent: "#3A9AD9" # sky
accentInk: "#1A6796" # 4.85:1 on paper-2 (the TL;DR box), 5.35:1 on paper
cvMatch: true

poster: "../../assets/projects/glider-codesign/poster.png"
posterAlt: "Illustration: a NACA 4412 airfoil outline morphing into a more cambered co-designed wing section"
# Tile-only version: the outlines without the mono labels (illegible at tile size).
tilePoster: "../../assets/projects/glider-codesign/poster-tile.png"
focus: "50% 50%"
mediaNeeded: "Convergence plot, learned airfoil vs NACA 4412 and a perching evaluation clip"

lead: "What if a robot could *redesign its own wing* while learning to fly?"
tldr:
  problem: "Perching, landing precisely on a point at low speed, is a hard nonlinear control problem for fixed-wing gliders, and the wing’s shape limits what any controller can do."
  built: "A reinforcement-learning agent that flies the glider through its elevator, trained to adapt to unpredictable wind disturbances and varying starting speeds, plus a simultaneous optimization that redesigns the wing shape while the agent learns."
  result: "Highly precise landings that outperform optimal control methods, and co-design that accelerates success convergence by 29.7%."
  stack: "Python, PyTorch, PPO, REINFORCE, cross-entropy method, NeuralFoil"
---

## The *approach*

1. **Glider model.** A planar glider with a 7-D state; the agent commands the elevator rate. Aerodynamics come from NeuralFoil, a neural surrogate of XFOIL, run in batches in PyTorch.
2. **Training at scale.** PPO across 4,096 parallel GPU environments for 200M timesteps.
3. **Curriculum.** Four stages tighten the landing target from 0.5 m to 0.05 m, at under 1 m/s touchdown speed.
4. **Robustness.** Training with unpredictable wind disturbances and varying starting speeds, so the controller holds up outside the nominal case.
5. **Co-design.** A policy conditioned on the wing design learns alongside an 18-D airfoil shape, optimized with REINFORCE and a design critic. A cross-entropy-method search looks for the wing the agent learns to fly fastest.

## What it *achieved*

- **29.7% faster convergence.** The co-designed wing reaches successful landings sooner than the NACA 4412 baseline.
- **0.05 m landing precision.** Touchdown at under 1 m/s after the four-stage curriculum.
- **Beats optimal control.** Its landings are more precise than those of optimal control methods.
- **4,096 parallel environments.** 200M timesteps of GPU-batched PPO.
- **Airfoil search.** The cross-entropy method explores 8 generations × 24 candidate wings.

## *Notes*

The image at the top is an illustration (a NACA 4412 baseline morphing toward a more cambered section), not the learned airfoil. The code lives in a team repository.
