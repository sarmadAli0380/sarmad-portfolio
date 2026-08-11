/**
 * Single source of truth for everything the site says.
 *
 * Copy here stays strictly faithful to the resume — no invented outcomes,
 * metrics, or claims. Fields marked `expand` are places where a first-person
 * paragraph from Sarmad would add real depth; the site reads fine without them.
 */

export const identity = {
  name: "Sarmad Ali",
  role: "AI Engineer",
  location: "Lahore, Pakistan",
  email: "asarmad314@gmail.com",
  linkedin: "https://linkedin.com/in/sarmad-ali-3206813a3",
  github: "", // TODO: add if public
  statement:
    "Full-stack developer moving into AI engineering. I build agent systems, MCP tooling, and LLM infrastructure — and I own them end to end.",
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
      "A Chrome extension and WebSocket gateway that hand a locally-hosted AI agent secure control of the browser session you're already signed into.",
    body: [
      "BrowserPilot is a custom Manifest V3 Chrome extension paired with a WebSocket gateway. Together they give a locally-hosted agent secure control of a user's existing authenticated browser session — the agent works inside real, logged-in sessions rather than scraping from the outside or asking for credentials it shouldn't have.",
      "The lead-generation pipeline is the core of it: discovery through email enrichment through export, built to be resumable. Caching, deduplication, and atomic checkpoints mean a run that dies halfway resumes where it stopped instead of starting over — the difference between a demo and something you actually leave running.",
      "It also handles receipt OCR and expense reconciliation, with credentials held in AES-256-GCM encrypted storage. The whole system is covered by 204 automated tests.",
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
      "A TypeScript runtime where switching between a cloud model and a model on your own GPU is a config change — not a rewrite.",
    body: [
      "Most LLM code is quietly married to one provider. Sovereign AI Workspace treats the model as a swappable component: configuration-only switching between cloud (OpenAI Codex) and locally-hosted (Ollama/Qwen) backends, with the calling code untouched.",
      "Making that real meant handling the parts providers implement differently — structured and parallel tool calling, token budgeting, and context-window enforcement — behind one interface. Provider conformance checks verify each backend actually honors the contract rather than trusting it to.",
      "It also takes governance seriously: audit-safe log redaction, and GPU/memory-sizing utilities so you can tell in advance whether a given model fits the hardware you have. 281 automated tests pass against it.",
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
      "An MCP server that turns a folder of listing photos into a generated video walkthrough — seven tools, fire-and-poll, no database.",
    body: [
      "WalkGen is a backend MCP server built around a seven-tool, fire-and-poll architecture: the client kicks off long-running generation and polls for completion, rather than holding a connection open through a multi-minute render.",
      "Image-to-video generation runs through Kling via Replicate, feeding a custom ffmpeg pipeline that handles stitching, transitions, and frame-accurate timing. A room-aware \"shot grammar\" decides how a given space should be moved through — a kitchen and a hallway don't get the same camera treatment.",
      "Storage is a self-healing filesystem layer with no database dependency at all. Less to run, less to break, and state that you can inspect by looking at a directory.",
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
    period: "Jun 2026 — Present",
    location: "Lahore, Pakistan",
    points: [
      "Working across front-end and back-end on CodeNinja's internal Performance Management System, an employee performance-tracking platform.",
      "Matured the platform's MCP tool coverage — adding refined tools and introducing an ontology layer to structure the domain model.",
      "Led workflow enhancements and system-design improvements to streamline performance-tracking operations.",
      "Conducted testing across internal tooling, including Shikamaru, the company's project-management platform.",
    ],
  },
  {
    role: "Software Development Intern (Mentorship)",
    org: "E-Pay Punjab",
    period: "Jan 2025 · 1 month",
    location: "Punjab, Pakistan",
    points: [
      "Worked alongside the development team on E-Pay Punjab, a Government of Punjab payments platform, in a hands-on mentorship-style internship.",
      "Learned and applied core Java programming under the guidance of senior developers.",
    ],
  },
  {
    role: "Customer Support Representative",
    org: "Abacus",
    period: "2024",
    location: "Pakistan",
    points: [
      "Resolved complex technical queries, improving customer satisfaction and retention rates.",
      "Streamlined communication channels for faster response times.",
    ],
  },
];

export const certifications = {
  issuer: "Anthropic",
  items: [
    "Claude with the Anthropic API",
    "Claude Code in Action",
    "Introduction to Agent Skills",
    "Introduction to Model Context Protocol",
  ],
};

export const education = {
  degree: "BS, Computer Science",
  org: "University of Central Punjab (UCP)",
  location: "Lahore, Pakistan",
  year: "2026",
};

export const skills = [
  {
    group: "AI & LLM",
    items: [
      "LLM APIs",
      "AI Agents",
      "Model Context Protocol",
      "Prompt Engineering",
      "Generative AI",
      "Ollama",
      "AI Governance",
    ],
  },
  {
    group: "Languages & Frameworks",
    items: [
      "TypeScript",
      "JavaScript",
      "React.js",
      "React Native",
      "Node.js",
      "Express.js",
    ],
  },
  {
    group: "Backend & Data",
    items: [
      "PostgreSQL",
      "MongoDB",
      "Sequelize",
      "REST APIs",
      "JWT Auth",
      "WebSockets",
    ],
  },
  {
    group: "Tools",
    items: [
      "Git",
      "Swagger/OpenAPI",
      "Chrome DevTools Protocol",
      "Redux Toolkit",
      "Tailwind CSS",
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
