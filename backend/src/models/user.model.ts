import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  profilePic?: string;
  gender: "male" | "female";
  platformRole: "SUPER_ADMIN" | "USER";
  currentSocietyId?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

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

    profilePic: {
      type: String,
      default: ""
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male"
    },

    platformRole: {
      type: String,
      enum: ["SUPER_ADMIN", "USER"],
      default: "USER"
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