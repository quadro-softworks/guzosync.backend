import { NotificationType } from '@core/domain/enums/notification-type.enum';
import { NotificationId, UserId } from '@core/domain/valueObjects';

export interface INotification {
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

export class Notification {
  id: NotificationId;
  userId: UserId;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  relatedEntity?: {
    entityType: string;
    entityId: string;
  };
  createdAt: Date;
  updatedAt: Date;

  constructor(notification: INotification) {
    this.id = notification.id;
    this.userId = notification.userId;
    this.title = notification.title;
    this.message = notification.message;
    this.type = notification.type;
    this.isRead = notification.isRead;
    this.relatedEntity = notification.relatedEntity;
    this.createdAt = notification.createdAt;
    this.updatedAt = notification.updatedAt;
  }
}
