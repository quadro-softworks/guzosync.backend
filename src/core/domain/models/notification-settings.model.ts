export interface INotificationSettings {
  emailEnabled: boolean;
  // pushEnabled?: boolean; // Example for future push notifications
  // Add other settings like specific alert types enabled/disabled
}

export class NotificationSettings {
  emailEnabled: boolean;
  // pushEnabled?: boolean;

  constructor(notificationSettings: INotificationSettings) {
    this.emailEnabled = notificationSettings.emailEnabled;
    // this.pushEnabled = notificationSettings.pushEnabled;
  }
}
