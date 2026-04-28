declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        society?: string;
        role?: "resident" | "member" | "admin";
      };
    }
  }
}

export {};
