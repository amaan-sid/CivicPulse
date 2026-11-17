import mongoose from 'mongoose';
import { z } from 'zod';

export const objectId = z
  .string()
  .refine((value) => mongoose.isValidObjectId(value), { message: 'Invalid id' });

export const idParams = z.object({ id: objectId });
