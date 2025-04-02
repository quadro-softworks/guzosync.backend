import mongoose, { Schema, Document } from "mongoose";
import { User } from "@modules/userManagement/domain/models/user.model";

export interface IUserDocument extends User, Document {
  id: string; // Ensure id is string after transformation
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false }, // Crucial: Don't select password by default
    name: { type: String, required: false, trim: true },
    roles: [{ type: String, default: ["user"] }], // Default role
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret.password; // Ensure password NEVER sent in JSON responses
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        // Don't delete password here if needed internally (e.g., for comparison)
        // but be careful where you use toObject()
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);
