import mongoose, { Schema, Document } from 'mongoose';
import { IIncident } from '@core/domain/models/incident.model';
import { IncidentSeverity } from '@core/domain/enums/incident-severity.enum';

export interface IIncidentDocument extends Document, Omit<IIncident, 'id'> {}

const LocationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false },
);

const IncidentSchema = new Schema<IIncidentDocument>(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      auto: true,
    },
    reportedByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: LocationSchema,
    relatedBusId: {
      type: Schema.Types.ObjectId,
      ref: 'Bus',
    },
    relatedRouteId: {
      type: Schema.Types.ObjectId,
      ref: 'Route',
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    resolutionNotes: {
      type: String,
    },
    severity: {
      type: String,
      enum: Object.values(IncidentSeverity),
      required: true,
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

export const IncidentModel = mongoose.model<IIncidentDocument>(
  'Incident',
  IncidentSchema,
);
