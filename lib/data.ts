// All portfolio content (profile, about, projects, experience, skills) lives here.

export const profile = {
  name: "Atharva Nandurkar",
  title: "Full Stack Developer (MERN)",
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
    "Full Stack Developer with 2+ years of experience building responsive and scalable web applications using React.js, Next.js, Node.js, Express.js, and MongoDB. Skilled in developing REST APIs, implementing JWT-based authentication, managing application state, and building reusable UI components. Experienced in Microsoft Azure deployment and CI/CD workflows, with a focus on clean code, performance optimization, and delivering reliable end-to-end web solutions.",
  education: {
    degree: "B.E. Electrical Engineering",
    school: "Yeshwantrao Chavan College of Engineering, Nagpur, India",
    years: "2019 – 2023",
  },
  certifications: [
    "Microsoft Certified: Azure Fundamentals (AZ-900)",
    "Microsoft Certified: Azure Developer Associate (AZ-204)",
    "Microsoft Certified: Azure DevOps Engineer Expert (AZ-400)",
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
    role: "Full Stack Developer",
    company: "Utilized Private Ltd.",
    location: "Gurugram, India (Remote)",
    period: "Apr 2025 – Dec 2025",
    bullets: [
      "Built and shipped full-stack features end-to-end - REST APIs with Node.js/Express.js, MongoDB data handling, and React.js/Next.js UI for an EdTech platform used by students and instructors.",
      "Implemented JWT-based authentication workflows and integrated frontend features with backend APIs using Axios and Redux Toolkit for state management across course and dashboard modules.",
      "Improved cross-browser compatibility and UI consistency, reducing recurring UI-related bug reports, while contributing to Agile code reviews and CI/CD deployment workflows.",
    ],
  },
  {
    role: "Full Stack Developer (MERN)",
    company: "Microland Private Ltd.",
    location: "Mumbai, India",
    period: "Jun 2023 – Feb 2025",
    bullets: [
      "Developed and maintained scalable React.js applications for a BFSI platform, delivering responsive UI features across 5+ modules using Tailwind CSS.",
      "Built 10+ reusable React components and custom hooks, improving maintainability and reducing feature development time by 20%.",
      "Debugged and modified MongoDB queries and Node.js/Express API logic, resolving data validation issues across 15+ backend endpoints.",
      "Integrated JWT-based authentication on the frontend and consumed secure REST APIs using Axios, managing session state across modules.",
      "Improved frontend performance using Chrome DevTools and Lighthouse, reducing unnecessary re-renders and page load time by 15%.",
      "Deployed application updates on Microsoft Azure and contributed to CI/CD pipelines via Git/GitHub in Agile release cycles.",
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
      "REST API Development",
      "Server-Side Rendering (SSR)",
      "Authentication (JWT/OAuth)",
      "Role-Based Access Control (RBAC)",
      "CI/CD Pipelines",
      "MVC Architecture",
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
