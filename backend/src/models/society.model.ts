import mongoose, { Document } from "mongoose";

export interface ISociety extends Document {
  name: string;
  address: string;
  city: string;
  state: string;
  totalFlats: number;
  code: string;
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

    code: {
      type: String,
      required: true,
      unique: true
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