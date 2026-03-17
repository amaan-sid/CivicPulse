import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "resident" | "staff" | "admin";
  flatNumber?: string;
  societyLabel?: string;
  society?: mongoose.Types.ObjectId;
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

    role: {
      type: String,
      enum: ["resident", "staff", "admin"],
      default: "resident"
    },

    flatNumber: {
      type: String,
      required: function () {
        return this.role === "resident";
      }
    },

    societyLabel: {
      type: String,
      trim: true,
      required: function () {
        return ["resident", "staff"].includes(this.role);
      }
    },

    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: false
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
