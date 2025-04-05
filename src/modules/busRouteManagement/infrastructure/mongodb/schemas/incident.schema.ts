import { Incident } from '@core/domain/models/incident.model';
import { Location } from '@core/domain/valueObjects/location.vo';
import mongoose, { Schema, Document } from 'mongoose';

export interface IIncidentDocument
  extends Omit<Incident, 'id' | 'location'>,
    Document {
  location?: Location; // Define type for mongoose
}

const LocationSchemaStructure: Record<keyof Location, any> = {
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String },
};
const LocationSchema = new Schema(LocationSchemaStructure, { _id: false });

const IncidentSchema: Schema<IIncidentDocument> = new Schema(
  {
    reportedByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    description: { type: String, required: true },
    location: { type: LocationSchema }, // Embedded Location VO
    relatedBusId: { type: Schema.Types.ObjectId, ref: 'Bus' },
    relatedRouteId: { type: Schema.Types.ObjectId, ref: 'Route' },
    isResolved: { type: Boolean, default: false, index: true },
    resolutionNotes: { type: String },
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] }, // String enum
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

export const IncidentModel = mongoose.model<IIncidentDocument>(
  'Incident',
  IncidentSchema,
);
