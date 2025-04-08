import mongoose, { Schema, Document } from 'mongoose';
import { IControlCenterAdmin } from '@core/domain/models/control-center-admin.model';

// Applied the reversed Omit pattern here
export interface IControlCenterAdminDocument
  extends Omit<Document, 'id'>,
    IControlCenterAdmin {}

const ControlCenterAdminSchema = new Schema<IControlCenterAdminDocument>(
  {
    // id is managed by Mongoose (_id) and transforms
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Ensure one user cannot be an admin multiple times
    },
    // Add other admin-specific fields from IControlCenterAdmin if any
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const ControlCenterAdminModel =
  mongoose.model<IControlCenterAdminDocument>(
    'ControlCenterAdmin',
    ControlCenterAdminSchema,
  );
