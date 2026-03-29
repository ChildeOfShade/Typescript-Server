import { Request, Response, NextFunction } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "../errors.js"; // Note: changed 'src/' to './' if in same folder

export async function handlerChirpsValidate(req: Request, res: Response, next: NextFunction) {
  try {
    const { body } = req.body;

    // 1. Validation: Use the custom error class as required
    if (!body || body.length > 140) {
      throw new BadRequestError("Chirp is too long. Max length is 140");
    }

    // 2. Profanity Filter Logic
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    const words = body.split(" ");
    
    const cleanedWords = words.map((word: string) => {
      const loweredWord = word.toLowerCase();
      // Use .includes() for an exact match or regex for more complex filtering
      if (badWords.includes(loweredWord)) {
        return "****";
      }
      return word;
    });

    const cleanedBody = cleanedWords.join(" ");

    // 3. Success Response
    respondWithJSON(res, 200, {
      cleaned_body: cleanedBody, // Ensure the key matches what the test expects (usually snake_case in Boot.dev)
    });
    
  } catch (err) {
    // 4. Pass the BadRequestError to the error middleware in index.ts
    next(err);
  }
}