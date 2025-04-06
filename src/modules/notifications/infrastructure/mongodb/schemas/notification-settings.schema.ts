import mongoose, { Schema, Document } from 'mongoose';
import { INotificationSettings } from '@core/domain/models/notification-settings.model';

export interface INotificationSettingsDocument
  extends Document,
    INotificationSettings {}

const NotificationSettingsSchema = new Schema<INotificationSettingsDocument>(
  {
    emailEnabled: {
      type: Boolean,
      default: true,
    },
    // pushEnabled: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const NotificationSettingsModel =
  mongoose.model<INotificationSettingsDocument>(
    'NotificationSettings',
    NotificationSettingsSchema,
  );
