// Site-wide copy that is not a project or role page: identity, "Now" cards, statements,
// experience, education and toolbox. (Projects and roles: src/content/projects/*.md.)
// Source of truth for the wording: docs/CONTENT.md (keep both in sync). Every claim
// comes from Alexandros's CV unless CONTENT.md says otherwise.
//
// House rules for this file (docs/DECISIONS.md):
// - No people's names (teammates, supervisors). Say "Team of 3". The one exception is
//   Marco Odermatt in the Mediacom line (approved by Alexandros; other exceptions: docs/DECISIONS.md).
// - No links to private or teammate-owned repos. BioRob stays at CV-level wording.
// - Serif titles mark exactly ONE italic phrase with *asterisks* (rendered by Emph.astro).

export interface Link {
  label: string;
  href: string;
  external?: boolean;
}

export interface NowCard {
  variant: 'dark' | 'accent';
  kicker: string; // "NOW · RESEARCH · JUL 2026 –"
  title: string; // serif; wrap ONE phrase in *asterisks* for italic
  body: string;
  bodyShort?: string; // phones (< 600px) only: the same facts in fewer words (CV level)
  role: string; // "Graduate Research Assistant · BioRob Lab, EPFL"
  tags: string[];
  footnote?: string;
  image?: 'guide-dog'; // key into src/assets/me/ handled by the component
  imageAlt?: string; // alt text for `image` (added by the content pass; optional)
  mediaNeeded?: string; // visible placeholder label
  slug?: string; // role page (src/content/projects/<slug>.md, kind "role"): the whole card links to /experience/<slug>/
  link?: Link;
}

export interface ExperienceItem {
  when: string; // "Jul 2026 – now"
  role: string;
  org: string;
  line: string;
  mediaNeeded?: string; // what the hover card shows as a drawn "Coming soon" placeholder (no image yet)
  sketch?: 'arm' | 'award' | 'photo'; // drawing for that placeholder (src/assets/sketches/)
  image?: 'guide-dog' | 'award'; // approved photo shown as the desktop hover preview (keys: Experience.astro)
  imageLabel?: string; // caption of that preview card
  slug?: string; // role page: the row links to /experience/<slug>/
}

export interface SkillGroup {
  label: string;
  items: string[];
  seenIn?: { label: string; slug: string }[]; // links to the project or role page with that id
}

export interface Statement {
  // Serif sentence; segments with `slug` render as project links with a hover thumbnail pill.
  segments: ({ text: string } | { text: string; slug: string })[];
  pill?: Link;
}

export const site = {
  // ---- identity -------------------------------------------------------------
  name: 'Alexandros Dellios',
  firstName: 'Alexandros',
  url: 'https://alexandrosdellios.com',
  email: 'alexandrosdellios@icloud.com',
  cv: '/CV-Alexandros-Dellios.pdf',
  github: 'https://github.com/AlexandrosDellios',
  linkedin: 'https://www.linkedin.com/in/alexandros-dellios',
  // Cloudflare Web Analytics (cookieless, no personal data, so no consent banner needed).
  // The beacon token is public by design: it only identifies the site in the dashboard
  // (Cloudflare → Analytics & Logs → Web Analytics → alexandrosdellios.com).
  // Loaded in production builds only (see BaseLayout.astro). Set to '' to disable.
  cfAnalyticsToken: '4517e59f413849888e38bce3f9143aff',
  location: 'Lausanne, Switzerland',
  availability: 'Available summer 2027 · ~6 months',
  eyebrow: 'Robotics M.Sc. · EPFL · Lausanne',
  // Used for <title>/OG and as an optional static line. Echoes the CV research goal.
  headline: 'Teaching robots to make sense of the real world.',
  // ≤ 160 characters for search snippets.
  metaDescription:
    'Alexandros Dellios, Robotics M.Sc. student at EPFL: robot learning and manipulation. Projects in RL locomotion, MPC, sensor fusion and sim-to-real perception.',

  // ---- hero -----------------------------------------------------------------
  // Rotating role pairs (first word renders italic). Visual only; `rolesStatic` is the accessible version.
  roles: [
    ['Robot', 'Learning'],
    ['Egocentric', 'Manipulation'],
    ['Legged', 'Locomotion'],
    ['Model Predictive', 'Control'],
    ['Sim-to-Real', 'Perception'],
  ] as [string, string][],
  // Each " ·" is glued to the word before it (no-break space), so a wrapped line never starts with "·".
  rolesStatic: 'Robot learning\u00a0· Manipulation\u00a0· Legged locomotion\u00a0· MPC\u00a0· Perception',
  // ≤ 70 words. Sentence 2 is the CV summary, verbatim.
  bio: 'I’m a Master’s student in Robotics at EPFL, focused on robot learning and manipulation. My research goal is to help robots make sense of unstructured, real-world information so they can better assist people in everyday tasks. Right now I research egocentric robot manipulation at BioRob, and I build an Isaac Lab training pipeline for a guide-dog quadruped with the EPFL Student AI Team.',

  // ---- now (two cards; each links to its role page, /experience/<slug>/) -----
  now: [
    {
      // BioRob: CV wording only (bullet 1). No methods, models, equipment, sponsors or venues:
      // the CV's latent-action bullet stays off the site (DECISIONS 2026-10-21).
      variant: 'dark',
      kicker: 'NOW · RESEARCH · JUL 2026 –',
      title: 'Robots that learn from *a human point of view*',
      body: 'At EPFL’s Biorobotics Laboratory (BioRob Lab), I research egocentric, data-driven robot manipulation, focusing on bridging the embodiment gap between human demonstrations and robotic execution.',
      role: 'Graduate Research Assistant · BioRob Lab, EPFL',
      tags: ['Robot learning', 'Egocentric data', 'Manipulation', 'Embodiment gap'],
      bodyShort:
        'At EPFL’s Biorobotics Laboratory (BioRob Lab), I research egocentric, data-driven robot manipulation: bridging the embodiment gap between human demonstrations and robotic execution.',
      footnote: 'Research in progress. Happy to talk about it in person.',
      mediaNeeded: 'Lab photo',
      slug: 'biorob',
    },
    {
      variant: 'accent',
      kicker: 'NOW · EPFL STUDENT AI TEAM · FEB 2026 –',
      title: 'A guide-dog quadruped, *built from scratch*',
      body: 'As a Machine Learning Engineer, I contribute to the ground-up design of a custom quadruped that will act as a guide dog for visually impaired people. I implemented a real-time ROS 2 pipeline and a custom C++ CAN bus interface on NVIDIA Jetson hardware for reliable motor control and state synchronization, and I’m building a simulation pipeline in NVIDIA Isaac Lab to train reinforcement-learning policies for varied terrain.',
      bodyShort:
        'I contribute to the ground-up design of a custom quadruped that will act as a guide dog for visually impaired people. I built its real-time ROS 2 pipeline and C++ CAN bus interface on NVIDIA Jetson, and I’m building an Isaac Lab pipeline to train its RL policies.',
      role: 'Machine Learning Engineer · EPFL Student AI Team',
      tags: ['Isaac Lab', 'Reinforcement learning', 'ROS 2', 'C++ CAN bus', 'NVIDIA Jetson'],
      image: 'guide-dog',
      imageAlt: 'The EPFL Student AI Team’s guide-dog quadruped prototype on its test stand',
      slug: 'ai-team',
    },
  ] as NowCard[],

  // ---- selected work: serif statement cells between the tiles -----------------
  // Slugs must match src/content/projects/<slug>.md.
  statements: [
    {
      segments: [
        { text: 'I teach ' },
        { text: 'legged robots', slug: 'quadruped-cpg-rl' },
        { text: ' to walk with reinforcement learning, write ' },
        { text: 'controllers that land rockets', slug: 'rocket-mpc' },
        { text: ', and train networks to ' },
        { text: 'read a cluttered table', slug: 'uno-sim2real' },
        { text: '.' },
      ],
      pill: { label: 'GitHub ↗', href: 'https://github.com/AlexandrosDellios', external: true },
    },
    {
      segments: [
        { text: 'I like controllers that hold up when things go wrong: ' },
        { text: 'sensory feedback', slug: 'polymander' },
        { text: ' that keeps a robot swimming through neural damage, a glider that ' },
        { text: 'lands precisely from an off-course start', slug: 'glider-codesign' },
        { text: ', and a robot that keeps its bearings ' },
        { text: 'when its camera goes dark', slug: 'thymio-ekf' },
        { text: '.' },
      ],
      pill: { label: 'Download CV', href: '/CV-Alexandros-Dellios.pdf' },
    },
  ] as Statement[],

  // ---- experience (CV wording) ----------------------------------------------
  experience: [
    {
      when: 'Jul 2026 – now',
      role: 'Graduate Research Assistant',
      org: 'BioRob Lab, EPFL',
      line: 'Researching egocentric data-driven robot manipulation, focusing on bridging the embodiment gap between human demonstrations and robotic execution.',
      mediaNeeded: 'Lab photo',
      sketch: 'arm',
      slug: 'biorob',
    },
    {
      when: 'Feb 2026 – now',
      role: 'Machine Learning Engineer',
      org: 'EPFL Student AI Team',
      line: 'Contributing to the ground-up design and build of a custom quadruped meant to act as a guide dog for the visually impaired. Implemented a real-time ROS 2 pipeline and custom C++ CAN bus interface on NVIDIA Jetson hardware, achieving reliable motor control and state synchronization; building an NVIDIA Isaac Lab simulation pipeline to train RL policies for varied-terrain navigation.',
      image: 'guide-dog',
      imageLabel: 'Byte, the guide-dog quadruped',
      slug: 'ai-team',
    },
    {
      when: 'Feb 2025 – May 2026',
      role: 'Lead Design & Fabrication Engineer',
      org: 'Mediacom EPFL',
      line: 'Won a competitive design pitch for the official EPFL Doctor Honoris Causa Award out of 12 proposals and took full ownership from concept to physical fabrication, partnering with PhD researchers and the Mediacom team to meet the award’s strict design standards. The award was presented to Marco Odermatt and others.',
      image: 'award',
      imageLabel: 'Marco Odermatt’s trophy',
      slug: 'mediacom',
    },
  ] as ExperienceItem[],

  education: [
    {
      when: '2025 – 2028',
      role: 'M.Sc. Robotics',
      org: 'EPFL',
      line: 'Master of Science in Robotics-Engineering, expected 2028. Courses include Legged Robots, Model Predictive Control, Basics of Mobile Robotics, Computational Motor Control, Reinforcement Learning and Deep Learning.',
    },
    {
      when: '2022 – 2025',
      role: 'B.Sc. Micro-Engineering',
      org: 'EPFL',
      line: 'Bachelor of Science in Micro-Engineering.',
    },
  ] as ExperienceItem[],

  // ---- toolbox (CV technical skills, grouped; seenIn = evidence on this site) ----
  toolbox: [
    {
      label: 'Learning & vision',
      items: [
        'Reinforcement learning (PPO, SAC)',
        'Domain randomization',
        'Deep learning (data augmentation, debiasing)',
        'PyTorch',
        'JAX',
        'TensorFlow',
        'DeepSpeed',
        'OpenCV',
      ],
      seenIn: [
        { label: 'Quadruped', slug: 'quadruped-cpg-rl' },
        { label: 'Glider', slug: 'glider-codesign' },
        { label: 'Uno', slug: 'uno-sim2real' },
      ],
    },
    {
      label: 'Control & estimation',
      items: [
        'Model predictive control (linear, tube, nonlinear)',
        'Extended Kalman filter',
        'Central pattern generators',
        'Hardware–software co-design',
        'CasADi',
      ],
      seenIn: [
        { label: 'Rocket', slug: 'rocket-mpc' },
        { label: 'Thymio', slug: 'thymio-ekf' },
        { label: 'Polymander', slug: 'polymander' },
        { label: 'Glider', slug: 'glider-codesign' },
      ],
    },
    {
      label: 'Simulation & ROS',
      items: ['Isaac Lab', 'Isaac Sim', 'MuJoCo', 'PyBullet', 'ROS 2 Jazzy'],
      seenIn: [
        { label: 'AI Team', slug: 'ai-team' },
        { label: 'Quadruped', slug: 'quadruped-cpg-rl' },
        { label: 'Polymander', slug: 'polymander' },
      ],
    },
    {
      label: 'Hardware & embedded',
      items: ['NVIDIA Jetson (Orin Nano)', 'CAN bus', 'STM32', 'ESP32', 'RTOS'],
      seenIn: [{ label: 'AI Team', slug: 'ai-team' }],
    },
    {
      label: 'CAD & fabrication',
      items: ['Fusion 360', 'CATIA', 'KiCad', '3D printing', 'Machining (lathe, milling)'],
      seenIn: [{ label: 'Mediacom award', slug: 'mediacom' }],
    },
    {
      label: 'Code & tools',
      items: ['Python', 'C++', 'C', 'CUDA', 'Assembly', 'Linux', 'Git', 'Docker', 'HPC / GPU clusters'],
    },
  ] as SkillGroup[],

  // ---- footer ---------------------------------------------------------------
  footerLine: 'Let’s build robots that *help people*.',
};
