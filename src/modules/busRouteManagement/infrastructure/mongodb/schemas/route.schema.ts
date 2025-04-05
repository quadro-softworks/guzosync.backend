import { Route } from '@core/domain/models/route.model';
import mongoose, { Schema } from 'mongoose';

export interface IRouteDocument extends Omit<Route, 'id'>, Document {}

const RouteSchema: Schema<IRouteDocument> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    // Array of BusStop ObjectIds
    stopIds: [{ type: Schema.Types.ObjectId, ref: 'BusStop', required: true }],
    totalDistance: { type: Number }, // In meters or km
    estimatedDuration: { type: Number }, // In minutes
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

// Ensure stopIds maintain order if needed (usually default array order is fine)

export const RouteModel = mongoose.model<IRouteDocument>('Route', RouteSchema);
