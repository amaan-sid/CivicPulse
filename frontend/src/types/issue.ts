export interface Issue {
  _id: string;
  title: string;
  description: string;
  category: "plumbing" | "electricity" | "lift" | "security" | "cleanliness" | "water";
  status: "open" | "in-progress" | "resolved";
  severity: "low" | "medium" | "high";
  priorityScore: number;
  reportCount: number;
  
  reportedBy: {
    _id: string;
    name: string;
    email?: string;
    profilePic?: string;
    gender?: "male" | "female";
  };

  reporters: string[];

  assignedTo?: {
    _id: string;
    name: string;
    role: string;
    email?: string;
    profilePic?: string;
    gender?: "male" | "female";
  };

  isEscalated: boolean;
  slaDeadline?: string;
  breachedAt?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}