import type { RequestHandler } from "express";

export interface IController {
  [key: string]: RequestHandler | undefined;
}