import mongoose, { Schema, Document } from 'mongoose';
import { INotificationSettings } from '@core/domain/models/notification-settings.model';

// Applied the reversed Omit pattern here
// Note: Original did not use Omit<Model, 'id'> but applied pattern for consistency
export interface INotificationSettingsDocument
  extends Omit<Document, 'id'>,
    INotificationSettings {}

const NotificationSettingsSchema = new Schema<INotificationSettingsDocument>(
  {
    // This might be a subdocument or related one-to-one with User
    // If it's stored in its own collection and linked to User:
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    emailEnabled: {
      type: Boolean,
      default: true,
    },
    // pushEnabled: { // Uncomment if INotificationSettings defines this
    //  type: Boolean,
    //  default: false,
    // },
  },
  {
    timestamps: true,
    // No 'id' transform needed if it's typically embedded or doesn't have its own top-level ID
    // If it IS a top-level document, add the id transform like others
    toJSON: {
      transform(doc, ret) {
        // Add if this is a standalone document: ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      transform(doc, ret) {
        // Add if this is a standalone document: ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

// Only create a model if this is a standalone collection
// If embedded, just export the schema: export { NotificationSettingsSchema };
export const NotificationSettingsModel =
  mongoose.model<INotificationSettingsDocument>(
    'NotificationSettings',
    NotificationSettingsSchema,
  );
