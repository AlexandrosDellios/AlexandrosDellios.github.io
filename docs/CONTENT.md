# CONTENT.md: every word on the site, and where it comes from

> **What this is.** A readable mirror of all site copy, so Alexandros (or a future session) can review and edit wording without opening code. The copy itself lives in two places, and those files are what the site renders:
> - `src/data/site.ts`: identity, hero, Now cards, statements, Experience, Education, Toolbox, footer line.
> - `src/content/projects/<slug>.md`: one file per detail page (schema: `src/content.config.ts`). `kind: project` files are the Selected-work tiles (`section: featured`) and the More-projects rows (`section: more`), with pages at `/work/<slug>/`; `kind: role` files are the BioRob, AI Team and Mediacom pages at `/experience/<slug>/` (§9).
>
> **Keep them in sync.** When you change copy in a source file, change it here too (and the other way round).
>
> Last full pass: 2026-10-23 (role pages, fly page, home restructure). Open questions for Alexandros: [docs/QUESTIONS.md](QUESTIONS.md) (local only, gitignored).

## 0. Rules the copy follows

1. **The CV is the source of truth.** Wherever the CV makes a claim (numbers included), the site uses the CV wording as written. Alexandros confirmed every CV claim is backed by his reports (docs/DECISIONS.md). Repo and report details are added only where they don't contradict the CV.
2. **No people's names.** Teammates, professors and supervisors are never named: "Team of 3", "a teammate". Exceptions, each approved by Alexandros: Marco Odermatt (Mediacom line and award page); on the award page only, the course teacher (Tomas Kral), the CMi makers (Pol Torres Vila, Chenxiang Zhang) and the names and faces visible in its photos (DECISIONS 2026-10-24).
3. **No links to private repos, none to teammate-owned repos unless Alexandros approves, and none to repos holding report PDFs or student ID numbers** (history included). Linked today: Legged-Robot (quadruped), MPC-Rocket (rocket), Autonomous-Thymio, ImageProject (Uno) and the team's perching-RL (glider, approved 2026-10-25). The report PDFs were purged from the first two on 2026-10-20. Other public links: the EPFL Student AI Team's project documentation (bark-documentation.readthedocs.io, given by Alexandros) and, in the footer, the design credit to cydstumpel.nl.
4. **BioRob stays at CV level.** Only the CV's wording; no methods, models, equipment, partners or publication plans.
5. **No report PDFs.** Figures are shown individually with captions; the reports themselves are not linked.
6. **Voice.** First person, "we" for team work. Concise and concrete, no hype words. Serif titles and leads mark exactly **one** italic phrase with `*asterisks*`.
7. **"My part"** is stated only where it is documented, in the page text (since 2026-10-25 the page header no longer shows it): Thymio (TL;DR, state estimation), the fly-navigation project (Achieved list), the glider (Approach step 3, the SAC agent) and Uno (Notes, most of the pipeline). The `myPart` field stays in each file. Everywhere else it waits for Alexandros (Q-A1). Role pages show the CV role title instead.

**Source tags used below**
- **[CV]**: wording or number from the CV.
- **[Report]**: from the team's course report or the project code. These notes live in local research files that are not committed.
- **[Edit]**: editorial framing written for the site (leads, statements, captions). No new facts.

---

## 1. Identity and hero

| Field | Copy | Source |
|---|---|---|
| Name (giant strip, `<h1>`) | Alexandros Dellios | [CV] |
| Eyebrow | Robotics M.Sc. · EPFL · Lausanne | [CV] |
| Availability | Available summer 2027 · ~6 months | decision, 2026-10-20 |
| Location | Lausanne, Switzerland | [CV] |
| Email | alexandrosdellios@icloud.com | [CV] |
| Links | CV PDF `/CV-Alexandros-Dellios.pdf` · github.com/AlexandrosDellios · linkedin.com/in/alexandros-dellios | [CV] |
| Headline (`<title>`, OG) | Teaching robots to make sense of the real world. | [Edit] echoes the CV research goal |
| Meta description (158 chars) | Alexandros Dellios, Robotics M.Sc. student at EPFL: robot learning and manipulation. Projects in RL locomotion, MPC, sensor fusion and sim-to-real perception. | [Edit] |
| Rotating roles (visual only; first word italic) | *Robot* Learning · *Egocentric* Manipulation · *Legged* Locomotion · *Model Predictive* Control · *Sim-to-Real* Perception | [Edit] |
| Static roles line (accessible version) | Robot learning · Manipulation · Legged locomotion · MPC · Perception (each " ·" glued to the word before it with a no-break space) | [Edit] |

**Bio** (62 words; the second sentence is the CV summary, verbatim):

> I’m a Master’s student in Robotics at EPFL, focused on robot learning and manipulation. My research goal is to help robots make sense of unstructured, real-world information so they can better assist people in everyday tasks. Right now I research egocentric robot manipulation at BioRob, and I build an Isaac Lab training pipeline for a guide-dog quadruped with the EPFL Student AI Team.

Sources: sentences 1–2 [CV summary]; sentence 3 [CV experience, condensed].

Header, CTA and sticker labels (Work, Experience, Toolbox, Contact, CV, Download CV, Copy email, GitHub, LinkedIn) are written in the layout components, not in the content files.

---

## 2. Now (two cards, each linking to its role page)

Each card is one link (its title, stretched over the card) to its role page: the research card → `/experience/biorob/`, the AI Team card → `/experience/ai-team/` (§9). A mono "Read more →" cue closes the text.

### 2.1 Research card (dark)

| Field | Copy |
|---|---|
| Kicker | NOW · RESEARCH · JUL 2026 – |
| Title | Robots that learn from *a human point of view* |
| Role line | Graduate Research Assistant · BioRob Lab, EPFL |
| Tags | Robot learning · Egocentric data · Manipulation · Embodiment gap |
| Footnote | Research in progress. Happy to talk about it in person. |
| Media | Decorative illustration + chip `COMING SOON · Lab photo` (desktop/tablet only) |
| Link | the whole card → `/experience/biorob/` |

> At EPFL’s Biorobotics Laboratory (BioRob Lab), I research egocentric, data-driven robot manipulation, focusing on bridging the embodiment gap between human demonstrations and robotic execution.

Phones (`bodyShort`, < 600px):

> At EPFL’s Biorobotics Laboratory (BioRob Lab), I research egocentric, data-driven robot manipulation: bridging the embodiment gap between human demonstrations and robotic execution.

Source: [CV] BioRob entry, bullet 1 only, turned into first person. The title paraphrases "egocentric" [Edit]. The CV's second bullet (the method) stays off the site by decision (DECISIONS 2026-10-21).

### 2.2 EPFL Student AI Team card (accent)

| Field | Copy |
|---|---|
| Kicker | NOW · EPFL STUDENT AI TEAM · FEB 2026 – |
| Title | A guide-dog quadruped, *built from scratch* |
| Role line | Machine Learning Engineer · EPFL Student AI Team |
| Tags | Isaac Lab · Reinforcement learning · ROS 2 · C++ CAN bus · NVIDIA Jetson |
| Media | `src/assets/me/guide-dog-cutout.png` (key `guide-dog`), alt: "The EPFL Student AI Team’s guide-dog quadruped prototype on its test stand" |
| Link | the whole card → `/experience/ai-team/` (the team's project docs are linked from that page) |

> As a Machine Learning Engineer, I contribute to the ground-up design of a custom quadruped that will act as a guide dog for visually impaired people. I implemented a real-time ROS 2 pipeline and a custom C++ CAN bus interface on NVIDIA Jetson hardware for reliable motor control and state synchronization, and I’m building a simulation pipeline in NVIDIA Isaac Lab to train reinforcement-learning policies for varied terrain.

Phones (`bodyShort`, < 600px):

> I contribute to the ground-up design of a custom quadruped that will act as a guide dog for visually impaired people. I built its real-time ROS 2 pipeline and C++ CAN bus interface on NVIDIA Jetson, and I’m building an Isaac Lab pipeline to train its RL policies.

Source: [CV] AI Team entry, first person.

---

### Home section headings and sticker copy

Written in the home components (src/components/home/), not in site.ts. Each serif heading has exactly one italic phrase.

| Section | Heading | Mono aside (hidden on phones) |
|---|---|---|
| 01 Now | What I’m doing *now* | Research & prototyping |
| 02 Selected work | Selected *work* | hover to play (mouse users only) |
| 03 More projects | More *projects* | none |
| 04 Experience | Experience & *education* | none |
| 05 Toolbox | The *toolbox* | none |

The header's Work link has no project count.

Hero stickers (decorative, `aria-hidden`; the same facts are in the visible text):
- ink tag: `EPFL ✦ ROBOTICS`;
- ring: `ROBOT LEARNING · MANIPULATION ·` around a small quadruped;
- lime seal: `✦ OPEN TO INTERNSHIPS ✦ / AVAILABLE / SUMMER 2027 / ~6 MONTHS`. This text is **hard-coded** in `Sticker.astro`: update it together with `site.availability` when the dates change.

## 3. Selected work

Four tiles plus two serif statement cells (3 × 2 grid on desktop: tile, tile, S1 / tile, S2, tile). The order was set by Alexandros (2026-10-23); it is the `order` field of the files with `section: featured`:

| # | Tile | Metric chip |
|---|---|---|
| 1 | Quadruped locomotion with CPGs + deep RL | `29% INCLINE · ≈16°` |
| 2 | Glider perching with wing co-design | `29.7% FASTER CONVERGENCE` |
| 3 | Reading an Uno table from a single photo | `75% ACCURACY · 12M PARAMS` |
| 4 | Autonomous Thymio: localization that survives a blindfold | `BLACKOUT ✓ · KIDNAP ✓` |

Every tile always shows: title, one-liner, metric chip, tags, and `year · context · team`. The full tile copy is in §8.

### Statement cells (underlined phrases link to project pages)

- **S1:** "I teach [legged robots](/work/quadruped-cpg-rl/) to walk with reinforcement learning, write [controllers that land rockets](/work/rocket-mpc/), and train networks to [read a cluttered table](/work/uno-sim2real/)." Pill: **GitHub ↗**
- **S2:** "I like controllers that hold up when things go wrong: [sensory feedback](/work/polymander/) that keeps a robot swimming through neural damage, a glider that [lands precisely from an off-course start](/work/glider-codesign/), and a robot that keeps its bearings [when its camera goes dark](/work/thymio-ekf/)." Pill: **Download CV**

Source: [Edit], each phrase backed by its project page (S2 glider phrase: [CV] varying starting speeds, and the randomized starts on the glider page).

---

## 4. More projects (one linked row per project)

Every project that is not a Selected-work tile (`section: more`) gets a row that links to its page: year | title →, one-liner and tags | course and team. Desktop rows show the poster as a hover preview card. Order (the `order` field):

| # | Row | Page |
|---|---|---|
| 1 | Polymander: a salamander robot that swims and walks | `/work/polymander/` (§8.2) |
| 2 | Landing a 6-DOF rocket with robust & nonlinear MPC | `/work/rocket-mpc/` (§8.3) |
| 3 | Fly navigation in NeuroMechFly | `/work/fly-navigation/` (§8.7) |

The rows show each project's `title`, `oneLiner`, `tags`, `year`, `context` (without "EPFL ·") and `team`.
Left out on purpose: the B.Sc. C++ multi-robot cleanup simulator (removed 2026-10-23: an old, simple project), graded homework, weekly course exercises, a forked detection framework, and an off-topic NLP course project.

---

## 5. Experience and education

### Experience (CV wording)

| When | Role · Org | Line | Page | Hover preview (desktop) |
|---|---|---|---|---|
| Jul 2026 – now | Graduate Research Assistant · BioRob Lab, EPFL | Researching egocentric data-driven robot manipulation, focusing on bridging the embodiment gap between human demonstrations and robotic execution. | `/experience/biorob/` | drawn placeholder (robot arm), "Coming soon · Lab photo" |
| Feb 2026 – now | Machine Learning Engineer · EPFL Student AI Team | Contributing to the ground-up design and build of a custom quadruped meant to act as a guide dog for the visually impaired. Implemented a real-time ROS 2 pipeline and custom C++ CAN bus interface on NVIDIA Jetson hardware, achieving reliable motor control and state synchronization; building an NVIDIA Isaac Lab simulation pipeline to train RL policies for varied-terrain navigation. | `/experience/ai-team/` | the approved guide-dog photo, "Byte, the guide-dog quadruped" |
| Feb 2025 – May 2026 | Lead Design & Fabrication Engineer · Mediacom EPFL | Won a competitive design pitch for the official EPFL Doctor Honoris Causa Award out of 12 proposals and took full ownership from concept to physical fabrication, partnering with PhD researchers and the Mediacom team to meet the award’s strict design standards. The award was presented to Marco Odermatt and others. | `/experience/mediacom/` | the finished Odermatt trophy (`image: 'award'`, the page poster), "Marco Odermatt’s trophy" |

Source: [CV, updated 2026-10-21], lightly condensed for one table row. The Mediacom role is no longer on the CV but stays on the site by decision (DECISIONS 2026-10-21); its dates run to the May 2026 ceremony (DECISIONS 2026-10-24) (the CV's "full ownership", "strict design standards", "contributed to" and outcome clauses are kept).

Each row's role title links to its page (§9) and the link covers the whole row. Rows with an `image` show that photo as the hover preview; rows with `mediaNeeded` + `sketch` show the drawn placeholder (src/assets/sketches/).

### Education

| When | Degree · School | Line |
|---|---|---|
| 2025 – 2028 | M.Sc. Robotics · EPFL | Master of Science in Robotics-Engineering, expected 2028. Courses include Legged Robots, Model Predictive Control, Basics of Mobile Robotics, Computational Motor Control, Reinforcement Learning and Deep Learning. |
| 2022 – 2025 | B.Sc. Micro-Engineering · EPFL | Bachelor of Science in Micro-Engineering. |

Sources: degrees and dates [CV]; the course list comes from the projects on this site and the course repos [Report]. The M.Sc. start year (2025) follows from the B.Sc. end date.

---

## 6. Toolbox (CV technical skills, grouped; "seen in" links to evidence)

| Group | Items | Seen in |
|---|---|---|
| Learning & vision | Reinforcement learning (PPO, SAC) · Domain randomization · Deep learning (data augmentation, debiasing) · PyTorch · JAX · TensorFlow · DeepSpeed · OpenCV | Quadruped · Glider · Uno |
| Control & estimation | Model predictive control (linear, tube, nonlinear) · Extended Kalman filter · Central pattern generators · Hardware–software co-design · CasADi | Rocket · Thymio · Polymander · Glider |
| Simulation & ROS | Isaac Lab · Isaac Sim · MuJoCo · PyBullet · ROS 2 Jazzy | AI Team · Quadruped · Polymander |
| Hardware & embedded | NVIDIA Jetson (Orin Nano) · CAN bus · STM32 · ESP32 · RTOS | AI Team |
| CAD & fabrication | Fusion 360 · CATIA · KiCad · 3D printing · Machining (lathe, milling) | Mediacom award |
| Code & tools | Python · C++ · C · CUDA · Assembly · Linux · Git · Docker · HPC / GPU clusters | — |

Sources: every item is on the CV, except "Central pattern generators" and the MPC variants in brackets, which come from the Quadruped, Polymander and Rocket projects [Report]. Spoken languages are not listed yet (Q-B7).

---

## 7. Footer

| Field | Copy |
|---|---|
| Big serif line | Let’s build robots that *help people*. |
| Status · location | Available summer 2027 · ~6 months · Lausanne, Switzerland |
| Contact | email with copy button · Download CV · GitHub · LinkedIn |
| Ticker | ALEXANDROS DELLIOS ✦ (looping) |
| Bottom line | © 2026 Alexandros Dellios · Built with Astro · Inspired by [cydstumpel.nl](https://cydstumpel.nl) (the portfolio this design is modelled on) |

---

## 8. Project pages

Each page shows, in order: title strip (outlined word), meta row (year and the code link only: context, team and "my part" were dropped on 2026-10-25 as too much text; the course and team stay on the home tile), TL;DR (Problem / What we built / Result / Stack), lead, hero media, *The approach* (≤ 5 steps), *What it achieved* (3–5 bullets with numbers), footage and figures with captions, *Notes*, then prev/next. Section headings carry one italic word like the home headings: `## The *approach*`, `## What it *achieved*`, `## *Notes*`.

### 8.1 Quadruped locomotion with CPGs + deep RL

`src/content/projects/quadruped-cpg-rl.md` · page `/work/quadruped-cpg-rl/` · Selected work, tile 1

| Field | Copy |
|---|---|
| Tile title | Quadruped locomotion with CPGs + deep RL |
| Short title | Quadruped CPG + RL |
| Outlined word | A1 QUADRUPED |
| Meta | 2025 · EPFL · Legged Robots course · Team of 3 |
| One-liner | A PPO policy steers bio-inspired oscillators so a simulated Unitree A1 can trot, run and climb 29% slopes. |
| Metric chip | `29% INCLINE · ≈16°` |
| Tags | `Deep RL` · `PPO` · `PyBullet` · `CPG` |
| Accent | `#E2A814` fill / `#7A5800` text |
| Code link | github.com/AlexandrosDellios/Legged-Robot |
| On the CV | yes |
| Poster alt | Simulated Unitree A1 quadruped climbing a yellow ramp in PyBullet |

**Lead:** Can a rhythm generator borrowed from biology make deep-RL gaits *smoother and more robust*?

**TL;DR**
- **Problem:** Pure deep RL on legged robots tends to reward-hack into jerky gaits that don’t carry over to new terrain such as steep slopes.
- **What we built:** Coupled Hopf oscillators (central pattern generators) set the rhythm, and a PPO policy learns to modulate each leg’s frequency and amplitude, trained with a slope curriculum and randomized friction and sensor noise.
- **Result:** Stable locomotion on steep inclines (29% slopes) and at high speeds, with physical footstep accuracy improved by nearly 9%.
- **Stack:** Python, PyBullet, Stable-Baselines3 (PPO), Gymnasium, NumPy

#### The *approach*

1. **Rhythm.** Four coupled Hopf oscillators produce trot, walk, pace and bound gaits. Their states map to foot trajectories, then to joint torques through inverse kinematics and PD control.
2. **Interface.** The policy observes foot contacts, joint states, base orientation and velocity, plus the oscillator states. We tested multiple action spaces: 8-D CPG modulation (frequency and amplitude per leg) against 12-D Cartesian foot targets.
3. **Algorithm.** PPO from Stable-Baselines3, chosen over SAC after a head-to-head test, then tuned with hyperparameter and network-size ablations.
4. **Rewards.** Velocity tracking at 0.5, 1.0 and 1.5 m/s. On slopes: forward progress minus lateral drift, torque, roll and yaw penalties.
5. **Curriculum.** 10% incline, then random 15–25%, then 25–35%, with randomized ground friction (μ 0.5–1.0) and observation noise.

#### What it *achieved*

- **29% slopes (≈16°).** The adaptive curriculum raised the steepest slope the robot could traverse from 24% with fixed-slope training to 29%.
- **Nearly 9% better footstep accuracy.** We tested multiple action spaces to find the most efficient setup (foot RMS error 2.96 → 2.69 cm, Fig. 04).
- **About 2× the reward.** With the oscillator states in the observation the policy reached 74.4, against 35.5 without them.
- **Natural gaits.** The Cartesian action space scored a higher reward but reward-hacked into unnatural gaits; the CPG policy kept an animal-like trot.
- **High speeds.** A flat-ground trot at about 1.3 m/s (clip below), and cost of transport fell from 1.37 to 0.825 as speed rose.

#### *Notes*

The Unitree A1 simulation environment, motor model and CPG skeleton came from the course framework. As a team we implemented the oscillator network, the foot controllers, the observation, action and reward design, and every experiment on this page.

**Figures** (caption · credit)
- `fig-gait-phases.svg`: The four CPG gaits. Each leg's oscillator runs at a fixed phase offset from the others; the bars show when each foot is in the air. Swing length is illustrative. *(Redrawn for this site from our course report)*
- `fig-obs-space-reward-curves.png`: Observation ablation. With the oscillator states in the observation, the policy reaches a mean reward of 74.4, against 35.5 without them. *(Team figure · course report)*
- `fig-velocity-tracking.png`: Velocity tracking: measured against desired forward speed for the policies trained at 0.5, 1.0 and 1.5 m/s. *(Team figure · course report)*
- `fig-foot-trajectory-cartesian-pd.png`: Footstep accuracy. Front-right foot path against its target curve, with and without Cartesian-space feedback (RMS error 2.96 → 2.69 cm, ≈9% lower). *(Team figure · course report)*

**Videos**
- Tile loop + page hero: `/media/quadruped-cpg-rl/loop.mp4`
- `/media/quadruped-cpg-rl/velocity.mp4`: Flat-ground trot at about 1.3 m/s.

**Sources**
- [CV] "Deep-RL Quadruped Locomotion Controller": 29% slopes, high speeds, multiple action spaces tested, footstep accuracy improved by nearly 9%, PyBullet, Unitree A1.
- [Report] Hopf-oscillator CPGs, PPO chosen over SAC, observation ablation (74.4 vs 35.5), curriculum stages and 24% → 29%, friction range, velocity tracking (±0.1 m/s), cost of transport (1.37 → 0.825), foot RMS error 2.96 → 2.69 cm, the ≈1.3 m/s clip.
- [Edit] "≈16°" is the slope angle of a 29% grade (arctan 0.29 ≈ 16.2°).
- Credits: the A1 environment, motor model and CPG skeleton came from the course framework (Notes section).

### 8.2 Polymander: a salamander robot that swims and walks

`src/content/projects/polymander.md` · page `/work/polymander/` · More projects, row 1 (`section: more`)

| Field | Copy |
|---|---|
| Tile title | Polymander: a salamander robot that swims and walks |
| Short title | Polymander |
| Outlined word | POLYMANDER |
| Meta | 2026 · EPFL · Computational Motor Control course · Team of 3 |
| One-liner | Spinal-cord-style oscillators plus stretch feedback make a simulated amphibious robot swim faster on less energy, then switch to walking on land. |
| Metric chip | `+20% SPEED · −16% CoT` |
| Tags | `CPG` · `Sensory feedback` · `MuJoCo (FARMS)` · `Bio-inspired control` |
| Accent | `#7377C7` fill / `#474BA3` text |
| Code link | none · shows "Code: on request" |
| On the CV | no |
| Poster alt | Top view of the simulated Polymander salamander robot swimming with a traveling body wave |

**Lead:** How much does a little *sensory feedback* help a spinal-cord-like controller, especially when parts of it fail?

**TL;DR**
- **Problem:** Produce efficient, robust swimming and walking from coupled oscillators driven by a single descending drive signal.
- **What we built:** In stages: an open-loop traveling wave, a 16-oscillator double-chain CPG tuned to X-ray recordings of real salamanders, stretch feedback, then contact-driven switching between swimming and walking.
- **Result:** +20% swimming speed and −16% cost of transport with feedback, 61% lower joint error against the animal data, and 2.4× more distance under neural damage.
- **Stack:** Python, NumPy/SciPy, FARMS (MuJoCo), Matplotlib

#### The *approach*

1. **Baseline.** An open-loop traveling wave drives Ekeberg muscle models; a 5 × 5 sweep of amplitude and wave lag maps out what works.
2. **Spinal CPG.** A double chain of 16 amplitude-phase oscillators, swept over drive and phase lag. Steering comes from left/right drive asymmetry.
3. **Match the animal.** We compared joint trajectories with X-ray recordings of swimming salamanders, then retuned the network to match their uneven phase lag along the body.
4. **Feedback and damage.** Proprioceptive stretch feedback with a gain sweep, then a robustness study with 0–20% random disruption of sensors and couplings.
5. **Amphibious switching.** A body and limb CPG where ground contact pulls the drive toward walking (d = 2.5) and its absence toward swimming (d = 4.5).

#### What it *achieved*

- **+20% speed, −16% cost of transport.** Stretch feedback (w_ipsi = 3) raised swimming speed from 0.201 to 0.241 m/s and cut cost of transport by 16% at the same drive.
- **61% closer to the animal.** Tuning to the X-ray data cut mean joint-trajectory error from 0.236 to 0.092 rad.
- **2.4× more travel under damage.** With 20% random disruption, the decoupled, sensory-driven network kept about 2.4 times more forward travel than the combined (coupled) network.
- **Steering.** Asymmetric drive turns the robot, with curvatures of about +16 and −20 m⁻¹.
- **Swim-to-walk and walk-to-swim.** Both transitions happen in an amphibious arena, triggered by ground contact alone.

#### *Notes*

The Polymander robot model, the simulation setup and the salamander X-ray recordings were provided by the course. The code lives in a private team repository.

**Figures** (caption · credit)
- `fig-metrics-vs-feedback-gain.png`: Stretch-feedback gain sweep. As the gain grows, swimming gets faster and cheaper, and the network's rhythm speeds up. *(Team figure · course report)*
- `fig-disruption-4conditions.png`: Robustness to 20% random disruption of sensors and couplings. The combined (coupled) network nearly stops; the decoupled, sensory-driven network keeps swimming at a far lower cost of transport. *(Team figure · course report)*
- `fig-swim2walk-forces.png`: Forces on the body across the drive range: ground reaction dominates at walking drives, and hydrodynamic force takes over past the walk/swim cut-off at d = 3. *(Team figure)*

**Videos**
- Tile loop + page hero: `/media/polymander/loop.mp4`
- `/media/polymander/walk.mp4`: Walking: the limb oscillators take over at low drive.
- `/media/polymander/swim2walk.mp4`: Swim to walk: when the feet touch the ground, the drive drops into the walking range. *(`clickToPlay: true`: starts only from its play button)*
- `/media/polymander/walk2swim.mp4`: Walk to swim: without ground contact, the drive rises into the swimming range. *(`clickToPlay: true`)*

**Sources**
- Not on the CV. All numbers are [Report], from the team's swimming report. The swim/walk transitions have no headline numbers because they come from the code and videos only.
- Credits: the robot model, simulation setup and salamander X-ray data were provided by the course. The code is in a private team repository, so the page shows "Code: on request" (Q-A3). The disruption figure's bars say "Combined" (the coupled network) and "Decoupled"; the copy uses the same words. The CoT highlight gives the report's −16% without the rounded J/m values, which recompute to −15%.

### 8.3 Landing a 6-DOF rocket with robust & nonlinear MPC

`src/content/projects/rocket-mpc.md` · page `/work/rocket-mpc/` · More projects, row 2 (`section: more`)

| Field | Copy |
|---|---|
| Tile title | Landing a 6-DOF rocket with robust & nonlinear MPC |
| Short title | Rocket MPC |
| Outlined word | ROCKET |
| Meta | 2025 · EPFL · Model Predictive Control course · Team of 3 |
| One-liner | A dual-layer PID + MPC flight controller, topped by a custom nonlinear MPC, lands a simulated 6-DOF rocket through orientation errors and wind disturbances. (the file writes `6-\u2060DOF`: a word joiner keeps "6-DOF" on one line) |
| Metric chip | `30° ROLL → LANDED < 4 S` |
| Tags | `MPC` · `Nonlinear MPC` · `Tube MPC` · `CasADi` |
| Accent | `#B8418E` fill / `#8E2C6B` text |
| Code link | github.com/AlexandrosDellios/MPC-Rocket |
| On the CV | yes |
| Poster alt | Simulated rocket at the end of its curved flight path above a green ground grid, in the course's 3D visualizer |
| Placeholder | COMING SOON · Rocket landing screen recording (spec in MEDIA.md §3) |

**Lead:** How do you land precisely when *your model is wrong* and the world pushes back?

**TL;DR**
- **Problem:** Land a simulated 6-DOF rocket (12 states) precisely within actuator and tilt limits, despite model mismatch, unknown mass and disturbances.
- **What we built:** A dual-layer flight control system (PID and MPC) for highly accurate speed and trajectory tracking, an offset-free observer, a robust tube MPC for a safety-first landing, and a custom nonlinear MPC in CasADi.
- **Result:** The nonlinear MPC recovers from a 30° roll and lands on target in under 4 s; the tube MPC keeps the rocket above ground under worst-case disturbance.
- **Stack:** Python, CasADi + IPOPT, CVXPY + PIQP, mpt4py, python-control

#### The *approach*

1. **Decouple.** Linearize around hover and split the rocket into x, y, z and roll subsystems. Each gets an MPC with an LQR terminal cost and a maximal invariant terminal set, which keeps the controller feasible over time.
2. **Dual layer.** An outer PID position loop sends velocity setpoints to the MPCs. Soft constraints keep the problem feasible on the full nonlinear simulator.
3. **Offset-free tracking.** A disturbance-augmented model and a Luenberger observer remove the steady-state error when the rocket is 1.5× heavier than modeled, and while it burns fuel.
4. **Safety-first landing.** A robust tube MPC on altitude, built from a minimal robust invariant set and tightened constraints, guarantees the rocket never goes below the ground for any disturbance within its bounds.
5. **Custom nonlinear MPC.** One controller for the full nonlinear dynamics in CasADi: RK4 discretization, 3.5 s horizon, LQR terminal cost and warm-started IPOPT solves.

#### What it *achieved*

- **30° roll → landed in under 4 s.** The custom nonlinear MPC corrects complex aerodynamic drag and prevents orientation errors during landing, starting 10 m up with a 30° roll.
- **Guaranteed stability under unpredictable wind disturbances.** Even with a constant worst-case disturbance, the tube MPC keeps the rocket above ground and the throttle within limits.
- **Fast linear MPCs.** The per-axis controllers stabilize from 5 m/s in under 7 s and track a 35° roll setpoint in about 3 s.
- **Offset-free at 1.5× mass.** The disturbance observer cancels the steady-state velocity error of a rocket 50% heavier than its model.

#### *Notes*

The rocket model, simulator and 3D visualizer were provided by the course. We closed the project with a comparison of nonlinear MPC and robust linear MPC on safety guarantees, computational cost and axis coupling.

**Figures** (caption · credit)
- `fig-nmpc-closed-loop-landing.png`: Nonlinear MPC, closed loop. From 10 m up with a 30° roll, the rocket reaches its landing target point in under 4 s, with every input inside its limits. *(Team figure · course report)*
- `fig-tube-mpc-mrpi-terminal-sets.png`: Tube MPC on altitude: the minimal robust invariant set (the tube the true state stays in around the plan) and the terminal set. *(Team figure · course report)*
- `fig-tube-mpc-extreme-disturbance.png`: Worst-case disturbance on every step: altitude never drops below the ground and throttle stays within its limits. *(Team figure · course report)*
- `fig-offset-free-disturbance-estimate.png`: Offset-free MPC: the observer's disturbance estimate settles, which removes the tracking offset caused by the heavier-than-modeled rocket. *(Team figure · course report)*

**Sources**
- [CV] "MPC Rocket Landing Controller": dual-layer PID + MPC, accurate speed and trajectory tracking, custom nonlinear MPC that corrects aerodynamic drag and prevents orientation errors during landing, safety-first landing with guaranteed stability under unpredictable wind disturbances, Python/CasADi.
- [Report] 30° roll → on target in under 4 s, horizon and discretization, invariant and tube sets, worst-case disturbance test, 1.5× mass, 5 m/s in under 7 s, 35° roll in about 3 s, the rest of the stack.
- Credits: the rocket model, simulator and 3D visualizer were provided by the course.
- Media: no video yet, so the gallery ends with a slim `Coming soon · Rocket landing screen recording` band.

### 8.4 Reading an Uno table from a single photo

`src/content/projects/uno-sim2real.md` · page `/work/uno-sim2real/` · Selected work, tile 3

| Field | Copy |
|---|---|
| Tile title | Reading an Uno table from a single photo |
| Short title | Uno sim-to-real |
| Outlined word | UNO |
| Meta | 2026 · EPFL · Image Analysis and Pattern Recognition course · Team of 3 · My part: Most of the pipeline: synthetic data, model, training, inference |
| One-liner | A lightweight ResNet-18 + CBAM network detects and counts overlapping Uno cards, trained on synthetic data first and real photos second. (CV wording) |
| Metric chip | `75% ACCURACY · 12M PARAMS` (CV: 75% is the Kaggle leaderboard score, 12M the CV's rounding of 11.4M; both kept by Alexandros) |
| Tags | `PyTorch` · `Synthetic data` · `Sim-to-real` · `Attention` |
| Accent | `#D23445` fill / `#A61F30` text |
| Code link | https://github.com/AlexandrosDellios/ImageProject (public, restructured 2026-10-24) |
| On the CV | yes |
| Hero + tile loop | `/media/uno-sim2real/loop.mp4`: the submitted model reading test photo L1000947 zone by zone |
| Poster alt | Overhead photo of an Uno table on a leaf-print tablecloth, with the five reading zones drawn and the model’s predicted cards labelled in each |

**Lead:** With only 81 labeled photos and no pretrained weights, the network first learned on *tables that never existed*.

**TL;DR**
- **Problem:** From one overhead photo of a game, read every player’s hand, the center card and whose turn it is, even when cards overlap, rotate and hide each other.
- **What we built:** A lightweight (12M parameter) customized ResNet-18 with CBAM attention that counts the cards in five zones of the table, pre-trained on 10,000 synthetic two-card images, then moved to real camera photos with multi-stage fine-tuning.
- **Result:** 75% accuracy on the course’s Kaggle leaderboard. Spread-out hands are read well; cards buried deep in a fan are still missed.
- **Stack:** Python, PyTorch, Torchvision, NumPy, Pillow, Matplotlib

#### The *approach*

1. **Five zones.** Each photo is cut on a fixed grid into the four hands and the center pile. Each hand is turned to face its player, and every crop is padded to a square before it is resized to 336 px, so round symbols are never squashed into ovals.
2. **Count, don’t detect.** The real photos only list the cards in each hand, with no boxes. So for each of 56 classes (54 card faces and the two turn tokens), the network predicts how many copies, 0 to 5, a zone holds.
3. **Model.** A ResNet-18 trained from scratch, with CBAM channel and spatial attention on its last feature map and a counting head. Focal loss keeps the many easy “zero copies” targets from swamping the few cards present.
4. **Synthetic pre-training.** 10,000 images of two overlapping cards, built from 56 hand-cut cards on patches of the two real table surfaces, with colour jitter, rotation, perspective, blur, letterbox bars and sensor noise. Pairs rather than single cards, so the network learns to recognize a card by its corners when another one covers it.
5. **Multi-stage fine-tuning.** The 81 labeled photos give 405 zone crops, and each training crop gets a turned, rescaled twin. First only the counting head learns from them, then the whole network, each stage with early stopping.

#### What it *achieved*

- **75% accuracy** on the course’s Kaggle leaderboard.
- **Lightweight: 12M parameters**, trained without pretrained weights. It reads a table in about a quarter of a second on a laptop.
- **0.737 mean F1** on 81 held-out real hand crops, over the 48 card classes present, counting every copy.
- **It misses rather than invents.** Missed cards outnumber invented ones more than two to one, and a card buried in a fan is the typical miss.

#### *Notes*

The animation at the top is the submitted model reading a test photo it never saw: it gets 5 of the 6 cards and the turn right, and misses the red 8 in the bottom hand. The photos come from the course’s dataset; since the test labels are hidden, the cards were checked by eye.

A team of 3, as an in-class Kaggle competition. Afterwards I restructured the code into a documented package that reproduces the submission exactly; the repository has the trained weights, every step of the pipeline and the scripts behind the figures on this page.

**Gallery** (caption · credit), in order:
- `synthesis.mp4` (clip, full width, plays in view: `autoplay`, `wide`): How one synthetic training image is built: a patch of a real tablecloth, two hand-cut cards colour-jittered, rotated, tilted and blurred, pasted so they overlap, then brightness, letterbox bars and sensor noise. Pre-training used 10,000 of these.
- `fig-zones.jpg` (photo): From photo to network input: the table is cut into five zones, each hand is turned to face its player, and every crop is padded to a square so round symbols keep their shape. Cards in the red corners are seen by two zones. *(Rendered for this site with the project’s code)*
- `fig-pipeline.svg`: The pipeline: split the table into five zones, pre-train on synthetic composites, fine-tune on real crops, and read out the table state. *(Diagram redrawn for this site)*
- `fig-f1.png` (photo): Per-class F1 on 81 held-out real hand crops, counting every copy: a mean of 0.737 over the 48 classes present. Blue 2, blue 6 and red 7 are never found. *(Rendered for this site with the project’s code)*
- `fig-failures.jpg` (photo): Where it still fails: tight fans. A card mostly hidden under others is the typical miss; on the held-out crops, the model misses cards more than twice as often as it invents them. *(Rendered for this site with the project’s code)*
- `fig-gradcam.jpg` (photo): Where the network looks (Grad-CAM on its last stage): on a green skip hidden under a +2, and on the blue 8, not the green one beside it. For a turn token cut off at the crop’s edge, it looks at the cards instead, yet still counts it. *(Rendered for this site with the project’s code)*

**Sources**
- [CV] "Image Processing for Uno Cards": lightweight (12M parameter) customized ResNet-18 with CBAM, detects and counts overlapping cards, synthetic data pipeline with occlusion and perspective augmentations, Sim2Real, multi-stage fine-tuning, 75% accuracy on a Kaggle dataset (Alexandros: the course's Kaggle leaderboard score).
- [Report] the team's course report (local only, never published): the five-zone split, padding to square at 336 px, the 56 × 6 counting head, focal loss, synthetic two-card pre-training, head-first then full fine-tuning, the failure modes.
- [Code] the restructured repo (github.com/AlexandrosDellios/ImageProject): 11.4M parameters, 10,000 + 2,000 synthetic images, 405 crops (324 train + their 324 turned copies, 81 val), mean F1 0.737 over 48 classes on the 81 held-out crops (32 copies missed, 14 invented), the submission reproduced 159/159.
- [Run] the hero, the zones, F1, Grad-CAM and failure figures are runs of the submitted model rendered for this site (2026-10-24); the cards on test photos were checked by eye (hidden test labels).
- [Alexandros] team of 3, the course, his part (most of the pipeline), the Kaggle score, course photos may be shown, the repo goes public.

### 8.5 Autonomous Thymio: localization that survives a blindfold

`src/content/projects/thymio-ekf.md` · page `/work/thymio-ekf/` · Selected work, tile 4

| Field | Copy |
|---|---|
| Tile title | Autonomous Thymio: localization that survives a blindfold |
| Short title | Thymio EKF |
| Outlined word | THYMIO |
| Meta | 2025 · EPFL · Basics of Mobile Robotics course · Team of 4 · My part: State estimation (EKF) |
| One-liner | An Extended Kalman Filter fuses a camera with wheel odometry, so a real robot stays on course when its camera is covered or it gets picked up and moved. (152 characters: it is also the meta description) |
| Metric chip | `BLACKOUT ✓ · KIDNAP ✓` |
| Tags | `EKF` · `Sensor fusion` · `OpenCV` · `Real robot` |
| Accent | `#2C9658` fill / `#1E6B3E` text |
| Code link | https://github.com/AlexandrosDellios/Autonomous-Thymio |
| On the CV | no |
| Poster alt | Overhead view of the Thymio robot with an ArUco marker on a green arena with dark obstacles and a pink goal |

**Lead:** A small robot has to reach its goal with a camera that can be blocked and wheels that *drift*.

**TL;DR**
- **Problem:** Reach a goal on a 100 × 70 cm arena and avoid mapped and surprise obstacles, using one overhead camera that can be covered and odometry that drifts.
- **What we built:** A camera + odometry navigation stack for a real Thymio. My module: the Extended Kalman Filter over [x, y, θ] and its noise identification.
- **Result:** Validated live in three scenarios: a nominal run with a surprise obstacle, kidnapping, and camera blackout.
- **Stack:** Python, FilterPy, OpenCV (ArUco), NumPy/SciPy, NetworkX, tdmclient

#### The *approach*

1. **Vision (team).** OpenCV thresholding finds the map, obstacles and goal; an ArUco marker on the robot gives its pose from the overhead camera.
2. **Planning (team).** A visibility graph over the inflated obstacle corners and Dijkstra give the global path; proximity sensors handle surprise obstacles.
3. **Estimation (mine).** An EKF over [x, y, θ] with a nonlinear differential-drive motion model and wheel speeds as input, corrected by the camera pose whenever it is available.
4. **Noise from data (mine).** Camera covariance from repeated marker readings against ruler-measured positions; wheel noise from commanded against measured speed at 10 setpoints.
5. **Fallbacks.** Without the camera, the filter runs on odometry alone. A jump of more than 20 cm between camera fixes is treated as a kidnapping and triggers a new plan.

#### What it *achieved*

- **Camera + odometry fusion.** The filter runs inside the robot’s live control loop on a 100 × 70 cm arena.
- **Wheel speed calibrated from 10 setpoints:** v [cm/s] = 0.0268 u + 0.4754, in Thymio motor units u.
- **Process noise from input uncertainty.** Q = B Σᵤ Bᵀ + Q_model. I kept the nonlinear motion model after simulation showed a larger heading error with the linearized one.
- **3 live scenarios passed:** surprise obstacle, kidnapping (> 20 cm jump detected and replanned), and camera blackout.

#### *Notes*

Team of 4 with one module each: global navigation and motion control, local navigation, vision, and state estimation (mine). The planning figure and the demo recordings show the whole team’s stack.

**Figures** (caption · credit)
- `fig-visibility-graph-planned-path.png`: Global planning: a visibility graph around the inflated obstacles and the shortest path to the goal. The EKF pose is the start of every plan. *(Team work · path-planning module by a teammate)*

**Videos**
- Tile loop + page hero: `/media/thymio-ekf/loop.mp4`
- `/media/thymio-ekf/kidnapping.mp4`: Kidnapping: the robot is picked up and moved, the jump is detected, and a new path is planned. Panels: internal map, raw camera, planned path. Team demo.
- `/media/thymio-ekf/camera-occlusion.mp4`: Camera covered: the robot keeps estimating its position from wheel odometry alone. Team demo.

**Sources**
- Not on the CV; it is the evidence for the CV skills "Extended Kalman Filter" and "OpenCV".
- [Report] The team report lists one module per member; Alexandros's module is state estimation (the EKF), so "My part" is shown. Arena size, the 20 cm kidnapping threshold, the 10 calibration setpoints, the wheel-speed fit and the noise model come from the report and code.
- Credits: vision, global planning and local navigation are teammates' modules. The planning figure and both demo clips are captioned as team work.

### 8.6 Glider perching with wing co-design

`src/content/projects/glider-codesign.md` · page `/work/glider-codesign/` · Selected work, tile 2

| Field | Copy |
|---|---|
| Tile title | Glider perching with wing co-design |
| Short title | Glider co-design |
| Outlined word | GLIDER |
| Meta | 2026 · EPFL · Reinforcement Learning course · in collaboration with the CV Lab · Team of 3 · My part: SAC agent, in parallel with a teammate’s PPO |
| One-liner | Reinforcement learning teaches a glider to land precisely while the agent redesigns its own wing, reaching success 29.7% faster. (CV wording) |
| Metric chip | `29.7% FASTER CONVERGENCE` |
| Tags | `PPO` · `Co-design` · `GPU-batched sim` · `Curriculum` |
| Accent | `#3A9AD9` fill / `#1A6796` text (4.85:1 on paper-2) |
| Code link | https://github.com/DaniAffCH/perching-RL (team repo, public; approved 2026-10-25) |
| On the CV | yes |
| Hero + tile loop | `/media/glider-codesign/loop.mp4`: a real inference run of the trained co-design policy, rendered for this site |
| Poster alt | Simulation render: the glider perched on its target post after a pitch-up, its flight path traced behind it |

**Lead:** What if a robot could *redesign its own wing* while learning to fly?

**TL;DR**
- **Problem:** Perching, landing on a point at near-zero speed, needs a post-stall pitch-up, and the wing’s shape limits what any controller can do. Optimal-control co-design plans one open-loop trajectory for one start.
- **What we built:** A closed-loop PPO controller for the elevator, trained to adapt to varying starting speeds, positions and flight directions in a GPU-native simulator with NeuralFoil aerodynamics, plus two searches for a better wing: one learned alongside the controller, one black-box.
- **Result:** Perches within 5 cm at under 1 m/s, matching optimal control from its start and generalizing beyond it; the best wing found cuts training time by 29.7%.
- **Stack:** Python, PyTorch, PPO, REINFORCE, cross-entropy method, NeuralFoil

#### The *approach*

1. **A simulator built for RL.** The planar glider dynamics (RK4) and the NeuralFoil aerodynamics surrogate run natively in PyTorch, so everything stays on the GPU: 4,096 gliders in parallel, about 600,000 steps per second on one RTX 5090. The agent sees a 7-D state and commands the elevator rate, within ±5 rad/s.
2. **Curriculum.** First a simple flat-plate aerodynamics model, then NeuralFoil, then four stages that tighten the perch from 0.5 m to 0.05 m, always under 1 m/s.
3. **Algorithm.** I built the SAC agent while a teammate built the PPO one, in parallel, both to replace the optimal-control planner with RL. SAC solved the flat-plate perch, but PPO was kept: it stays stable when the curriculum tightens (SAC’s replay buffer goes stale) and scales with thousands of parallel gliders, while TD3 never reliably found the pitch-up.
4. **Robustness.** Every episode starts from a randomized state: nine base positions 3 to 10 m from the perch, Gaussian noise, and a 30° spread on the velocity direction, so the controller learns a strategy, not one trajectory.
5. **Wing co-design.** The 18-D wing shape (Kulfan/CST parameters, 0 = NACA 4412) joins the policy’s state and learns by REINFORCE with a design critic as baseline. A second, black-box search (the cross-entropy method, 8 generations × 24 wings) looks directly for the wing the controller learns fastest.

#### What it *achieved*

- **5 cm, under 1 m/s.** The NeuralFoil policy cleared all four curriculum stages in 200M timesteps, trained in under 6 minutes.
- **Optimal-control quality, closed loop.** From the optimal-control baseline’s start it perches with a trajectory of comparable quality, and it keeps perching from most other starts, where an open-loop plan would have to be solved again.
- **29.7% faster learning.** With the CEM wing, the controller reaches the final curriculum stage in 200 PPO updates instead of 285 for the NACA 4412, and masters perching in 244 instead of 336 (5 seeds); the co-designed wing is 27.1% faster.
- **The direction matters.** A random change of the same size is only 11.6% faster and was the only wing that once failed to master: co-design points somewhere real.

#### *Notes*

The animation at the top is a real inference run of the trained co-design policy flying its co-designed wing, rendered for this site from the logged states: it perches 4.5 cm off target at 0.91 m/s after 2.42 s (shown at ×0.48, the glider drawn larger than scale). From 12 random starts, it perched every time.

A team of 3 in EPFL’s Reinforcement Learning course, in collaboration with the CV Lab: the project builds on the lab’s gradient-based co-design framework for winged robots, and NeuralFoil is an open-source aerodynamics surrogate. The code is in the team’s repository, linked above.

**Figures** (caption · credit), in order:
- `fig-training-curve-neuralfoil.png`: Training with NeuralFoil aerodynamics: each sharp drop is the curriculum tightening the perch, and the policy recovers every time. 200M timesteps in under 6 minutes. *(Team figure · course report)*
- `fig-algorithm-comparison.png`: PPO, SAC and TD3, normalised training curves over the first 4M timesteps: PPO was kept, for its stability across curriculum stages and its scaling to thousands of parallel gliders. *(Team figure · course report)*
- `fig-optimized-airfoils.png`: The wings: the NACA 4412 baseline, the co-designed wing, and the CEM winner, visibly thinner. *(Team figure · course report)*
- `fig-convergence.svg`: Learning speed per wing: PPO updates until the controller reaches the final curriculum stage, with each wing frozen (mean ± sd, 5 seeds). The CEM winner gets there 29.7% sooner than the NACA 4412. *(Redrawn for this site from our course report)*
- `fig-rl-vs-ocp.png`: The trained policy against the optimal-control baseline from the same start: both reach the perch. *(Team figure · course report)*
- `fig-success-heatmap.png`: Success rate over start positions (perch within 5 cm at under 1 m/s): the policy perches from most of the region, and fails only where there is too little height or distance for the pitch-up. *(Team figure · course report)*
- `poster-session.jpg` (photo): Presenting our poster at the poster session.

**Sources**
- [CV] "RL-Driven Glider Co-Design": precise landings, robustness to varying starting speeds and positions, wing redesign while learning, 29.7% faster convergence. (The CV of 2026-10-24 no longer mentions wind: there was none.)
- [Report] the team's course report (local only, never published): the simulator (RK4 + NeuralFoil in PyTorch, 4,096 gliders, ~600k steps/s on an RTX 5090), the 7-D state and ±5 rad/s elevator rate, the flat-plate → NeuralFoil curriculum and its 4 stages, PPO vs SAC vs TD3, the randomized starts, the 18-D CST co-design with REINFORCE and a design critic, CEM (8 × 24), 200M timesteps in under 6 minutes, comparable trajectory quality to optimal control and the success heatmap, Table 3 (final stage reached in 200 vs 285 updates and mastery in 244 vs 336; the 29.7% / 27.1% / 11.6% speedups come from the final-stage column), the figures, team of 3, the SAC result on the flat plate, the CV Lab framework. The result line follows the report's wording.
- [Run] an inference run of the team's final co-design policy with its learned wing, in the team's own simulator, rendered for this site and independently re-run with identical states (2026-10-24): perched 4.5 cm off at 0.91 m/s after 2.42 s from the evaluation start; 12/12 perches from the environment's seeded random starts.
- [Alexandros] the course (Reinforcement Learning, a project in collaboration with the CV Lab) and his part: the SAC agent, built in parallel with a teammate's PPO, both to replace the optimal-control planner with RL.
- The code is in the team's public repository, linked with Alexandros's OK (2026-10-25) after a full check of its files and history: no report, no student numbers.

### 8.7 Fly navigation in NeuroMechFly

`src/content/projects/fly-navigation.md` · page `/work/fly-navigation/` · More projects, row 3 (`section: more`)

| Field | Copy |
|---|---|
| Title | Fly navigation in NeuroMechFly |
| Short title | Fly navigation |
| Outlined word | FLY |
| Meta | 2026 · EPFL · Controlling Behavior in Animals and Robots course · Team of 3 · My part: Posture correction, odor attraction, level 1–2 movement logic |
| One-liner | A hierarchical controller steers a simulated fruit fly to an odor source past obstacles, wind, hills and a predator, using its eyes, antennae and smell. (≤ 160 characters: it is also the meta description) |
| Metric chip | `4 SENSES · 5 LEVELS` |
| Tags | `Bio-inspired control` · `Sensor fusion` · `MuJoCo (flygym)` · `Python` |
| Accent | `#7BAE2F` fill / `#456A13` text (grass green from the arena) |
| Code link | none (teammate-owned repo) |
| On the CV | no |
| Poster alt | Chase-camera view of the simulated fruit fly walking between green grass obstacles in MuJoCo |

**Lead:** How do you walk a simulated fly to its food when *every sense tells a different story*?

**TL;DR**
- **Problem:** Walk a simulated fruit fly to an attractive odor source through five levels of rising difficulty (obstacles, wind, hilly terrain, a predator), using only its on-board senses.
- **What we built:** A priority-based controller on top of a CPG walking model: escape the predator, avoid obstacles, turn toward the odor, then track it, with posture correction throughout.
- **Result:** One controller that fuses compound-eye vision, smell, antenna wind sensing and body tilt, built to handle all five levels.
- **Stack:** Python, NumPy/SciPy, MuJoCo, flygym (NeuroMechFly v2)

#### The *approach*

1. **Walking.** flygym’s CPG-based walking model turns two descending signals, a left and a right drive, into a six-legged gait. The controller only decides those two drives.
2. **Escape first.** The predator shows up as red pixels in the compound eyes, and the fly sprints away from it.
3. **Avoid obstacles.** Green-pixel density in the upper field of each eye flags grass ahead. The turn direction accounts for the wind, sensed as antenna deflection against a calibrated baseline, and for the hill tilt, read from the body’s roll and pitch.
4. **Find the food.** Two olfactory sensors first turn the fly in place toward the odor, with a smooth fade-out, then keep it on course with a left/right steering bias.
5. **Stay upright.** A pitch and roll posture correction is added on top of the drives the whole time.

#### What it *achieved*

- **Four senses, one controller.** Compound-eye vision, smell, antenna wind sensing and body orientation feed a single priority-based decision tree.
- **Five levels.** Odor tracking, grass obstacles, wind, hilly terrain and a dragonfly predator, all handled by the same controller.
- **My part:** the pitch and roll posture correction, the odor-attraction module, and the movement logic for the first two levels.

#### *Notes*

NeuroMechFly, its CPG walking model, the arenas and the simulated senses come from the course framework (flygym). We wrote the controller as a team of 3. The code lives in a teammate’s repository.

**Videos**
- Page hero: `/media/fly-navigation/loop.mp4` (chase camera, level 2).

**Sources**
- Not on the CV. [Report] the team's controller code and commit history: the four-priority decision tree, the senses used, the five levels, and Alexandros's commits (posture correction, odor attraction, level 1–2 movement logic).
- No quantitative evaluation exists (no success rates or times), so the page describes the controller and makes no performance claim.
- Credits: NeuroMechFly and flygym come from the course; the code is in a teammate's repository, so there is no link.

---

## 9. Role pages (`/experience/<slug>/`)

Files with `kind: role`. They use the project template with role wording: the meta row reads dates · organisation · Role, the TL;DR lines are **Mission / My role / Status / Tools** (Tools is optional), and prev/next cycle through the three roles ("All experience" → `/#experience`). The home page's Now cards (BioRob, AI Team) and Experience rows (all three) link here. `year` holds the dates, `context` the organisation and `myPart` the role title; `team` is a short descriptor printed only on the social card. The `oneLiner` is also the meta description (≤ 160 characters). Media still to come shows as drawn "Coming soon" placeholders: the hero (`mediaNeeded` + `sketch`) and gallery cards (`soon`).

### 9.1 BioRob Lab

`src/content/projects/biorob.md` · page `/experience/biorob/`. **CV level only** (DECISIONS 2026-10-21): the CV's first bullet, nothing about methods.

| Field | Copy |
|---|---|
| Title (h1) | Robots that learn from a human point of view |
| Short title / word | BioRob Lab / BIOROB |
| Meta | Jul 2026 – now · BioRob Lab, EPFL · Role: Graduate Research Assistant |
| One-liner | At EPFL’s BioRob Lab, I research egocentric, data-driven robot manipulation: bridging the embodiment gap between human demonstrations and robotic execution. |
| Team (social card only) | Research lab |
| Metric chip | `RESEARCH IN PROGRESS` |
| Tags | `Robot learning` · `Egocentric data` · `Manipulation` · `Embodiment gap` |
| Accent | `#E5501D` / `#B23A12` (the site orange) |
| Hero | drawn placeholder (robot arm), "Coming soon · Lab photo" |

**Lead:** Teaching robots to learn manipulation from *a human point of view*.

**TL;DR** — Mission: Bridge the embodiment gap between human demonstrations and robotic execution. · My role: Graduate Research Assistant at EPFL’s Biorobotics Laboratory (BioRob Lab), researching egocentric, data-driven robot manipulation. · Status: Research in progress since July 2026.

**The *research*:** At EPFL’s Biorobotics Laboratory (BioRob Lab), I research egocentric, data-driven robot manipulation, focusing on bridging the embodiment gap between human demonstrations and robotic execution.

***Notes*:** Research in progress. Happy to talk about it in person.

Source: [CV] BioRob entry, bullet 1.

### 9.2 EPFL Student AI Team

`src/content/projects/ai-team.md` · page `/experience/ai-team/`

| Field | Copy |
|---|---|
| Title (h1) | Byte, a guide-dog quadruped built from scratch |
| Short title / word | EPFL Student AI Team / BYTE |
| Meta | Feb 2026 – now · EPFL Student AI Team · Role: Machine Learning Engineer · **Project docs ↗** (https://bark-documentation.readthedocs.io/en/latest/) |
| One-liner | Byte is a quadruped built to guide visually impaired people. I built its ROS 2 pipeline and C++ CAN bus interface, and I’m building its Isaac Lab RL pipeline. |
| Team (social card only) | Student team |
| Metric chip | `ROS 2 · CAN BUS · ISAAC LAB` |
| Tags | `Isaac Lab` · `Reinforcement learning` · `ROS 2` · `C++ CAN bus` · `NVIDIA Jetson` |
| Accent | `#1F9E8F` / `#0D6A60` (teal) |
| Hero | `src/assets/me/guide-dog.jpg`, alt: "Byte, the EPFL Student AI Team’s guide-dog quadruped prototype, on its test stand" |
| Coming soon (gallery) | Walking video · Isaac Lab training clip · Build photos |

**Lead:** What does it take to build a robot dog that *people can trust to guide them*?

**TL;DR** — Mission: Design and build Byte, a custom quadruped that will act as a guide dog for visually impaired people. · My role: Machine Learning Engineer: a real-time ROS 2 pipeline and a custom C++ CAN bus interface on NVIDIA Jetson, and an Isaac Lab simulation pipeline to train RL policies. · Status: Reliable motor control and state synchronization on the robot; the Isaac Lab training pipeline for varied terrain is in progress. · Tools: ROS 2, C++, CAN bus, NVIDIA Jetson, NVIDIA Isaac Lab

**The *project*:** The EPFL Student AI Team is designing and building Byte from the ground up: a custom quadruped meant to act as a guide dog for visually impaired people. The project documentation is public (Project docs, above).

**My *part*:**
1. **ROS 2 and CAN bus.** A real-time ROS 2 pipeline and a custom C++ CAN bus interface on NVIDIA Jetson hardware, for reliable motor control and state synchronization.
2. **Isaac Lab.** A simulation pipeline in NVIDIA Isaac Lab to train reinforcement-learning policies for varied-terrain navigation (in progress).

Sources: [CV] AI Team entry. The robot's name (Byte) and the documentation link: Alexandros, 2026-10-23.

### 9.3 Mediacom award

`src/content/projects/mediacom.md` · page `/experience/mediacom/`. Names and faces in its photos are published with Alexandros's OK (DECISIONS 2026-10-24), as are the course teacher's and the CMi makers' names.

| Field | Copy |
|---|---|
| Title (h1) | EPFL’s Doctor Honoris Causa award, from pitch to piece |
| Short title / word | Mediacom award / AWARD |
| Meta | Feb 2025 – May 2026 · Mediacom EPFL · Role: Lead Design & Fabrication Engineer |
| One-liner | I won the design pitch for EPFL’s official Doctor Honoris Causa award, out of 12 proposals, and took it from concept to physical fabrication. |
| Team (social card only) | With PhD researchers |
| Metric chip | `CHOSEN FROM 12 PROPOSALS` |
| Tags | `Design pitch` · `Prototyping` · `Machining` · `Fabrication` |
| Accent | `#C4893A` / `#7A5016` (bronze) |
| Hero (top of the page) | `hero`: the ECAL studio shot `03-prototype-front.jpg`, alt: "The trophy in the studio: a pink and purple silicon wafer etched with the EPFL logo, on a round metal stand", credit under the board: "Photo: ECAL photographers" |
| Poster (previews, prev/next, social card) | `src/assets/projects/mediacom/poster.jpg`, alt: "Marco Odermatt’s Doctor Honoris Causa trophy: an engraved purple silicon wafer standing on a machined metal stand" |

**Lead:** Designing the piece EPFL hands to its *honorary doctors*.

**TL;DR** — Mission: Design and build EPFL’s official Doctor Honoris Causa award. · My role: Lead Design & Fabrication Engineer: I won the design pitch out of 12 proposals and took full ownership from concept to physical fabrication. · Status: Awarded to Marco Odermatt on 4 May 2026; production now runs entirely at Mediacom and the CMi.

**How it *came together*:**
1. **Pitch.** A competitive design pitch for the official EPFL Doctor Honoris Causa Award, won out of 12 proposals.
2. **Ownership.** Full ownership of the award, from concept to physical fabrication.
3. **Standards.** Partnering with PhD researchers and the Mediacom team to meet the award’s strict design standards.
4. **Hand-over.** Production now runs entirely at Mediacom and the CMi, for the awards to come.

**Development *cycle*** (the `timeline` field; stages in Alexandros's order, photos in `src/assets/projects/mediacom/`):

| # | When | Stage | Text | Photos (caption · credit) |
|---|---|---|---|---|
| 01 | Nov 2024 | The *prototypes* | It started in the Design industriel course (SHS, in partnership with ECAL), taught by Tomas Kral. The idea: engrave the Serment d’Archimède, EPFL’s engineering oath, on a silicon wafer with microfabrication processes, so the award itself shows what EPFL makes. | First prototypes: the oath on a disc, and a bare silicon wafer, on two stand ideas. · The course presentation: prototypes and boards on the wafer, the oath and the photolithography process. · The course prototype, front: the EPFL logo on the wafer’s coloured oxide layer. (Photo: ECAL photographers) · The back: the full Serment d’Archimède, engraved in the wafer. (Photo: ECAL photographers) · The whole concept: the trophy and its design boards. (Photo: ECAL photographers) |
| 02 | Jun – Jul 2025 | The *tests* | Before production, the wafer had to survive handling and display. | Encasing test: a wafer set into a round clear case. · (clip) Protection test: a fork dragged across a wafer to test its protective layer, a coat of car varnish. |
| 03 | Sep 2025 – Apr 2026 | Into *production* | The wafers were produced at EPFL’s CMi by Pol Torres Vila and Chenxiang Zhang, and the stands were machined on a lathe. | Machining a stand on the lathe. · The first production run: the Alumni Award 2025 trophies, delivered on 4 October 2025. · A finished stand. · Assembling Marco Odermatt’s trophy. · Marco Odermatt’s Doctor Honoris Causa trophy, April 2026. |
| 04 | Jul – Oct 2025 | In print and *on stage* | The project was featured in Dimension n°18, and we presented the trophy on stage at Magistrale 2025, EPFL’s graduation ceremony. | The team with the trophy, photographed for Dimension n°18. (Photo: EPFL) · Presenting the trophy on stage at Magistrale 2025. (Photo: EPFL) |
| 05 | 4 May 2026 | The *award* | Marco Odermatt became an EPFL Doctor Honoris Causa on 4 May 2026. The trophy’s production has now been handed over entirely to Mediacom and the CMi for future awards. | Marco Odermatt on stage at EPFL on 4 May 2026, the day of his honorary doctorate and his talk. (Photo: François Wavre) |

***Notes*:** The wafers are produced at EPFL’s CMi (Center of MicroNanoTechnology) by Pol Torres Vila and Chenxiang Zhang. Photos: ECAL photographers (the course prototype studio shots), EPFL (Dimension n°18, Magistrale 2025) and François Wavre (4 May 2026); the others are mine.

Sources: [CV] Mediacom entry (older CV; kept by decision) for the pitch, ownership and standards lines. Alexandros (2026-10-24): the course (Design industriel, SHS × ECAL, Tomas Kral), the CMi makers, Dimension n°18, Magistrale 2025, the 4 May 2026 ceremony, the hand-over, the photo credits (the 4 May 2026 photo: François Wavre) and the Feb 2025 – May 2026 dates. Visible in the photos: the Alumni Award 2025 engraving ("Délivré à Lausanne, le 4 octobre 2025"), "Awarded on 4th May 2026" on Odermatt's trophy, the course boards (oath, oxide layer, photolithography).

---

## 10. How to add a new project

1. **Copy a project file.** Duplicate the closest match in `src/content/projects/` (for example `thymio-ekf.md` for a real-robot project) and rename it to the new slug: lowercase, hyphens, short (`guide-dog-rl.md`). The slug becomes the URL `/work/<slug>/`.
2. **Add the media** (see docs/MEDIA.md §4 for the processing recipes):
   - images in `src/assets/projects/<slug>/` (poster 4:3, figures as PNG or SVG);
   - videos in `public/media/<slug>/` (`loop.mp4`, `loop.webm`, `loop-poster.jpg`).
3. **Fill in the frontmatter.** Every field is checked by `src/content.config.ts`:

| Field | Required | What to write |
|---|---|---|
| `kind` | no | `project` (default) or `role` (an Experience page at `/experience/<slug>/`, §9) |
| `section` | no | Projects: `featured` (default, a Selected-work tile) or `more` (a More-projects row) |
| `title` | yes | Full title, shown on the tile and the page: "Landing a 6-DOF rocket with robust & nonlinear MPC" (no asterisks: prev/next and the social card print it as is) |
| `shortTitle` | yes | Short label for `<title>` and navigation: "Rocket MPC" |
| `shortWord` | yes | One or two uppercase words for the giant outlined word: "ROCKET" |
| `order` | yes | Position within its section (Selected work, More projects) or among the roles (1 = first). Renumber the others if needed. |
| `year` | yes | "2026" |
| `context` | yes | "EPFL · <course name> course" (optionally " · in collaboration with <lab>": the tile wraps between the parts), or the lab or team |
| `team` | yes | "Solo" or "Team of N". **Never names.** (Roles: a short descriptor, shown only on the social card) |
| `myPart` | no | Only when Alexandros has confirmed it: "State estimation (EKF)" |
| `oneLiner` | yes | One sentence with the outcome. It is always visible on the tile and is the page's meta description, so keep it ≤ 160 characters. |
| `metric` | yes | Short uppercase telemetry chip with units: "30° ROLL → LANDED < 4 S" |
| `tags` | yes | 2–5 short tags (3–4 is best): `["MPC", "CasADi"]` |
| `accent` / `accentInk` | yes | Fill colour (large shapes only) and a darker text colour with at least 4.5:1 contrast on paper `#F4EFE6`. Sample the fill from the project's own footage. |
| `cvMatch` | no | `true` if the project is on the CV |
| `links.code` | no | Only a **public repo owned by Alexandros** (or a team repo he approved), with no report PDF or student IDs in it (history included). Never private repos. |
| `privateRepo` | no | `true` shows "Code: on request" (links to the contact block) instead of a link |
| `links.website` / `links.websiteLabel` | no | A public project or team website, shown as a pill ("Project docs ↗"); label defaults to "Website" |
| `poster` | no | Path relative to the .md file: `../../assets/projects/<slug>/poster.jpg` |
| `tilePoster` | no | Tile-only still for drawings whose labels are illegible at tile size (a crop or label-free version of the poster) |
| `posterAlt` | yes | What the poster shows, in plain words. Say "Illustration" if it is not real data. |
| `hero` / `heroAlt` / `heroCredit` | no | A different image for the top of the page only (e.g. a professional shot); the tile, previews, prev/next and social card keep `poster`. `heroCredit` prints a credit line under it ("Photo: ECAL photographers"). |
| `focus` | no | `object-position` for the 4:3 crop, default "50% 50%" |
| `video` | no | `mp4`, `webm`, `poster` as public URLs: `/media/<slug>/loop.mp4` |
| `mediaNeeded` | no | Visitor-facing label for a visible "Coming soon" placeholder while media is missing: "Rocket landing screen recording". Keep specs (16:9, sizes) in docs/MEDIA.md §3. |
| `sketch` | no | Drawing for the `mediaNeeded` placeholder (the hero when there is no poster, otherwise the gallery band) and the social card of a page without a poster: `photo`, `video`, `plot`, `arm`, `quadruped`, `award` (default: picked from the label; `soon` cards always pick from their own label) |
| `soon` | no | Media still to come, as drawn "Coming soon" cards in the gallery: `["Walking video", "Build photos"]` (a label with "video"/"clip" gets a 16:9 video drawing) |
| `timeline` | no | A development story in stages, oldest first, shown as the "Development *cycle*" section: each stage has `when`, `title` (one `*italic*` phrase), optional `text`, and `media` (photos: `src`, `alt`, `caption`, optional `credit`; clips: `mp4`, `webm`, `poster`, `alt`, `caption`). See the Mediacom page (§9.3). |
| `figures` | no | List of `src` (relative path), `alt`, `caption`, optional `credit` ("Team figure · course report") |
| `extraVideos` | no | List of `mp4`, `webm`, `poster`, `caption`, optional `clickToPlay: true` (never starts by itself: for longer clips that tell a story), `autoplay: true` (plays in view on every screen, not only touch) and `wide: true` (spans the whole gallery) |
| `lead` | yes | One sentence with exactly **one** `*italic phrase*` |
| `tldr` | yes | `problem`, `built`, `result`, `stack` (optional): one line each, no asterisks. Roles read them as Mission / My role / Status / Tools |

4. **Write the body** in Markdown: `## The *approach*` (≤ 5 numbered steps, bold lead-in words), `## What it *achieved*` (3–5 bullets, each with a number), optional `## *Notes*` (what the course or team provided, no names). projects.ts recognises the sections by the words approach / achieved (or highlights, results) / notes.
   In Highlights, start each bullet with a **bold lead-in that is a complete phrase ending in a period or colon** (`**29% slopes (≈16°).** The adaptive curriculum…`). The page sets it as a serif metric on its own line; a lead-in without that punctuation stays an inline bold phrase.
5. **Check the claims.** If the project is on the CV, use the CV wording for anything the CV states. Credit course-provided code and teammates' modules. No report PDFs, student ID numbers, names or private links.
6. **Link it from the home page (optional):** a statement segment or a Toolbox "seen in" entry in `src/data/site.ts` (`slug` must match the file name).
7. **Validate:** `npx astro sync` must finish without errors. Then preview with `npm run dev`.
8. **Mirror it here** in §8 (projects) or §9 (roles), with a short **Sources** note.
9. **Social card:** `python3 scripts/og/make_og_images.py <slug>` writes `public/og/<slug>.png`.
