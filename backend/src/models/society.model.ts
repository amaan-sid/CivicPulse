import mongoose, { Document } from "mongoose";

export interface ISociety extends Document {
  name: string;
  code?: string;
  address: string;
  city: string;
  state: string;
  totalFlats: number;
  admin: mongoose.Types.ObjectId;
  defaultSLAs: {
    plumbing: number;
    electricity: number;
    lift: number;
    security: number;
    cleanliness: number;
    water: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const societySchema = new mongoose.Schema<ISociety>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    code: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true
    },

    address: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    state: {
      type: String,
      required: true
    },

    totalFlats: {
      type: Number,
      required: true
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // SLA in hours for each category
    defaultSLAs: {
      plumbing: { type: Number, default: 24 },
      electricity: { type: Number, default: 12 },
      lift: { type: Number, default: 4 },
      security: { type: Number, default: 2 },
      cleanliness: { type: Number, default: 48 },
      water: { type: Number, default: 6 }
    }
  },
  { timestamps: true }
);

export const Society = mongoose.model<ISociety>("Society", societySchema);