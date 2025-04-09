import { NotificationSettings } from '@core/domain/models/notification-settings.model';
import { NotificationSettingsId, UserId } from '@core/domain/valueObjects';

export interface INotificationSettingsResult extends NotificationSettings {}

export class NotificationSettingsResult implements INotificationSettingsResult {
  id: NotificationSettingsId;
  userId: UserId;
  emailEnabled: boolean;
  // pushEnabled?: boolean;

  constructor(notificationSettings: NotificationSettingsResult) {
    this.id = notificationSettings.id;
    this.userId = notificationSettings.userId;
    this.emailEnabled = notificationSettings.emailEnabled;
    // this.pushEnabled = notificationSettings.pushEnabled;
  }
}
