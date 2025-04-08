import mongoose, { Schema, Document } from 'mongoose';
import { IUser, User } from '@core/domain/models/user.model';
import { Role } from '@core/domain/enums/role.enum';
import { AutoMap } from '@automapper/classes';

export interface IUserDocument extends Omit<Document, 'id'>, IUser {}

const UserSchema = new Schema<IUserDocument>(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      auto: true, // Auto-generate ObjectId if not provided
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false }, // Crucial: Don't select password by default
    firstName: { type: String, required: false, trim: true },
    lastName: { type: String, required: false, trim: true },
    // Add isActive for soft delete
    isActive: { type: Boolean, default: true, index: true },
    passwordResetToken: {
      type: String,
      select: false, // Don't include by default in queries
    },
    passwordResetExpires: {
      type: Date,
      select: false, // Don't include by default
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret.password; // Ensure password NEVER sent in JSON responses
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id;
        // Don't delete password here if needed internally (e.g., for comparison)
        // but be careful where you use toObject()
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
