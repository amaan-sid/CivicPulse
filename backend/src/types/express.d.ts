declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        society?: string;
        role?: "resident" | "member" | "staff" | "admin";
        platformRole?: "SUPER_ADMIN" | "USER";
      };
    }
  }
}

export {};
