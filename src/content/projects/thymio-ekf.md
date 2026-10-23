---
# Selected work, tile 4 · copy mirrored in docs/CONTENT.md (keep both in sync).
# Not on the CV (it backs the CV skills "Extended Kalman Filter" and "OpenCV").
# Sources: the team's report notebook and code via private/research/repo_Autonomous-Thymio.json.
# Alexandros's part (state estimation) is stated in the team report. Vision and planning are teammates' work.
title: "Autonomous Thymio: localization that survives a blindfold"
shortTitle: "Thymio EKF"
shortWord: "THYMIO"
order: 4
year: "2025"
context: "EPFL · Basics of Mobile Robotics course"
team: "Team of 4"
myPart: "State estimation (EKF)"
oneLiner: "An Extended Kalman Filter fuses a camera with wheel odometry, so a real robot stays on course when its camera is covered or it gets picked up and moved."
metric: "BLACKOUT ✓ · KIDNAP ✓"
tags: ["EKF", "Sensor fusion", "OpenCV", "Real robot"]
accent: "#2C9658" # arena green, from the arena mat
accentInk: "#1E6B3E"
cvMatch: false
links:
  code: "https://github.com/AlexandrosDellios/Autonomous-Thymio"

poster: "../../assets/projects/thymio-ekf/poster.jpg"
posterAlt: "Overhead view of the Thymio robot with an ArUco marker on a green arena with dark obstacles and a pink goal"
focus: "50% 50%"
video:
  mp4: "/media/thymio-ekf/loop.mp4"
  webm: "/media/thymio-ekf/loop.webm"
  poster: "/media/thymio-ekf/loop-poster.jpg"
figures:
  - src: "../../assets/projects/thymio-ekf/fig-visibility-graph-planned-path.png"
    alt: "Visibility graph around the inflated obstacles, with the shortest path and the robot's heading"
    caption: "Global planning: a visibility graph around the inflated obstacles and the shortest path to the goal. The EKF pose is the start of every plan."
    credit: "Team work · path-planning module by a teammate"
extraVideos:
  - mp4: "/media/thymio-ekf/kidnapping.mp4"
    webm: "/media/thymio-ekf/kidnapping.webm"
    poster: "/media/thymio-ekf/kidnapping-poster.jpg"
    caption: "Kidnapping: the robot is picked up and moved, the jump is detected, and a new path is planned. Panels: internal map, raw camera, planned path. Team demo."
  - mp4: "/media/thymio-ekf/camera-occlusion.mp4"
    webm: "/media/thymio-ekf/camera-occlusion.webm"
    poster: "/media/thymio-ekf/camera-occlusion-poster.jpg"
    caption: "Camera covered: the robot keeps estimating its position from wheel odometry alone. Team demo."

lead: "A small robot has to reach its goal with a camera that can be blocked and wheels that *drift*."
tldr:
  problem: "Reach a goal on a 100 × 70 cm arena and avoid mapped and surprise obstacles, using one overhead camera that can be covered and odometry that drifts."
  built: "A camera + odometry navigation stack for a real Thymio. My module: the Extended Kalman Filter over [x, y, θ] and its noise identification."
  result: "Validated live in three scenarios: a nominal run with a surprise obstacle, kidnapping, and camera blackout."
  stack: "Python, FilterPy, OpenCV (ArUco), NumPy/SciPy, NetworkX, tdmclient"
---

## The *approach*

1. **Vision (team).** OpenCV thresholding finds the map, obstacles and goal; an ArUco marker on the robot gives its pose from the overhead camera.
2. **Planning (team).** A visibility graph over the inflated obstacle corners and Dijkstra give the global path; proximity sensors handle surprise obstacles.
3. **Estimation (mine).** An EKF over [x, y, θ] with a nonlinear differential-drive motion model and wheel speeds as input, corrected by the camera pose whenever it is available.
4. **Noise from data (mine).** Camera covariance from repeated marker readings against ruler-measured positions; wheel noise from commanded against measured speed at 10 setpoints.
5. **Fallbacks.** Without the camera, the filter runs on odometry alone. A jump of more than 20 cm between camera fixes is treated as a kidnapping and triggers a new plan.

## What it *achieved*

- **Camera + odometry fusion.** The filter runs inside the robot’s live control loop on a 100 × 70 cm arena.
- **Wheel speed calibrated from 10 setpoints:** v [cm/s] = 0.0268 u + 0.4754, in Thymio motor units u.
- **Process noise from input uncertainty.** Q = B Σᵤ Bᵀ + Q_model. I kept the nonlinear motion model after simulation showed a larger heading error with the linearized one.
- **3 live scenarios passed:** surprise obstacle, kidnapping (> 20 cm jump detected and replanned), and camera blackout.

## *Notes*

Team of 4 with one module each: global navigation and motion control, local navigation, vision, and state estimation (mine). The planning figure and the demo recordings show the whole team’s stack.
