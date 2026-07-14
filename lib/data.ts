// All portfolio content (profile, about, projects, experience, skills) lives here.

export const profile = {
  name: "Atharva Nandurkar",
  title: "Frontend Developer",
  location: "Pune, India",
  email: "atharvanandurkar2411@gmail.com",
  github: "https://github.com/atharvanan",
  linkedin: "https://www.linkedin.com/in/atharvanandurkar2411",
  leetcode: "https://leetcode.com/u/atharva_n_24/",
  photo: "/profile.jpg",
};

export const about = {
  headline: "Building digital experiences with modern web technologies.",
  summary:
    "Frontend Developer with 2+ years of experience building responsive web applications using React.js, Next.js, JavaScript, HTML5, CSS3, and Tailwind CSS. Skilled in REST API integration, state management, reusable components, UI debugging, performance optimization, and Microsoft Azure deployment workflows.",
  education: {
    degree: "B.E. Electrical Engineering",
    school: "Yeshwantrao Chavan College of Engineering, Nagpur, India",
    years: "2019 – 2023",
  },
  certifications: [
    "Microsoft Certified: Azure Fundamentals (AZ-900)",
    "Microsoft Certified: Azure Developer Associate (AZ-204)",
  ],
};

export type Project = {
  name: string;
  year: string;
  description: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
};

export const projects: Project[] = [
  {
    name: "AI Resume Ranker",
    year: "2025",
    description:
      "A full-stack application that analyzes and ranks resumes against a job description using skill extraction, match/miss analysis, and a relevance scoring system.",
    tags: ["React.js", "Node.js", "REST API"],
    liveUrl: "https://ai-resume-ranker-gamma.vercel.app/",
    githubUrl: "https://github.com/atharvanan",
  },
  {
    name: "System Design Visualizer",
    year: "2026",
    description:
      "An interactive tool for designing and visualizing scalable software architectures — components, APIs, databases, and data flows.",
    tags: ["React.js", "Visualization"],
    liveUrl: "https://system-design-visualizer-iota.vercel.app/",
    githubUrl: "https://github.com/atharvanan",
  },
];

export type ExperienceEntry = {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
};

export const experience: ExperienceEntry[] = [
  {
    role: "Frontend Developer",
    company: "Utilized Private Ltd.",
    location: "Gurugram, India",
    period: "Apr 2025 – Dec 2025",
    bullets: [
      "Managed and enhanced the company's website and web application interfaces using React.js, Next.js, JavaScript, HTML5, CSS3, and Tailwind CSS, ensuring a consistent, responsive, and user-friendly experience.",
      "Implemented authentication workflows, integrated frontend features with backend APIs, and used Redux for state management across multiple application modules.",
      "Improved web accessibility and cross-browser compatibility using Chrome DevTools, while contributing to feature development, bug fixes, code reviews, and GitHub-based deployment workflows in a fast-paced EdTech environment.",
    ],
  },
  {
    role: "Frontend Developer (React.js Developer)",
    company: "Microland Private Ltd.",
    location: "Mumbai, India",
    period: "Jun 2023 – Feb 2025",
    bullets: [
      "Developed and maintained responsive React.js applications using HTML5, CSS3, and Tailwind CSS, delivering scalable UI features across multiple user-facing modules.",
      "Built 10+ reusable React components and custom hooks to improve code maintainability, consistency, and feature development efficiency.",
      "Implemented state management using Context API and Redux Toolkit for complex UI workflows and predictable application behavior.",
      "Integrated 5+ REST APIs using Axios, managing asynchronous data fetching, loading states, and error handling for reliable user experiences.",
      "Improved frontend performance using Chrome DevTools and Lighthouse by reducing unnecessary re-renders, optimizing component rendering, and resolving UI bottlenecks.",
      "Collaborated in Agile teams using Git/GitHub, participated in code reviews, and contributed to Azure-based deployment and release workflows.",
    ],
  },
];

export const skillGroups = [
  {
    label: "Languages",
    items: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3"],
  },
  {
    label: "Frontend",
    items: [
      "React.js",
      "Next.js",
      "React Hooks",
      "Context API",
      "Redux Toolkit",
      "React Router",
      "Tailwind CSS",
      "Framer Motion",
      "Material UI",
      "Styled Components",
    ],
  },
  {
    label: "Backend",
    items: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
    ],
  },
  {
    label: "Concepts",
    items: [
      "State Management",
      "Responsive Design",
      "Web Accessibility (a11y)",
      "REST API Integration",
      "Server-Side Rendering (SSR)",
      "Authentication (JWT/OAuth)",
      "CI/CD Pipelines",
    ],
  },
  {
    label: "Tools",
    items: [
      "Git",
      "GitHub",
      "Vite",
      "Chrome DevTools",
      "Lighthouse",
      "Axios",
      "NPM",
      "VS Code",
      "Postman",
      "Docker",
      "Vercel",
    ],
  },
  {
    label: "Cloud",
    items: ["Microsoft Azure", "AWS (basics)", "Vercel"],
  },
];
