---
# Featured project 1 · copy mirrored in docs/CONTENT.md (keep both in sync).
# Sources: CV "Deep-RL Quadruped Locomotion Controller" (claims, used as written)
# + the team's course report via private/research/repo_Legged-Robot.json (method, numbers).
title: "Quadruped locomotion with CPGs + deep RL"
shortTitle: "Quadruped CPG + RL"
shortWord: "A1 QUADRUPED"
order: 1
year: "2025"
context: "EPFL · Legged Robots course"
team: "Team of 3"
oneLiner: "A PPO policy steers bio-inspired oscillators so a simulated Unitree A1 can trot, run and climb 29% slopes."
metric: "29% INCLINE · ≈16°"
tags: ["Deep RL", "PPO", "PyBullet", "CPG"]
accent: "#E2A814" # mustard, sampled from the yellow ramp in the footage
accentInk: "#7A5800"
cvMatch: true
links:
  code: "https://github.com/AlexandrosDellios/Legged-Robot"

poster: "../../assets/projects/quadruped-cpg-rl/poster.png"
posterAlt: "Simulated Unitree A1 quadruped climbing a yellow ramp in PyBullet"
focus: "50% 50%"
video:
  mp4: "/media/quadruped-cpg-rl/loop.mp4"
  webm: "/media/quadruped-cpg-rl/loop.webm"
  poster: "/media/quadruped-cpg-rl/loop-poster.jpg"
figures:
  - src: "../../assets/projects/quadruped-cpg-rl/fig-gait-phases.svg"
    alt: "Phase offsets of the four legs for trot, walk, pace and bound gaits, with a one-cycle timeline of each leg's swing phase"
    caption: "The four CPG gaits. Each leg's oscillator runs at a fixed phase offset from the others; the bars show when each foot is in the air. Swing length is illustrative."
    credit: "Redrawn for this site from our course report"
  - src: "../../assets/projects/quadruped-cpg-rl/fig-obs-space-reward-curves.png"
    alt: "Training reward curves for four observation spaces; the full observation with CPG states reaches about twice the reward of the one without"
    caption: "Observation ablation. With the oscillator states in the observation, the policy reaches a mean reward of 74.4, against 35.5 without them."
    credit: "Team figure · course report"
  - src: "../../assets/projects/quadruped-cpg-rl/fig-velocity-tracking.png"
    alt: "Measured vs desired forward speed at 0.5, 1.0 and 1.5 m/s over two seconds"
    caption: "Velocity tracking: measured against desired forward speed for the policies trained at 0.5, 1.0 and 1.5 m/s."
    credit: "Team figure · course report"
  - src: "../../assets/projects/quadruped-cpg-rl/fig-foot-trajectory-cartesian-pd.png"
    alt: "Front-right foot trajectory against the desired swing/stance curve, with and without Cartesian PD feedback"
    caption: "Footstep accuracy. Front-right foot path against its target curve, with and without Cartesian-space feedback (RMS error 2.96 → 2.69 cm, ≈9% lower)."
    credit: "Team figure · course report"
extraVideos:
  - mp4: "/media/quadruped-cpg-rl/velocity.mp4"
    webm: "/media/quadruped-cpg-rl/velocity.webm"
    poster: "/media/quadruped-cpg-rl/velocity-poster.jpg"
    caption: "Flat-ground trot at about 1.3 m/s."

lead: "Can a rhythm generator borrowed from biology make deep-RL gaits *smoother and more robust*?"
tldr:
  problem: "Pure deep RL on legged robots tends to reward-hack into jerky gaits that don’t carry over to new terrain such as steep slopes."
  built: "Coupled Hopf oscillators (central pattern generators) set the rhythm, and a PPO policy learns to modulate each leg’s frequency and amplitude, trained with a slope curriculum and randomized friction and sensor noise."
  result: "Stable locomotion on steep inclines (29% slopes) and at high speeds, with physical footstep accuracy improved by nearly 9%."
  stack: "Python, PyBullet, Stable-Baselines3 (PPO), Gymnasium, NumPy"
---

## The *approach*

1. **Rhythm.** Four coupled Hopf oscillators produce trot, walk, pace and bound gaits. Their states map to foot trajectories, then to joint torques through inverse kinematics and PD control.
2. **Interface.** The policy observes foot contacts, joint states, base orientation and velocity, plus the oscillator states. We tested multiple action spaces: 8-D CPG modulation (frequency and amplitude per leg) against 12-D Cartesian foot targets.
3. **Algorithm.** PPO from Stable-Baselines3, chosen over SAC after a head-to-head test, then tuned with hyperparameter and network-size ablations.
4. **Rewards.** Velocity tracking at 0.5, 1.0 and 1.5 m/s. On slopes: forward progress minus lateral drift, torque, roll and yaw penalties.
5. **Curriculum.** 10% incline, then random 15–25%, then 25–35%, with randomized ground friction (μ 0.5–1.0) and observation noise.

## What it *achieved*

- **29% slopes (≈16°).** The adaptive curriculum raised the steepest slope the robot could traverse from 24% with fixed-slope training to 29%.
- **Nearly 9% better footstep accuracy.** We tested multiple action spaces to find the most efficient setup (foot RMS error 2.96 → 2.69 cm, Fig. 04).
- **About 2× the reward.** With the oscillator states in the observation the policy reached 74.4, against 35.5 without them.
- **Natural gaits.** The Cartesian action space scored a higher reward but reward-hacked into unnatural gaits; the CPG policy kept an animal-like trot.
- **High speeds.** A flat-ground trot at about 1.3 m/s (clip below), and cost of transport fell from 1.37 to 0.825 as speed rose.

## *Notes*

The Unitree A1 simulation environment, motor model and CPG skeleton came from the course framework. As a team we implemented the oscillator network, the foot controllers, the observation, action and reward design, and every experiment on this page.
