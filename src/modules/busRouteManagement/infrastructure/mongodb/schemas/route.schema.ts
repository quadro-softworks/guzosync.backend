import mongoose, { Schema, Document } from 'mongoose';
import { IRoute } from '@core/domain/models/route.model';

export interface IRouteDocument extends Document, Omit<IRoute, 'id'> {}

const RouteSchema = new Schema<IRouteDocument>(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      auto: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    stopIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'BusStop',
        required: true,
      },
    ],
    totalDistance: {
      type: Number,
    },
    estimatedDuration: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
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

export const RouteModel = mongoose.model<IRouteDocument>('Route', RouteSchema);
