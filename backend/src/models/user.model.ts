import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  currentSocietyId?: mongoose.Schema.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    currentSocietyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);