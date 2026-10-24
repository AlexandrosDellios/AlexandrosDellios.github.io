---
# Selected work, tile 3 · copy mirrored in docs/CONTENT.md (keep both in sync).
# Sources: the CV "Image Processing for Uno Cards" (claims, used as written: 12M params,
# 75% on the Kaggle leaderboard), the team's course report (local only, never published),
# the restructured code (public repo), and runs of the submitted model for this site (2026-10-24).
# The course photos may be shown (Alexandros, 2026-10-24).
title: "Reading an Uno table from a single photo"
shortTitle: "Uno sim-to-real"
shortWord: "UNO"
order: 3
year: "2026"
context: "EPFL · Image Analysis and Pattern Recognition course"
team: "Team of 3"
myPart: "Most of the pipeline: synthetic data, model, training, inference"
oneLiner: "A lightweight ResNet-18 + CBAM network detects and counts overlapping Uno cards, trained on synthetic data first and real photos second."
metric: "75% ACCURACY · 12M PARAMS"
tags: ["PyTorch", "Synthetic data", "Sim-to-real", "Attention"]
accent: "#D23445" # crimson, Uno red
accentInk: "#A61F30"
cvMatch: true
links:
  code: "https://github.com/AlexandrosDellios/ImageProject" # public since 2026-10-24

# The last frame of the hero animation: the submitted model's reading of an unseen test photo.
poster: "../../assets/projects/uno-sim2real/poster.jpg"
posterAlt: "Overhead photo of an Uno table on a leaf-print tablecloth, with the five reading zones drawn and the model’s predicted cards labelled in each"
focus: "50% 50%"
video:
  mp4: "/media/uno-sim2real/loop.mp4"
  webm: "/media/uno-sim2real/loop.webm"
  poster: "/media/uno-sim2real/loop-poster.jpg"
extraVideos:
  - mp4: "/media/uno-sim2real/synthesis.mp4"
    webm: "/media/uno-sim2real/synthesis.webm"
    poster: "/media/uno-sim2real/synthesis-poster.jpg"
    caption: "How one synthetic training image is built: a patch of a real tablecloth, two hand-cut cards colour-jittered, rotated, tilted and blurred, pasted so they overlap, then brightness, letterbox bars and sensor noise. Pre-training used 10,000 of these."
    autoplay: true
    wide: true
figures:
  - src: "../../assets/projects/uno-sim2real/fig-zones.jpg"
    alt: "A test photo of a white table with the five reading zones drawn, overlapping at the corners, and below it the five padded square crops the network receives"
    caption: "From photo to network input: the table is cut into five zones, each hand is turned to face its player, and every crop is padded to a square so round symbols keep their shape. Cards in the red corners are seen by two zones."
    credit: "Rendered for this site with the project’s code"
    photo: true
  - src: "../../assets/projects/uno-sim2real/fig-pipeline.svg"
    alt: "Synthetic-to-real counting pipeline: five-zone table split, synthetic pre-training of a ResNet-18 with CBAM, real-data fine-tuning, and the table-state output"
    caption: "The pipeline: split the table into five zones, pre-train on synthetic composites, fine-tune on real crops, and read out the table state."
    credit: "Diagram redrawn for this site"
  - src: "../../assets/projects/uno-sim2real/fig-f1.png"
    alt: "Bar chart of F1 per card class on 81 held-out real hand crops, sorted from 1 down to 0, with a dashed mean line at 0.737; blue 2, blue 6 and red 7 at zero"
    caption: "Per-class F1 on 81 held-out real hand crops, counting every copy: a mean of 0.737 over the 48 classes present. Blue 2, blue 6 and red 7 are never found."
    credit: "Rendered for this site with the project’s code"
    photo: true
  - src: "../../assets/projects/uno-sim2real/fig-failures.jpg"
    alt: "Two fanned hands from test photos: a blue 7 half hidden between a yellow reverse and a green 2 is missed, and two cards fanned behind a red reverse are missed"
    caption: "Where it still fails: tight fans. A card mostly hidden under others is the typical miss; on the held-out crops, the model misses cards more than twice as often as it invents them."
    credit: "Rendered for this site with the project’s code"
    photo: true
  - src: "../../assets/projects/uno-sim2real/fig-gradcam.jpg"
    alt: "Three hand crops and their Grad-CAM heat maps: heat on a green skip under a +2, on a blue 8 but not the green 8 beside it, and on the cards rather than a turn token cut off at the edge"
    caption: "Where the network looks (Grad-CAM on its last stage): on a green skip hidden under a +2, and on the blue 8, not the green one beside it. For a turn token cut off at the crop’s edge, it looks at the cards instead, yet still counts it."
    credit: "Rendered for this site with the project’s code"
    photo: true

lead: "With only 81 labeled photos and no pretrained weights, the network first learned on *tables that never existed*."
tldr:
  problem: "From one overhead photo of a game, read every player’s hand, the center card and whose turn it is, even when cards overlap, rotate and hide each other."
  built: "A lightweight (12M parameter) customized ResNet-18 with CBAM attention that counts the cards in five zones of the table, pre-trained on 10,000 synthetic two-card images, then moved to real camera photos with multi-stage fine-tuning."
  result: "75% accuracy on the course’s Kaggle leaderboard. Spread-out hands are read well; cards buried deep in a fan are still missed."
  stack: "Python, PyTorch, Torchvision, NumPy, Pillow, Matplotlib"
---

## The *approach*

1. **Five zones.** Each photo is cut on a fixed grid into the four hands and the center pile. Each hand is turned to face its player, and every crop is padded to a square before it is resized to 336 px, so round symbols are never squashed into ovals.
2. **Count, don’t detect.** The real photos only list the cards in each hand, with no boxes. So for each of 56 classes (54 card faces and the two turn tokens), the network predicts how many copies, 0 to 5, a zone holds.
3. **Model.** A ResNet-18 trained from scratch, with CBAM channel and spatial attention on its last feature map and a counting head. Focal loss keeps the many easy “zero copies” targets from swamping the few cards present.
4. **Synthetic pre-training.** 10,000 images of two overlapping cards, built from 56 hand-cut cards on patches of the two real table surfaces, with colour jitter, rotation, perspective, blur, letterbox bars and sensor noise. Pairs rather than single cards, so the network learns to recognize a card by its corners when another one covers it.
5. **Multi-stage fine-tuning.** The 81 labeled photos give 405 zone crops, and each training crop gets a turned, rescaled twin. First only the counting head learns from them, then the whole network, each stage with early stopping.

## What it *achieved*

- **75% accuracy** on the course’s Kaggle leaderboard.
- **Lightweight: 12M parameters**, trained without pretrained weights. It reads a table in about a quarter of a second on a laptop.
- **0.737 mean F1** on 81 held-out real hand crops, over the 48 card classes present, counting every copy.
- **It misses rather than invents.** Missed cards outnumber invented ones more than two to one, and a card buried in a fan is the typical miss.

## *Notes*

The animation at the top is the submitted model reading a test photo it never saw: it gets 5 of the 6 cards and the turn right, and misses the red 8 in the bottom hand. The photos come from the course’s dataset; since the test labels are hidden, the cards were checked by eye.

A team of 3, as an in-class Kaggle competition; I built most of the pipeline: the synthetic data, the model, the training and the inference. Afterwards I restructured the code into a documented package that reproduces the submission exactly; the repository has the trained weights, every step of the pipeline and the scripts behind the figures on this page.
