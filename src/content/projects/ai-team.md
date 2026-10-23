---
# Role page 2 (/experience/ai-team/) · copy mirrored in docs/CONTENT.md (keep both in sync).
# Sources: the CV's EPFL Student AI Team entry (wording as written). The robot's name (Byte) and
# the project documentation link come from Alexandros (2026-10-23).
kind: "role"
title: "Byte, a guide-dog quadruped built from scratch"
shortTitle: "EPFL Student AI Team"
shortWord: "BYTE"
order: 2
year: "Feb 2026 – now"
context: "EPFL Student AI Team"
team: "Student team"
myPart: "Machine Learning Engineer"
oneLiner: "Byte is a quadruped built to guide visually impaired people. I built its ROS 2 pipeline and C++ CAN bus interface, and I’m building its Isaac Lab RL pipeline."
metric: "ROS 2 · CAN BUS · ISAAC LAB"
tags: ["Isaac Lab", "Reinforcement learning", "ROS 2", "C++ CAN bus", "NVIDIA Jetson"]
accent: "#1F9E8F" # teal
accentInk: "#0D6A60"
cvMatch: true
links:
  website: "https://bark-documentation.readthedocs.io/en/latest/"
  websiteLabel: "Project docs"

poster: "../../assets/me/guide-dog.jpg"
posterAlt: "Byte, the EPFL Student AI Team’s guide-dog quadruped prototype, on its test stand"
focus: "50% 50%"
soon: ["Walking video", "Isaac Lab training clip", "Build photos"]

lead: "What does it take to build a robot dog that *people can trust to guide them*?"
tldr:
  problem: "Design and build Byte, a custom quadruped that will act as a guide dog for visually impaired people."
  built: "Machine Learning Engineer: a real-time ROS 2 pipeline and a custom C++ CAN bus interface on NVIDIA Jetson, and an Isaac Lab simulation pipeline to train RL policies."
  result: "Reliable motor control and state synchronization on the robot; the Isaac Lab training pipeline for varied terrain is in progress."
  stack: "ROS 2, C++, CAN bus, NVIDIA Jetson, NVIDIA Isaac Lab"
---

## The *project*

The EPFL Student AI Team is designing and building Byte from the ground up: a custom quadruped meant to act as a guide dog for visually impaired people. The project documentation is public (Project docs, above).

## My *part*

1. **ROS 2 and CAN bus.** A real-time ROS 2 pipeline and a custom C++ CAN bus interface on NVIDIA Jetson hardware, for reliable motor control and state synchronization.
2. **Isaac Lab.** A simulation pipeline in NVIDIA Isaac Lab to train reinforcement-learning policies for varied-terrain navigation (in progress).
