import { NotificationSettingsId, UserId } from '@core/domain/valueObjects';

export interface INotificationSettings {
  id: NotificationSettingsId;
  emailEnabled: boolean;
  userId: UserId;
  // pushEnabled?: boolean; // Example for future push notifications
  // Add other settings like specific alert types enabled/disabled
}

export class NotificationSettings {
  id: NotificationSettingsId;
  emailEnabled: boolean;
  userId: UserId;
  // pushEnabled?: boolean;

  constructor(notificationSettings: INotificationSettings) {
    this.id = notificationSettings.id;
    this.userId = notificationSettings.userId;
    this.emailEnabled = notificationSettings.emailEnabled;
    // this.pushEnabled = notificationSettings.pushEnabled;
  }
}
