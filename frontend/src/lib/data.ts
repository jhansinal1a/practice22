export const STAGES = ["Applied", "Reviewed", "Call scheduled", "Selected"] as const;

export type Stage = (typeof STAGES)[number];

export type Posting = "Senior frontend engineer" | "Backend engineer, payments";

export interface Review {
  rating: number;
  text: string;
  author: string;
}

export interface Applicant {
  id: string;
  name: string;
  posting: Posting;
  appliedOn: string;
  stage: Stage;
  resumeFile: string;
  resumeScore: number;
  callTime?: string;
  review?: Review;
}

export const POSTINGS: Posting[] = [
  "Senior frontend engineer",
  "Backend engineer, payments",
];

export const APPLICANTS: Applicant[] = [
  {
    id: "riya-kapoor",
    name: "Riya Kapoor",
    posting: "Senior frontend engineer",
    appliedOn: "Jul 2",
    stage: "Call scheduled",
    resumeFile: "RiyaKapoor_Resume.pdf",
    resumeScore: 92,
    callTime: "Jul 12, 2:00 PM",
    review: {
      rating: 5,
      text: "Strong React and TypeScript background, clean portfolio, mentored two juniors at previous role.",
      author: "Priya Nandan, Hiring Manager",
    },
  },
  {
    id: "derek-morales",
    name: "Derek Morales",
    posting: "Senior frontend engineer",
    appliedOn: "Jul 3",
    stage: "Reviewed",
    resumeFile: "DerekMorales_Resume.pdf",
    resumeScore: 81,
    review: {
      rating: 4,
      text: "Solid component architecture experience; portfolio leans on older class components.",
      author: "Priya Nandan, Hiring Manager",
    },
  },
  {
    id: "nadia-silva",
    name: "Nadia Silva",
    posting: "Senior frontend engineer",
    appliedOn: "Jul 3",
    stage: "Applied",
    resumeFile: "NadiaSilva_Resume.pdf",
    resumeScore: 76,
  },
  {
    id: "ethan-kim",
    name: "Ethan Kim",
    posting: "Senior frontend engineer",
    appliedOn: "Jul 4",
    stage: "Applied",
    resumeFile: "EthanKim_Resume.pdf",
    resumeScore: 68,
  },
  {
    id: "olivia-vance",
    name: "Olivia Vance",
    posting: "Senior frontend engineer",
    appliedOn: "Jul 5",
    stage: "Selected",
    resumeFile: "OliviaVance_Resume.pdf",
    resumeScore: 95,
    callTime: "Jul 9, 11:00 AM",
    review: {
      rating: 5,
      text: "Exceptional systems thinking, led a design-system rollout across four teams.",
      author: "Priya Nandan, Hiring Manager",
    },
  },
  {
    id: "ana-ferreira",
    name: "Ana Ferreira",
    posting: "Backend engineer, payments",
    appliedOn: "Jul 4",
    stage: "Applied",
    resumeFile: "AnaFerreira_Resume.pdf",
    resumeScore: 79,
  },
  {
    id: "tomas-wu",
    name: "Tomás Wu",
    posting: "Backend engineer, payments",
    appliedOn: "Jul 5",
    stage: "Reviewed",
    resumeFile: "TomasWu_Resume.pdf",
    resumeScore: 84,
    review: {
      rating: 4,
      text: "Good grasp of idempotent payment flows; wants more distributed-systems depth.",
      author: "Marcus Bell, Eng Lead",
    },
  },
  {
    id: "marcus-hale",
    name: "Marcus Hale",
    posting: "Backend engineer, payments",
    appliedOn: "Jul 6",
    stage: "Call scheduled",
    resumeFile: "MarcusHale_Resume.pdf",
    resumeScore: 88,
    callTime: "Jul 13, 10:30 AM",
    review: {
      rating: 4,
      text: "Ran ledger reconciliation at scale; strong on correctness and observability.",
      author: "Marcus Bell, Eng Lead",
    },
  },
  {
    id: "priya-ghosh",
    name: "Priya Ghosh",
    posting: "Backend engineer, payments",
    appliedOn: "Jul 6",
    stage: "Applied",
    resumeFile: "PriyaGhosh_Resume.pdf",
    resumeScore: 72,
  },
];

export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function stageIndex(stage: Stage): number {
  return STAGES.indexOf(stage);
}
