import { NotificationSettings } from '@core/domain/models/notification-settings.model';

export interface INotificationSettingsResult extends NotificationSettings {}

export class NotificationSettingsResult implements INotificationSettingsResult {
  emailEnabled: boolean;
  // pushEnabled?: boolean;

  constructor(notificationSettings: NotificationSettingsResult) {
    this.emailEnabled = notificationSettings.emailEnabled;
    // this.pushEnabled = notificationSettings.pushEnabled;
  }
}
