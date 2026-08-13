export type LearningItem = { title: string; text: string };

export const learningItems: LearningItem[] = [
  {
    title: "Frontend Development:",
    text: "Build responsive and interactive user interfaces with HTML, CSS, JavaScript, React, and Tailwind CSS.",
  },
  {
    title: "Backend Development:",
    text: "Develop secure server-side applications, REST APIs, and authentication systems using Node.js and Express.",
  },
  {
    title: "Database Management:",
    text: "Learn how to design, manage, and connect MongoDB databases to real-world applications.",
  },
  {
    title: "AI-Assisted Development:",
    text: "Use AI tools like ChatGPT, GitHub Copilot, Cursor AI, Claude, and Gemini to code faster, debug smarter, and improve productivity.",
  },
  {
    title: "Real-World Projects:",
    text: "Build portfolio-ready full-stack applications that prepare you for internships, freelance work, and software engineering roles.",
  },
];

export const learningTabs = [
  "What you'll learn",
  "Tools you'll master",
  "Curriculum",
  "Requirements",
  "FAQs",
];

export const learningContent: Record<string, LearningItem[]> = {
  "What you'll learn": learningItems,
  "Tools you'll master": [
    { title: "Frontend:", text: "HTML, CSS, JavaScript, React, and Tailwind CSS." },
    { title: "Backend:", text: "Node.js, Express, and REST API design." },
    { title: "Databases:", text: "MongoDB and data modeling." },
    { title: "AI tools:", text: "ChatGPT, GitHub Copilot, Cursor AI, Claude, and Gemini." },
    { title: "Workflow:", text: "Git, GitHub, and modern developer workflows." },
  ],
  Curriculum: [
    { title: "Phase 1 — Foundations:", text: "HTML, CSS, JavaScript, and how the web works." },
    { title: "Phase 2 — Frontend:", text: "React, state management, and building responsive interfaces." },
    { title: "Phase 3 — Backend:", text: "Node.js, Express, authentication, and REST APIs." },
    { title: "Phase 4 — Databases:", text: "Designing and connecting MongoDB to real-world applications." },
    { title: "Phase 5 — Capstone:", text: "Portfolio-ready full-stack projects, interview prep, and career support." },
  ],
  Requirements: [
    { title: "No experience needed:", text: "We start from the fundamentals — no IT or STEM background required." },
    { title: "A computer:", text: "A laptop and a stable internet connection." },
    { title: "Commitment:", text: "Dedicate 15+ hours per week to learning and building." },
    { title: "Curiosity:", text: "A willingness to solve problems and ship real projects." },
  ],
  FAQs: [
    { title: "How is the program delivered?", text: "Fully online with live sessions, recorded lessons, and 1:1 mentorship." },
    { title: "Will I get support?", text: "Yes — mentors and a community of learners support you throughout the program." },
    { title: "What if I fall behind?", text: "You'll keep access to materials after the cohort ends to catch up." },
    { title: "Do you offer financing?", text: "Yes — flexible instalments are available through our partner Paystack." },
  ],
};
