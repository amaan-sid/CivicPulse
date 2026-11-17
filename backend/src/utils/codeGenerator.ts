import dotenv from "dotenv";
import { Society } from "../models/society.model";
dotenv.config();

const length = (Number)(process.env.SOCIETY_CODE_LENGTH)||6

import crypto from "crypto";

export default async function codeGen(): Promise<string> {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  while (true) {
    let code = "";

    for (let i = 0; i < length; i++) {
      const idx = crypto.randomInt(0, chars.length);
      code += chars[idx];
    }

    const exists = await Society.findOne({ code });

    if (!exists) return code;
  }
}