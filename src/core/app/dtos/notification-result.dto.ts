import { NotificationType } from '@core/domain/enums/notification-type.enum';
import { Notification } from '@core/domain/models/notification.model';
import { NotificationId, UserId } from '@core/domain/valueObjects';

export interface INotificationResult extends Notification {}

export class NotificationResult implements INotificationResult {
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

  constructor(notification: NotificationResult) {
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
