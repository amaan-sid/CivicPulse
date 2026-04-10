import mongoose, {Document,Types} from "mongoose";

export interface IMembership extends Document {
    userId: Types.ObjectId;
    societyId: Types.ObjectId;
    role: "resident" | "member" | "admin";
    createdAt: Date;
    updatedAt: Date;
}

const membershipSchema = new mongoose.Schema<IMembership>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },

        societyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            res: "Society"
        },

        role: {
            type: String,
            enum: ["resident","member","admin"],
            default: "resident"
        },

    }
)

export const Membership = mongoose.model<IMembership>("Membership",membershipSchema);