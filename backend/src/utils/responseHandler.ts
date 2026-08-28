import { Response } from "express";

export interface ApiResponseOptions<T = any> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
}

export const sendSuccess = <T>({
  res,
  statusCode = 200,
  message = "Success",
  data,
}: ApiResponseOptions<T>) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined && { data }),
  });
};

export const sendError = ({
  res,
  statusCode = 500,
  message = "Internal Server Error",
}: ApiResponseOptions) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
