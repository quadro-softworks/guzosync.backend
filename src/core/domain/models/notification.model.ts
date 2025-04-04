import { NotificationType } from '@core/domain/enums/notification-type.enum';
import { NotificationId, UserId } from '@core/domain/valueObjects';

export interface Notification {
  id: NotificationId;
  userId: UserId; // Recipient User ID (Reference)
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  // Optional link to the entity that triggered the notification
  relatedEntity?: {
    entityType: string; // e.g., 'BUS', 'ROUTE', 'TRIP'
    entityId: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
