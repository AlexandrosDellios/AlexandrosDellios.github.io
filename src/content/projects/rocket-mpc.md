---
# Featured project 3 · copy mirrored in docs/CONTENT.md (keep both in sync).
# Sources: CV "MPC Rocket Landing Controller" (claims, used as written: PID + MPC,
# drag, wind) + the team's course report via private/research/repo_MPC-Rocket.json (method, numbers).
title: "Landing a 6-DOF rocket with robust & nonlinear MPC"
shortTitle: "Rocket MPC"
shortWord: "ROCKET"
order: 3
year: "2025"
context: "EPFL · Model Predictive Control course"
team: "Team of 3"
oneLiner: "A dual-layer PID + MPC flight controller, topped by a custom nonlinear MPC, lands a simulated 6-DOF rocket through orientation errors and wind disturbances."
metric: "30° ROLL → LANDED < 4 S"
tags: ["MPC", "Nonlinear MPC", "Tube MPC", "CasADi"]
accent: "#B8418E" # magenta
accentInk: "#8E2C6B"
cvMatch: true
links:
  code: "https://github.com/AlexandrosDellios/MPC-Rocket"

poster: "../../assets/projects/rocket-mpc/poster.png"
posterAlt: "Simulated rocket at the end of its curved flight path above a green ground grid, in the course's 3D visualizer"
focus: "50% 100%" # the poster is 5:4; anchor the bottom so the rocket stays in the 4:3 crop
mediaNeeded: "Rocket landing screen recording" # spec (16:9, 5–10 s) in docs/MEDIA.md §3
figures:
  - src: "../../assets/projects/rocket-mpc/fig-nmpc-closed-loop-landing.png"
    alt: "NMPC closed loop: x, y, z converge to the landing target and the roll angle goes from 30 degrees to zero in under 4 s, with all inputs inside their limits"
    caption: "Nonlinear MPC, closed loop. From 10 m up with a 30° roll, the rocket reaches its landing target point in under 4 s, with every input inside its limits."
    credit: "Team figure · course report"
  - src: "../../assets/projects/rocket-mpc/fig-tube-mpc-mrpi-terminal-sets.png"
    alt: "Minimal robust invariant set and terminal set used by the tube MPC on altitude"
    caption: "Tube MPC on altitude: the minimal robust invariant set (the tube the true state stays in around the plan) and the terminal set."
    credit: "Team figure · course report"
  - src: "../../assets/projects/rocket-mpc/fig-tube-mpc-extreme-disturbance.png"
    alt: "Tube MPC under worst-case disturbance: vertical speed, altitude staying above ground, and throttle within limits"
    caption: "Worst-case disturbance on every step: altitude never drops below the ground and throttle stays within its limits."
    credit: "Team figure · course report"
  - src: "../../assets/projects/rocket-mpc/fig-offset-free-disturbance-estimate.png"
    alt: "The offset-free observer's disturbance estimate converging to its steady-state value"
    caption: "Offset-free MPC: the observer's disturbance estimate settles, which removes the tracking offset caused by the heavier-than-modeled rocket."
    credit: "Team figure · course report"

lead: "How do you land precisely when *your model is wrong* and the world pushes back?"
tldr:
  problem: "Land a simulated 6-DOF rocket (12 states) precisely within actuator and tilt limits, despite model mismatch, unknown mass and disturbances."
  built: "A dual-layer flight control system (PID and MPC) for highly accurate speed and trajectory tracking, an offset-free observer, a robust tube MPC for a safety-first landing, and a custom nonlinear MPC in CasADi."
  result: "The nonlinear MPC recovers from a 30° roll and lands on target in under 4 s; the tube MPC keeps the rocket above ground under worst-case disturbance."
  stack: "Python, CasADi + IPOPT, CVXPY + PIQP, mpt4py, python-control"
---

## The *approach*

1. **Decouple.** Linearize around hover and split the rocket into x, y, z and roll subsystems. Each gets an MPC with an LQR terminal cost and a maximal invariant terminal set, which keeps the controller feasible over time.
2. **Dual layer.** An outer PID position loop sends velocity setpoints to the MPCs. Soft constraints keep the problem feasible on the full nonlinear simulator.
3. **Offset-free tracking.** A disturbance-augmented model and a Luenberger observer remove the steady-state error when the rocket is 1.5× heavier than modeled, and while it burns fuel.
4. **Safety-first landing.** A robust tube MPC on altitude, built from a minimal robust invariant set and tightened constraints, guarantees the rocket never goes below the ground for any disturbance within its bounds.
5. **Custom nonlinear MPC.** One controller for the full nonlinear dynamics in CasADi: RK4 discretization, 3.5 s horizon, LQR terminal cost and warm-started IPOPT solves.

## What it *achieved*

- **30° roll → landed in under 4 s.** The custom nonlinear MPC corrects complex aerodynamic drag and prevents orientation errors during landing, starting 10 m up with a 30° roll.
- **Guaranteed stability under unpredictable wind disturbances.** Even with a constant worst-case disturbance, the tube MPC keeps the rocket above ground and the throttle within limits.
- **Fast linear MPCs.** The per-axis controllers stabilize from 5 m/s in under 7 s and track a 35° roll setpoint in about 3 s.
- **Offset-free at 1.5× mass.** The disturbance observer cancels the steady-state velocity error of a rocket 50% heavier than its model.

## *Notes*

The rocket model, simulator and 3D visualizer were provided by the course. We closed the project with a comparison of nonlinear MPC and robust linear MPC on safety guarantees, computational cost and axis coupling.
