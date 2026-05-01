export type ProjectStatus = "Drafting" | "Review ready" | "Active draft";

export type MarketingStat = {
  label: string;
  value: string;
  note: string;
};

export type FeatureHighlight = {
  title: string;
  description: string;
  eyebrow: string;
};

export type StudioTemplate = {
  id: string;
  title: string;
  description: string;
  accent: string;
  projectId: string;
};

export type Collaborator = {
  id: string;
  name: string;
  role: string;
  status: string;
  accent: string;
  initials: string;
};

export type ProjectFile = {
  id: string;
  name: string;
  path: string;
  kind: "tex" | "bib" | "style";
  description: string;
  editable: boolean;
  content: string;
};

export type ActivityItem = {
  title: string;
  detail: string;
  time: string;
  kind: "compile" | "review" | "assistant" | "share";
};

export type CommentThread = {
  author: string;
  location: string;
  excerpt: string;
  message: string;
  status: "Open" | "Resolved";
};

export type ProjectInsight = {
  label: string;
  value: string;
  note: string;
  tone: "positive" | "neutral" | "caution";
};

export type Milestone = {
  title: string;
  due: string;
  status: "Done" | "In review" | "Up next";
};

export type ProjectSummary = {
  id: string;
  name: string;
  category: string;
  summary: string;
  status: ProjectStatus;
  updatedAt: string;
  progress: number;
  collaborators: Collaborator[];
  healthNote: string;
};

export type StudioProject = ProjectSummary & {
  heroNote: string;
  files: ProjectFile[];
  activity: ActivityItem[];
  comments: CommentThread[];
  suggestions: FeatureHighlight[];
  insights: ProjectInsight[];
  milestones: Milestone[];
};

const roboticsMain = String.raw`\documentclass[11pt]{article}
\usepackage{graphicx}
\usepackage{booktabs}
\usepackage{hyperref}
\usepackage{amsmath}

\title{Adaptive Coordination for Distributed Field Robots}
\author{Lina Park \and Mateo Silva \and Aisha Khan}
\date{\today}

\begin{document}
\maketitle

\begin{abstract}
We present a coordination stack for distributed field robots that preserves local autonomy
while improving shared map consistency in sparse-connectivity environments.
\end{abstract}

\section{Introduction}
Field robotics teams lose throughput when perception updates arrive out of order.
Our goal is to maintain resilient coordination without forcing every robot to stop and resync.
\cite{zhang2024mesh}

\subsection{Contributions}
Our contributions are threefold: a latency-aware task router, a confidence-calibrated merge
policy, and an operator dashboard that exposes drift before it becomes mission critical.

\section{Method}
Each robot publishes a compact state bundle and a trust score. The coordinator uses the trust
score to prioritize merges while preserving local override behavior for mission-specific tasks.

\section{Results}
In three field trials we reduced idle time by 18 percent and improved map agreement by
11 percent compared with a centralized baseline.

\section{Conclusion}
Adaptive coordination lets the team keep moving while maintaining a coherent global picture.

\bibliographystyle{plain}
\bibliography{refs}
\end{document}
`;

const roboticsMethods = String.raw`\section{Ablation Notes}
We compare trust-aware routing against a time-only scheduler and a centralized consensus model.

\subsection{Operator Overrides}
Overrides remain local until two neighboring agents confirm the same anomaly. This prevents a
single noisy sensor from degrading the entire fleet.

\subsection{Merge Policy}
The merge policy maximizes:
\[
S = \alpha c_i + \beta r_i - \gamma d_i
\]
where \(c_i\) is confidence, \(r_i\) is route priority, and \(d_i\) is estimated drift.
`;

const roboticsBib = String.raw`@article{zhang2024mesh,
  title   = {Robust Mesh Coordination in Low-Bandwidth Fleets},
  author  = {Zhang, Mei and Kumar, Rohan},
  journal = {Journal of Field Robotics},
  year    = {2024}
}

@inproceedings{silva2025drift,
  title     = {Visual Drift Repair for Shared Robot Maps},
  author    = {Silva, Mateo and Park, Lina},
  booktitle = {Proceedings of the Robotics Systems Conference},
  year      = {2025}
}
`;

const grantMain = String.raw`\documentclass[11pt]{article}
\usepackage{geometry}
\usepackage{hyperref}
\geometry{margin=1in}

\title{Resilient Coastal Energy Grant Proposal}
\author{Anika Perera}
\date{\today}

\begin{document}
\maketitle

\section{Program Vision}
This proposal funds a resilient coastal microgrid program that blends storage, forecasting, and
community-led response planning for climate-exposed districts.

\section{Need Statement}
Recent storm seasons exposed cascading failures between grid interruptions and emergency shelters.
The program closes that gap by pairing energy reliability with local response playbooks.

\section{Work Packages}
Package A covers forecasting, Package B covers deployment pilots, and Package C covers training
and public reporting dashboards.

\section{Expected Outcomes}
The program aims to reduce outage recovery time, improve energy access for shelters, and create
open reporting assets for partner cities.
\end{document}
`;

const grantBudget = String.raw`\section{Budget Narrative}
The budget allocates capital across storage hardware, forecasting software, and local training.

\subsection{Storage Deployment}
Two pilot districts receive battery systems sized for shelter and clinic continuity.

\subsection{Operations}
We reserve budget for maintenance, facilitation, and public data reporting.
`;

const grantBib = String.raw`@misc{doe2025resilience,
  title        = {Community Resilience Funding Priorities},
  author       = {{Department of Energy}},
  year         = {2025},
  howpublished = {\url{https://energy.gov}}
}
`;

const thesisMain = String.raw`\documentclass[12pt]{report}
\usepackage{setspace}
\usepackage{graphicx}
\usepackage{hyperref}
\onehalfspacing

\title{Feedback-Driven Control Interfaces for Medical Robotics}
\author{Noah Bennett}
\date{\today}

\begin{document}
\maketitle
\tableofcontents

\chapter{Problem Framing}
This dissertation examines how control interfaces can reduce surgeon cognitive load while
preserving confidence during semi-autonomous robotic procedures.

\section{Research Questions}
We ask how interface pacing, confidence prompts, and task framing influence intervention timing.

\chapter{Study Design}
The study compares baseline tooling against a confidence-aware interaction layer across simulated
laparoscopic tasks.

\chapter{Early Findings}
Preliminary analysis suggests that calibrated prompts reduce hesitation without increasing error
rates in the rehearsal environment.
\end{document}
`;

const thesisNotes = String.raw`\section{Discussion Notes}
The interface should communicate uncertainty without sounding alarmist.

\subsection{Open Questions}
How much confidence detail should be visible before it becomes distracting for the operator?

\subsection{Future Work}
Extend the interaction model to voice and haptic guidance for multi-modal procedures.
`;

const thesisBib = String.raw`@article{bennett2025interfaces,
  title   = {Confidence-Aware Interaction Design for Surgical Robots},
  author  = {Bennett, Noah and Choi, Hana},
  journal = {Human-Robot Interaction Review},
  year    = {2025}
}
`;

const collaborators: Collaborator[] = [
  {
    id: "lina-park",
    name: "Lina Park",
    role: "Lead author",
    status: "Editing intro",
    accent: "#67e8f9",
    initials: "LP",
  },
  {
    id: "mateo-silva",
    name: "Mateo Silva",
    role: "Methods review",
    status: "Reviewing figures",
    accent: "#f9a8d4",
    initials: "MS",
  },
  {
    id: "aisha-khan",
    name: "Aisha Khan",
    role: "Citation sweep",
    status: "Online",
    accent: "#fcd34d",
    initials: "AK",
  },
];

const projectLibrary: Record<string, StudioProject> = {
  "distributed-robotics-paper": {
    id: "distributed-robotics-paper",
    name: "Distributed Robotics Paper",
    category: "Conference manuscript",
    summary:
      "An editor-first manuscript workspace with structured writing, references, and finish-line prep.",
    status: "Review ready",
    updatedAt: "2 min ago",
    progress: 82,
    collaborators,
    healthNote: "All critical sections are drafted. Reviewer prep is the current bottleneck.",
    heroNote: "Ship an arXiv-ready draft with preview and smart writing actions in one place.",
    files: [
      {
        id: "main-tex",
        name: "main.tex",
        path: "manuscript/main.tex",
        kind: "tex",
        description: "Primary manuscript source",
        editable: true,
        content: roboticsMain,
      },
      {
        id: "methods-tex",
        name: "methods.tex",
        path: "manuscript/sections/methods.tex",
        kind: "tex",
        description: "Ablations and equations",
        editable: true,
        content: roboticsMethods,
      },
      {
        id: "refs-bib",
        name: "refs.bib",
        path: "manuscript/refs.bib",
        kind: "bib",
        description: "Reference library",
        editable: true,
        content: roboticsBib,
      },
    ],
    activity: [
      {
        title: "Compile passed cleanly",
        detail: "No blocking errors. Two spacing suggestions were surfaced.",
        time: "1 min ago",
        kind: "compile",
      },
      {
        title: "Revision checklist updated",
        detail: "The experiments section is marked ready for venue formatting.",
        time: "12 min ago",
        kind: "review",
      },
      {
        title: "AI command deck suggested a sharper abstract",
        detail: "The abstract was shortened by 28 words without losing the core claim.",
        time: "25 min ago",
        kind: "assistant",
      },
      {
        title: "Workspace snapshot exported",
        detail: "A fresh local snapshot was prepared for the next revision pass.",
        time: "Today",
        kind: "share",
      },
    ],
    comments: [
      {
        author: "Aisha Khan",
        location: "Introduction, paragraph 2",
        excerpt: "Our goal is to maintain resilient coordination...",
        message: "Can we anchor this claim with one more systems paper so reviewers see the framing immediately?",
        status: "Open",
      },
      {
        author: "Mateo Silva",
        location: "Results, final sentence",
        excerpt: "reduced idle time by 18 percent",
        message: "Let's mention trial duration here to make the result feel more concrete.",
        status: "Open",
      },
      {
        author: "Lina Park",
        location: "Conclusion",
        excerpt: "maintaining a coherent global picture",
        message: "This is ready once the references are renumbered after the latest edits.",
        status: "Resolved",
      },
    ],
    suggestions: [
      {
        eyebrow: "Command deck",
        title: "Insert a reviewer response scaffold",
        description: "Generate a venue-ready section for rebuttal notes and evidence tracking.",
      },
      {
        eyebrow: "Reading flow",
        title: "Tighten the abstract",
        description: "The opening sentence can drop one subordinate clause for better scan speed.",
      },
      {
        eyebrow: "Citation radar",
        title: "Expand related work coverage",
        description: "The merge-policy paragraph references one source where two would build confidence.",
      },
    ],
    insights: [
      {
        label: "Readability",
        value: "92 / 100",
        note: "Dense but smooth. The intro lands quickly for a systems audience.",
        tone: "positive",
      },
      {
        label: "Citations",
        value: "7 linked",
        note: "One paragraph is still light on supporting references.",
        tone: "caution",
      },
      {
        label: "Structure",
        value: "4 sections",
        note: "Flow is stable and mirrors a strong conference narrative.",
        tone: "neutral",
      },
    ],
    milestones: [
      { title: "Intro polish", due: "Today", status: "Done" },
      { title: "Reviewer checklist", due: "Tomorrow", status: "In review" },
      { title: "Camera-ready figures", due: "This week", status: "Up next" },
    ],
  },
  "climate-grant-proposal": {
    id: "climate-grant-proposal",
    name: "Climate Grant Proposal",
    category: "Funding application",
    summary:
      "A polished proposal space for budgets, narrative blocks, and deadline-sensitive revisions.",
    status: "Drafting",
    updatedAt: "17 min ago",
    progress: 61,
    collaborators: [
      {
        id: "anika-perera",
        name: "Anika Perera",
        role: "Principal writer",
        status: "Drafting outcomes",
        accent: "#86efac",
        initials: "AP",
      },
      {
        id: "maya-fernandez",
        name: "Maya Fernandez",
        role: "Budget reviewer",
        status: "Budget pass",
        accent: "#fdba74",
        initials: "MF",
      },
    ],
    healthNote: "Narrative is strong. Budget justification still needs supporting detail.",
    heroNote: "Move from outline to board-ready narrative with a cleaner dashboard and structured revision loops.",
    files: [
      {
        id: "proposal-tex",
        name: "proposal.tex",
        path: "proposal/main.tex",
        kind: "tex",
        description: "Primary proposal draft",
        editable: true,
        content: grantMain,
      },
      {
        id: "budget-tex",
        name: "budget.tex",
        path: "proposal/sections/budget.tex",
        kind: "tex",
        description: "Budget narrative",
        editable: true,
        content: grantBudget,
      },
      {
        id: "sources-bib",
        name: "sources.bib",
        path: "proposal/sources.bib",
        kind: "bib",
        description: "Supporting references",
        editable: true,
        content: grantBib,
      },
    ],
    activity: [
      {
        title: "Narrative scoring enabled",
        detail: "The proposal now highlights weak transitions between need and outcomes.",
        time: "8 min ago",
        kind: "assistant",
      },
      {
        title: "Budget draft tightened",
        detail: "The operations breakdown now reads more clearly for the finance pass.",
        time: "17 min ago",
        kind: "review",
      },
      {
        title: "Preview export paused",
        detail: "The board-facing export is on hold until the budget notes are resolved.",
        time: "Today",
        kind: "share",
      },
    ],
    comments: [
      {
        author: "Maya Fernandez",
        location: "Budget Narrative",
        excerpt: "local training",
        message: "Let's be more explicit about how this rolls out across partner districts.",
        status: "Open",
      },
      {
        author: "Anika Perera",
        location: "Expected Outcomes",
        excerpt: "reduce outage recovery time",
        message: "Need one quantified target before we circulate this broadly.",
        status: "Open",
      },
    ],
    suggestions: [
      {
        eyebrow: "Grant mode",
        title: "Add a logic-model section",
        description: "Insert a template that connects activities, outputs, and measurable outcomes.",
      },
      {
        eyebrow: "Budget clarity",
        title: "Expand operations detail",
        description: "Reviewers will want clearer maintenance coverage after deployment.",
      },
    ],
    insights: [
      {
        label: "Narrative strength",
        value: "Strong",
        note: "The need statement is persuasive and grounded in public impact.",
        tone: "positive",
      },
      {
        label: "Deadline risk",
        value: "Medium",
        note: "Budget detail is the main critical path item before board review.",
        tone: "caution",
      },
      {
        label: "Sections complete",
        value: "3 / 5",
        note: "Two major narrative blocks still need final quantitative targets.",
        tone: "neutral",
      },
    ],
    milestones: [
      { title: "Need statement", due: "Today", status: "Done" },
      { title: "Budget narrative", due: "Tomorrow", status: "In review" },
      { title: "Board preview", due: "Friday", status: "Up next" },
    ],
  },
  "medical-robotics-thesis": {
    id: "medical-robotics-thesis",
    name: "Medical Robotics Thesis",
    category: "Dissertation chapter",
    summary:
      "A long-form thesis workspace with chapter navigation, notes, and chapter structure tracking.",
    status: "Active draft",
    updatedAt: "48 min ago",
    progress: 73,
    collaborators: [
      {
        id: "noah-bennett",
        name: "Noah Bennett",
        role: "Researcher",
        status: "Editing chapter 2",
        accent: "#c4b5fd",
        initials: "NB",
      },
      {
        id: "hana-choi",
        name: "Hana Choi",
        role: "Advisor",
        status: "Commenting live",
        accent: "#93c5fd",
        initials: "HC",
      },
    ],
    healthNote: "Chapter structure is healthy. Discussion framing needs one more revision pass.",
    heroNote: "Keep long-form academic writing organized with chapter-aware navigation and stronger revision loops.",
    files: [
      {
        id: "thesis-main",
        name: "thesis.tex",
        path: "thesis/thesis.tex",
        kind: "tex",
        description: "Main dissertation document",
        editable: true,
        content: thesisMain,
      },
      {
        id: "discussion-notes",
        name: "discussion.tex",
        path: "thesis/chapters/discussion.tex",
        kind: "tex",
        description: "Discussion notes",
        editable: true,
        content: thesisNotes,
      },
      {
        id: "thesis-refs",
        name: "references.bib",
        path: "thesis/references.bib",
        kind: "bib",
        description: "Thesis bibliography",
        editable: true,
        content: thesisBib,
      },
    ],
    activity: [
      {
        title: "Revision notes updated",
        detail: "One chapter transition was flagged and the future-work bridge needs tightening.",
        time: "6 min ago",
        kind: "review",
      },
      {
        title: "Preview outline refreshed",
        detail: "Chapter headings now mirror the table of contents automatically.",
        time: "21 min ago",
        kind: "assistant",
      },
      {
        title: "Compile completed",
        detail: "The thesis build passed after bibliography normalization.",
        time: "48 min ago",
        kind: "compile",
      },
    ],
    comments: [
      {
        author: "Hana Choi",
        location: "Future Work",
        excerpt: "voice and haptic guidance",
        message: "This is promising. Add one sentence on evaluation constraints so the scope feels grounded.",
        status: "Open",
      },
      {
        author: "Noah Bennett",
        location: "Problem Framing",
        excerpt: "preserving confidence",
        message: "Need to align this wording with the terminology used in the study chapter.",
        status: "Resolved",
      },
    ],
    suggestions: [
      {
        eyebrow: "Thesis mode",
        title: "Insert chapter summary block",
        description: "Generate a short chapter briefing before your next revision pass.",
      },
      {
        eyebrow: "Flow",
        title: "Bridge chapter transitions",
        description: "The move from study design to findings can gain one orienting sentence.",
      },
    ],
    insights: [
      {
        label: "Chapter coverage",
        value: "On track",
        note: "Core chapters are present and the table of contents is stable.",
        tone: "positive",
      },
      {
        label: "Advisor notes",
        value: "2 open",
        note: "Open revision notes are focused, which keeps the next pass manageable.",
        tone: "neutral",
      },
      {
        label: "Future work",
        value: "Needs depth",
        note: "One more concrete evaluation path would strengthen the ending.",
        tone: "caution",
      },
    ],
    milestones: [
      { title: "Study design revision", due: "Today", status: "Done" },
      { title: "Discussion pass", due: "This week", status: "In review" },
      { title: "Advisor briefing", due: "Next week", status: "Up next" },
    ],
  },
};

export const marketingStats: MarketingStat[] = [
  {
    label: "Smart writing actions",
    value: "8 built in",
    note: "Insert sections, figures, tables, and reviewer scaffolds with one click.",
  },
  {
    label: "Workspace surfaces",
    value: "4 synchronized",
    note: "Dashboard, editor, preview, and review feed stay connected.",
  },
  {
    label: "Sample project flows",
    value: "3 ready",
    note: "Research paper, grant proposal, and thesis experiences are all modeled.",
  },
];

export const featureHighlights: FeatureHighlight[] = [
  {
    eyebrow: "Editor-first core",
    title: "Editor and preview side by side",
    description: "Keep the code view, project tree, and rendered reading experience visible at the same time.",
  },
  {
    eyebrow: "Extra workspace power",
    title: "AI command deck for LaTeX blocks",
    description: "Generate common sections and revision scaffolds without leaving the writing flow.",
  },
  {
    eyebrow: "Better operations",
    title: "Project health, activity, and compile context in one shell",
    description: "Instead of hopping across menus, the workspace surfaces risks and progress directly.",
  },
];

export const studioTemplates: StudioTemplate[] = [
  {
    id: "conference-paper",
    title: "Conference Paper",
    description: "Two-column manuscript flow with fast citations and final-pass prep.",
    accent: "from-cyan-400/30 via-sky-400/10 to-transparent",
    projectId: "distributed-robotics-paper",
  },
  {
    id: "grant-proposal",
    title: "Grant Proposal",
    description: "Outcome-first narrative blocks with budget and board-ready focus.",
    accent: "from-emerald-400/30 via-lime-400/10 to-transparent",
    projectId: "climate-grant-proposal",
  },
  {
    id: "thesis-chapter",
    title: "Thesis Chapter",
    description: "Long-form writing with chapter structure and revision tracking.",
    accent: "from-violet-400/30 via-indigo-400/10 to-transparent",
    projectId: "medical-robotics-thesis",
  },
];

export const studioProjects: ProjectSummary[] = Object.values(projectLibrary).map(
  ({ activity: _activity, comments: _comments, files: _files, heroNote: _heroNote, insights: _insights, milestones: _milestones, suggestions: _suggestions, ...summary }) => summary,
);

export function getStudioProject(projectId: string): StudioProject | undefined {
  return projectLibrary[projectId];
}

export function getDefaultProject(): StudioProject {
  return projectLibrary["distributed-robotics-paper"];
}

export function cloneStudioProject(project: StudioProject): StudioProject {
  return JSON.parse(JSON.stringify(project)) as StudioProject;
}
