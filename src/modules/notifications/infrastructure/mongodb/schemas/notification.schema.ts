import { NotificationType } from '@core/domain/enums/notification-type.enum';
import { Notification } from '@core/domain/models/notification.model';
import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationDocument
  extends Omit<Notification, 'id'>,
    Document {}

// Optional sub-schema for relatedEntity
const RelatedEntitySchema = new Schema(
  {
    entityType: { type: String, required: true }, // e.g., 'BUS', 'ROUTE'
    entityId: { type: String, required: true }, // Could be ObjectId string or other ID
  },
  { _id: false },
);

const NotificationSchema = new Schema<INotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
      default: NotificationType.Other,
    },
    isRead: { type: Boolean, default: false, index: true },
    relatedEntity: { type: RelatedEntitySchema }, // Optional embedded info
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

export const NotificationModel = mongoose.model<INotificationDocument>(
  'Notification',
  NotificationSchema,
);
