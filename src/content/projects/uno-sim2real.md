---
# Featured project 4 · copy mirrored in docs/CONTENT.md (keep both in sync).
# Sources: CV "Image Processing for Uno Cards" (claims, used as written: 12M params,
# detect and count, 75% on a Kaggle dataset) + code via private/research/repo_Uno-cards.json.
# Private repo with a course-competition solution: never link it, never show the course photos.
title: "Reading an Uno table from a single photo"
shortTitle: "Uno sim-to-real"
shortWord: "UNO"
order: 4
year: "2026"
context: "EPFL · In-class Kaggle competition"
team: "Team project" # size not confirmed yet: see docs/QUESTIONS.md
oneLiner: "A lightweight ResNet-18 + CBAM network detects and counts overlapping Uno cards, trained on synthetic data first and real photos second."
metric: "75% ACCURACY · 12M PARAMS"
tags: ["PyTorch", "Synthetic data", "Sim-to-real", "Attention"]
accent: "#D23445" # crimson, Uno red
accentInk: "#A61F30"
cvMatch: true
privateRepo: true

poster: "../../assets/projects/uno-sim2real/poster.png"
posterAlt: "Diagram: a table photo split into four rotated hand zones and a center pile, feeding synthetic pre-training, real fine-tuning and a table-state output"
# Tile-only crop: the 5-zone table split, without the small labels (illegible at tile size).
tilePoster: "../../assets/projects/uno-sim2real/poster-tile.png"
focus: "50% 50%"
mediaNeeded: "Prediction overlay on a table photo"
figures:
  - src: "../../assets/projects/uno-sim2real/fig-pipeline.svg"
    alt: "Synthetic-to-real counting pipeline: five-zone table split, synthetic pre-training of a ResNet-18 with CBAM, real-data fine-tuning, and the table-state output"
    caption: "The pipeline: split the table into five zones, pre-train on synthetic composites, fine-tune on real crops, and read out the table state."
    credit: "Diagram redrawn for this site"

lead: "With few labeled photos and no pretrained weights allowed, the network first learned on *tables that never existed*."
tldr:
  problem: "From one overhead photo of a game, read the center card, whose turn it is and every player’s hand, even when cards overlap, rotate and hide each other."
  built: "A lightweight (12M parameter) customized ResNet-18 with CBAM attention, pre-trained through a synthetic data pipeline, then moved to real camera photos with multi-stage fine-tuning."
  result: "75% accuracy on a Kaggle dataset."
  stack: "Python, PyTorch, Torchvision, Albumentations, OpenCV"
---

## The *approach*

1. **Split the table.** Each photo is cut into five zones, four hands and the center pile, and every hand is rotated upright.
2. **Detect by counting.** A 56 × 6 output head predicts how many copies (0–5) of each card and turn-token class a zone holds, so real labels never need bounding boxes.
3. **Model.** A customized ResNet-18 trained from scratch, with CBAM channel and spatial attention on its last feature map, inside a 12M-parameter budget.
4. **Synthetic data.** Card cut-outs composited onto real table textures with aggressive augmentations (±180° rotation, perspective distortion, lighting jitter, noise and occlusion holes) so the network can’t memorize textures. Rare turn tokens are oversampled 3×, and nothing is flipped, because mirrored digits don’t exist.
5. **Multi-stage fine-tuning.** Pre-train on synthetic composites, then fine-tune on real table crops at a 10× lower learning rate with early stopping.

## What it *achieved*

- **75% accuracy.** Measured on a Kaggle dataset of real table photos.
- **Lightweight: 12M parameters.** A ResNet-18 trunk with hand-written CBAM attention, trained without pretrained weights.
- **200 synthetic composites per card class.** Each has random rotation, perspective, lighting, noise and occlusion, to bridge the sim-to-real gap.
- **Two learning rates, two worlds:** 1e-3 on synthetic data, then 1e-4 on real photos, starting from the synthetic weights.

## *Notes*

This was a course competition. The table photos and labels belong to the course, so they are not shown here, and the code stays private.
