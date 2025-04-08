import mongoose, { Schema, Document } from 'mongoose';
import { IIncident } from '@core/domain/models/incident.model';
import { IncidentSeverity } from '@core/domain/enums/incident-severity.enum';

// Applied the reversed Omit pattern here
export interface IIncidentDocument extends Omit<Document, 'id'>, IIncident {}

// Define LocationSchema for reuse if not already globally defined
const LocationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  { _id: false },
);

const IncidentSchema = new Schema<IIncidentDocument>(
  {
    // id is managed by Mongoose (_id) and transforms
    reportedByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: LocationSchema, // Embed the location sub-schema
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
        // Optionally transform location coordinates if needed
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        // Optionally transform location coordinates if needed
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

// Create geospatial index if querying by location
IncidentSchema.index({ location: '2dsphere' });

export const IncidentModel = mongoose.model<IIncidentDocument>(
  'Incident',
  IncidentSchema,
);
