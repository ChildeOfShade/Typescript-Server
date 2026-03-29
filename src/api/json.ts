import { Response } from "express";

export function respondWithJSON(res: Response, code: number, obj: any) {
  res.status(code).json(obj);
}

export function respondWithError(res: Response, code: number, msg: string) {
  res.status(code).json({ error: msg });
}