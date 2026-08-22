import { learningContent as seLearningContent, learningTabs as seLearningTabs } from "./learningPath";

export type LearningItemData = { title: string; text: string };
export type LearningContent = Record<string, LearningItemData[]>;

export type CourseFact = { label: string; value: string };

export type CourseCareer = { title: string; blurb: string; salary: string };

export type CourseSlug = "software-engineering" | "cybersecurity";

export type CourseContent = {
  slug: CourseSlug;
  navLabel: string;
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    facts: CourseFact[];
  };
  overviewHeading: string;
  intro: {
    heading: string;
    paragraphs: [string, string];
  };
  careers: CourseCareer[];
  learningTabs: string[];
  learningContent: LearningContent;
};

const standardFacts: CourseFact[] = [
  { label: "Program Fee", value: "₦350,000" },
  { label: "Duration", value: "6 Months" },
  { label: "Start Date", value: "August 31, 2026" },
  { label: "Location", value: "Online" },
];

const softwareEngineering: CourseContent = {
  slug: "software-engineering",
  navLabel: "Software Engineering",
  hero: {
    badge: "Full-stack Software Engineering",
    title: "Become a Software Engineer in 6 months",
    subtitle:
      "A practical, project-based program that takes you from fundamentals to job-ready in six months.",
    facts: standardFacts,
  },
  overviewHeading: "Become a Software Engineer with Innovatio Academy",
  intro: {
    heading: "What is Software Engineering?",
    paragraphs: [
      "Today's software engineers do more than write code — they build complex digital products from the frontend to the backend, connecting user experiences with powerful server-side systems and databases.",
      "At Innovatio Academy, you'll learn the fundamentals of full-stack software engineering while also discovering how modern developers use AI tools to research, debug, automate repetitive tasks, and work more efficiently.",
    ],
  },
  careers: [
    {
      title: "Full-stack Software Engineer",
      blurb: "Work across front-end, back-end, and cloud environments to deliver complete solutions.",
      salary: "$95,000",
    },
    {
      title: "Front-End Software Engineer",
      blurb: "Work across front-end, back-end, and cloud environments to deliver complete solutions.",
      salary: "$95,000",
    },
    {
      title: "Back-End Software Engineer",
      blurb: "Work across front-end, back-end, and cloud environments to deliver complete solutions.",
      salary: "$95,000",
    },
  ],
  learningTabs: seLearningTabs,
  learningContent: seLearningContent,
};

const cybersecurity: CourseContent = {
  slug: "cybersecurity",
  navLabel: "Cyber Security",
  hero: {
    badge: "Cybersecurity & Digital Defense",
    title: "Become a Cybersecurity Specialist in 6 months",
    subtitle:
      "A hands-on, project-based program that takes you from networking fundamentals to defending real systems in six months.",
    facts: standardFacts,
  },
  overviewHeading: "Become a Cybersecurity Specialist with Innovatio Academy",
  intro: {
    heading: "What is Cybersecurity?",
    paragraphs: [
      "Today's cybersecurity specialists are the guardians of the digital world — they protect networks, applications, and data from constantly evolving threats by probing defenses before attackers do and responding fast when incidents happen.",
      "At Innovatio Academy, you'll learn both sides of the field — offensive testing and defensive operations — while also discovering how modern security teams use AI tools to triage alerts, analyze threats, automate reporting, and respond to incidents faster.",
    ],
  },
  careers: [
    {
      title: "SOC Analyst",
      blurb: "Monitor security operations centers, triage live alerts, and investigate suspicious activity across enterprise networks.",
      salary: "$92,000",
    },
    {
      title: "Penetration Tester",
      blurb: "Simulate real-world attacks on web apps, networks, and infrastructure to find and fix weaknesses before criminals do.",
      salary: "$105,000",
    },
    {
      title: "Security Analyst",
      blurb: "Harden systems, analyze threats, and build detection rules that keep organizations one step ahead of attackers.",
      salary: "$95,000",
    },
  ],
  learningTabs: seLearningTabs,
  learningContent: {
    "What you'll learn": [
      {
        title: "Networking Fundamentals:",
        text: "Understand TCP/IP, DNS, firewalls, VPNs, and how data actually moves across the internet.",
      },
      {
        title: "Operating Systems & Linux:",
        text: "Master the command line, file systems, permissions, and hardening for Windows and Linux environments.",
      },
      {
        title: "Threats & Attack Techniques:",
        text: "Study malware, phishing, social engineering, and the modern cyber-attack lifecycle end to end.",
      },
      {
        title: "Defensive Operations:",
        text: "Monitor SIEM dashboards, analyze logs, triage alerts, and run incident response playbooks like a real SOC team.",
      },
      {
        title: "Ethical Hacking Projects:",
        text: "Run recon, scanning, and exploitation labs in safe environments and document findings like a professional pentester.",
      },
    ],
    "Tools you'll master": [
      { title: "Recon & analysis:", text: "Nmap, Wireshark, and network packet analysis." },
      { title: "Offensive testing:", text: "Kali Linux, Burp Suite, Metasploit, and safe exploitation labs." },
      { title: "Defense & monitoring:", text: "Splunk, Wazuh, firewall rules, and SIEM workflows." },
      { title: "Scripting:", text: "Bash and Python for automating scans, reports, and responses." },
      { title: "Workflow:", text: "Git, GitHub, virtual machines, and structured lab documentation." },
    ],
    Curriculum: [
      { title: "Phase 1 — Foundations:", text: "Networking, Linux basics, and how systems get compromised." },
      { title: "Phase 2 — Systems:", text: "Windows and Linux administration, users, permissions, and hardening." },
      { title: "Phase 3 — Offense:", text: "Reconnaissance, vulnerability scanning, and ethical hacking with Kali and Burp Suite." },
      { title: "Phase 4 — Defense:", text: "SIEM monitoring, log analysis, threat detection, and incident response playbooks." },
      { title: "Phase 5 — Capstone:", text: "Red-vs-blue simulation, capture-the-flag portfolio projects, interview prep, and career support." },
    ],
    Requirements: [
      { title: "No experience needed:", text: "We start from the fundamentals — no IT or STEM background required." },
      { title: "A computer:", text: "A laptop that can run a virtual machine and a stable internet connection." },
      { title: "Commitment:", text: "Dedicate 15+ hours per week to labs, learning, and building." },
      { title: "Curiosity:", text: "A passion for solving puzzles and thinking like both attacker and defender." },
    ],
    FAQs: [
      { title: "How is the program delivered?", text: "Fully online with live sessions, recorded lessons, hands-on labs, and 1:1 mentorship." },
      { title: "Will I get support?", text: "Yes — mentors and a community of learners support you throughout the program." },
      { title: "What if I fall behind?", text: "You'll keep access to materials and lab environments after the cohort ends to catch up." },
      { title: "Do you offer financing?", text: "Yes — flexible instalments are available through our partner Paystack." },
    ],
  },
};

export const courses: Record<CourseSlug, CourseContent> = {
  "software-engineering": softwareEngineering,
  cybersecurity,
};

export function courseBySlug(slug: string): CourseContent | undefined {
  return courses[slug as CourseSlug];
}

export const courseLinks = Object.values(courses).map((course) => ({
  label: course.navLabel,
  href: `/courses/${course.slug}`,
}));
