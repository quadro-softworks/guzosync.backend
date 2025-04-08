import mongoose, { Schema, Document } from 'mongoose';
import { IRoute } from '@core/domain/models/route.model';

// Applied the reversed Omit pattern here
export interface IRouteDocument extends Omit<Document, 'id'>, IRoute {}

const RouteSchema = new Schema<IRouteDocument>(
  {
    // id is managed by Mongoose (_id) and transforms
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
        type: Schema.Types.ObjectId, // Assuming BusStop ID is ObjectId
        ref: 'BusStop',
        required: true,
      },
    ],
    totalDistance: {
      type: Number,
    },
    estimatedDuration: {
      type: Number, // Consider storing in seconds or minutes consistently
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
