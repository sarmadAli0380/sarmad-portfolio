/**
 * Single source of truth for everything the site says.
 *
 * Copy here stays strictly faithful to the resume — no invented outcomes,
 * metrics, or claims. Fields marked `expand` are places where a first-person
 * paragraph from Sarmad would add real depth; the site reads fine without them.
 */

export const identity = {
  name: "Sarmad Ali",
  role: "Junior Software Engineer",
  location: "Lahore, Pakistan",
  email: "asarmad314@gmail.com",
  linkedin: "https://linkedin.com/in/sarmad-ali-3206813a3",
  github: "", // TODO: add if public
  statement:
    "I build production web applications and AI-powered developer tools with TypeScript, React, Next.js, Node.js and MCP.",
} as const;

/** Formation ids map 1:1 to particle-field geometries in the WebGL scene. */
export type FormationId =
  | "latent"
  | "lattice"
  | "pipeline"
  | "duallobe"
  | "fanout"
  | "disperse";

export type Project = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  year: string;
  formation: FormationId;
  /** One-line thesis — the thing a reader should remember. */
  thesis: string;
  /** Faithful expansion of the resume bullets. */
  body: string[];
  /** Hard numbers only. Empty is better than invented. */
  metrics: { value: string; label: string }[];
  stack: string[];
  /** Node labels rendered as the annotated architecture overlay. */
  architecture: { label: string; note: string }[];
  expand?: string;
};

export const projects: Project[] = [
  {
    id: "browserpilot",
    index: "01",
    title: "BrowserPilot",
    subtitle: "AI Assistant & Browser Automation Platform",
    year: "2026",
    formation: "pipeline",
    thesis:
      "A Chrome extension and a WebSocket gateway that let a local AI agent work inside the browser session you're already logged into.",
    body: [
      "I built this as a Manifest V3 Chrome extension with a WebSocket gateway behind it. The agent runs on your own machine and drives the session you're already signed into, so it never needs your passwords and never has to scrape from the outside.",
      "Lead generation is the main thing it does. Find candidates, enrich them with emails, export the result. I made the pipeline resumable with caching, deduplication and atomic checkpoints, so a run that dies at step four picks up again at step four.",
      "It also handles receipt OCR and expense reconciliation. Credentials sit in AES-256-GCM encrypted storage. There are 204 tests covering it.",
    ],
    metrics: [
      { value: "204", label: "automated tests" },
      { value: "AES-256", label: "GCM credential vault" },
      { value: "MV3", label: "Chrome extension" },
    ],
    stack: [
      "TypeScript",
      "Node.js",
      "React",
      "Chrome Extensions (MV3)",
      "WebSockets",
      "Chrome DevTools Protocol",
      "MCP",
      "OCR",
    ],
    architecture: [
      { label: "Extension", note: "Manifest V3" },
      { label: "WS gateway", note: "authenticated bridge" },
      { label: "Discovery", note: "seed → candidate set" },
      { label: "Enrichment", note: "email resolution" },
      { label: "Export", note: "atomic checkpoints" },
    ],
    expand:
      "Worth adding: what broke first when you left it running unattended, and what you changed.",
  },
  {
    id: "sovereign-ai",
    index: "02",
    title: "Sovereign AI Workspace",
    subtitle: "Model-Agnostic LLM Runtime",
    year: "2026",
    formation: "duallobe",
    thesis:
      "A TypeScript runtime where swapping a cloud model for one on your own GPU is a config change, not a rewrite.",
    body: [
      "Most LLM code ends up tied to whichever provider you started with. I wanted the model to be a part you can swap out, so this runtime moves between OpenAI Codex in the cloud and Ollama or Qwen locally without the calling code changing at all.",
      "The work was in the parts every provider does slightly differently: structured and parallel tool calls, token budgeting, context window limits. Those sit behind one interface now, and conformance checks verify each backend actually does what it claims instead of taking its word for it.",
      "It redacts logs so they're safe to audit, and ships GPU and memory sizing utilities so you can tell whether a model fits your hardware before downloading it. 281 tests pass against it.",
    ],
    metrics: [
      { value: "281", label: "passing tests" },
      { value: "2", label: "provider classes" },
      { value: "0", label: "code changes to swap models" },
    ],
    stack: [
      "TypeScript",
      "Node.js",
      "LLM APIs",
      "Ollama",
      "Prompt Engineering",
      "AI Governance",
    ],
    architecture: [
      { label: "Runtime core", note: "provider-agnostic" },
      { label: "Cloud adapter", note: "OpenAI Codex" },
      { label: "Local adapter", note: "Ollama / Qwen" },
      { label: "Budgeter", note: "tokens + context window" },
      { label: "Redactor", note: "audit-safe logs" },
    ],
    expand:
      "Worth adding: where the abstraction leaked, and how you decided what not to abstract.",
  },
  {
    id: "walkgen",
    index: "03",
    title: "WalkGen",
    subtitle: "AI Property Video Walkthrough Generator",
    year: "2026",
    formation: "fanout",
    thesis:
      "An MCP server that turns a folder of listing photos into a video walkthrough. Seven tools, no database.",
    body: [
      "WalkGen is a backend MCP server built around seven tools and a fire-and-poll flow. The client starts a job and polls for the result, rather than holding a connection open for the several minutes a render takes.",
      "Image to video runs through Kling on Replicate. A custom ffmpeg pipeline then stitches the clips together and handles transitions and frame-accurate timing. A room-aware shot grammar decides how to move through each space, because a kitchen and a hallway don't want the same camera move.",
      "Storage is just the filesystem with a self-healing layer on top, no database anywhere. Less to run, and you can check on a job by opening a folder.",
    ],
    metrics: [
      { value: "7", label: "MCP tools" },
      { value: "0", label: "database dependencies" },
      { value: "fire & poll", label: "execution model" },
    ],
    stack: ["Node.js", "MCP SDK", "Replicate API", "ffmpeg", "Zod"],
    architecture: [
      { label: "Ingest", note: "listing photos" },
      { label: "Shot grammar", note: "room-aware" },
      { label: "Kling / Replicate", note: "image → video" },
      { label: "ffmpeg", note: "stitch + timing" },
      { label: "FS store", note: "self-healing" },
    ],
    expand:
      "Worth adding: an embedded sample output video — this project is the one that most rewards showing rather than telling.",
  },
];

export const experience = [
  {
    role: "AI Engineer Intern",
    org: "CodeNinja",
    period: "Jun 2026 — Sep 2026",
    location: "Lahore, Pakistan",
    points: [
      "I worked across the front end and back end of the Performance Management System, an internal platform for tracking employee performance.",
      "I extended the PMS MCP server with more precise tools and an ontology layer, and improved the platform's workflows.",
      "I authored the implementation plan for multi-manager weighted ratings and an Autopilot agent pipeline, then handed both over to the team at the end of the internship.",
      "I tested internal tools, diagnosed a default credential mismatch on a no-code platform, wrote a formal bug report, and resolved merge conflicts on the shared PMS repository.",
    ],
  },
  {
    role: "Full Stack Engineer (Part-time)",
    org: "Interstate Rankers",
    period: "Apr 2025 — Dec 2025",
    location: "Lahore, Pakistan · On-site",
    points: [
      "I built and maintained the company's main website and delivered production-ready websites for US-based clients.",
      "I worked across the full stack with React, Next.js, TypeScript and the MERN stack, taking projects from requirements through deployment.",
    ],
  },
  {
    role: "Software Development Intern (Mentorship)",
    org: "E-Pay Punjab",
    period: "Jan 2025 · 1 month",
    location: "Punjab, Pakistan",
    points: [
      "I worked with the development team on E-Pay Punjab, a Government of Punjab payments platform, in a mentorship-style internship.",
      "I learned core Java on the job, with senior developers reviewing what I wrote.",
    ],
  },
  {
    role: "Customer Support Representative",
    org: "Abacus",
    period: "2024",
    location: "Pakistan",
    points: [
      "I handled complex technical queries from customers, which helped both satisfaction and retention.",
      "I tidied up the communication channels so responses went out faster.",
    ],
  },
];

export const certifications = {
  issuer: "Anthropic",
  items: [
    "Claude with the API",
    "Claude Code in Action",
    "Intro to Agent Skills",
    "Intro to MCP",
  ],
};

export const education = {
  degree: "BS, Software Engineering",
  org: "University of Central Punjab (UCP)",
  location: "Lahore, Pakistan",
  year: "",
};

export const skills = [
  {
    group: "Languages",
    items: [
      "JavaScript (ES6+)",
      "TypeScript",
      "Java",
      "HTML",
      "CSS",
    ],
  },
  {
    group: "Frontend",
    items: [
      "React",
      "Next.js",
      "React Native",
      "Responsive UI/UX",
      "Three.js",
      "GSAP",
    ],
  },
  {
    group: "Backend & Data",
    items: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "MongoDB",
      "Authentication",
      "WebSockets",
      "Third-Party Integrations",
    ],
  },
  {
    group: "AI & Engineering",
    items: [
      "Claude Code",
      "Claude",
      "ChatGPT",
      "LLM APIs",
      "Model Context Protocol",
      "AI Agents",
      "Automated Testing",
      "Git & GitHub",
      "Vercel",
      "Production Debugging",
    ],
  },
];

/** Section order drives both the scroll narrative and the field formations. */
export const sections = [
  { id: "hero", label: "Index", formation: "latent" as FormationId },
  { id: "thesis", label: "Thesis", formation: "latent" as FormationId },
  ...projects.map((p) => ({
    id: p.id,
    label: p.title,
    formation: p.formation,
  })),
  { id: "practice", label: "Practice", formation: "lattice" as FormationId },
  { id: "contact", label: "Contact", formation: "disperse" as FormationId },
];
