declare module "cookie-parser";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        society: string;
        societyLabel?: string;
      };
    }
  }
}

export {};
