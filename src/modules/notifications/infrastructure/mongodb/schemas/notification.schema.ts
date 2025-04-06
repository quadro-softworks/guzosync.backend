import mongoose, { Schema, Document } from 'mongoose';
import { INotification } from '@core/domain/models/notification.model';
import { NotificationType } from '@core/domain/enums/notification-type.enum';

export interface INotificationDocument
  extends Document,
    Omit<INotification, 'id'> {}

const RelatedEntitySchema = new Schema(
  {
    entityType: {
      type: String,
      required: true,
    },
    entityId: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const NotificationSchema = new Schema<INotificationDocument>(
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
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    relatedEntity: RelatedEntitySchema,
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

export const NotificationModel = mongoose.model<INotificationDocument>(
  'Notification',
  NotificationSchema,
);
