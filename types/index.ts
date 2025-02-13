
import { DocumentData } from "firebase/firestore";

export type FormStep = "team" | "social" | "payment";

export type TeamMember = {
  name: string;
  email: string;
};

export type FormData = {
  teamName: string;
  teamLeader: TeamMember;
  teamMembers: TeamMember[];
  github: string;
  linkedin: string;
  paymentScreenshot: File | null;
};

export interface TeamFormData {
  teamName: string;
  teamLeader: {
    name: string;
    email: string;
  };
  teamMembers: {
    name: string;
    email: string;
  }[];
  paymentScreenshot?: string;
  github?: string;
  linkedin?: string;
  createdAt?: number;
}



export interface TeamResponse {
  exists: boolean;
  success: boolean;
  message: string;
  team: TeamFormData & DocumentData;
}
