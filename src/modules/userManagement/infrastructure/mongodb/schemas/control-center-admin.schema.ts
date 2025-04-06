import mongoose, { Schema, Document } from 'mongoose';
import { IControlCenterAdmin } from '@core/domain/models/control-center-admin.model';

export interface IControlCenterAdminDocument
  extends Document,
    Omit<IControlCenterAdmin, 'id'> {}

const ControlCenterAdminSchema = new Schema<IControlCenterAdminDocument>(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      auto: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
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
