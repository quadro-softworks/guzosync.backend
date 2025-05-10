import mongoose, { Document, Schema } from 'mongoose';

// Interface for Stop document
export interface IStopDocument extends Document {
  name: string;
  code: string;
  location: {
    type: string;
    coordinates: number[];
  };
  address: string;
  routeIds: mongoose.Types.ObjectId[];
  isActive: boolean;
  facilities: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Bus Stop
const StopSchema = new Schema<IStopDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (coordinates: number[]) {
            return coordinates.length === 2;
          },
          message: 'Coordinates must be [longitude, latitude]',
        },
      },
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    routeIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Route',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    facilities: [
      {
        type: String,
        enum: ['SHELTER', 'BENCH', 'LIGHTING', 'ACCESSIBILITY', 'INFORMATION_DISPLAY'],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create geospatial index on location
StopSchema.index({ location: '2dsphere' });

// Create model
export const StopModel = mongoose.model<IStopDocument>('Stop', StopSchema);
