export interface SocialLink {
  id: number;
  name: string;
  url: string;
  className: string;
}

export interface DateEntry {
  title: string;
  month: string;
  year: string;
}

export interface EducationEntry {
  id: number;
  universityName: string;
  specialization: string;
  dates: DateEntry[];
  achievements: string[];
}

export interface WorkEntry {
  id: number;
  companyName: string;
  specialization: string;
  dates: DateEntry[];
  achievements: string[];
}

export interface SkillEntry {
  id: number;
  skillName: string;
  percent: string;
  level: string;
}

export interface PortfolioEntry {
  id: number;
  name: string;
  description: string;
  imgurl: string;
  stats: string[];
  achievements: string[];
}

export interface InterestEntry {
  id: number;
  name: string;
  description: string;
  stats: string[];
}

export interface TestimonialEntry {
  id: number;
  name: string;
  description: string;
}

export interface ResumeData {
  baseImageURL: string;
  name: string;
  role: string;
  linkedinId: string;
  skypeId: string;
  roleDescription: string;
  endNote: string;
  socialLinks: SocialLink[];
  aboutMe: string;
  address: string;
  website: string;
  education: EducationEntry[];
  work: WorkEntry[];
  skillsDescription: string;
  skills: SkillEntry[];
  portfolioDescription: string;
  portfolio: PortfolioEntry[];
  testimonials: TestimonialEntry[];
  interestsDescription: string;
  interests: InterestEntry[];
}
