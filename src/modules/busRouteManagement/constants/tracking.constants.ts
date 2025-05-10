export default class TrackingEvents {
  // Common Events
  static readonly ON_CONNECTION = 'connection';
  static readonly ON_DISCONNECTION = 'disconnect';
  
  // Passenger Tracking Events
  static readonly ON_BUS_UPDATES_REQUESTED = 'tracking.bus_updates.request';
  static readonly EMIT_BUS_UPDATES = 'tracking.bus_updates';
  static readonly EMIT_TRACKING_ERROR = 'tracking.error';
  
  // Mobile App Tracking Events
  static readonly ON_BUS_LOCATION_UPDATE = 'bus.location_update';
  static readonly ON_DRIVER_CONNECTED = 'driver.connected';
  static readonly ON_DRIVER_DISCONNECTED = 'driver.disconnected';
  static readonly EMIT_LOCATION_UPDATE_RESULT = 'bus.location_update.result';
  static readonly EMIT_LOCATION_UPDATE_ERROR = 'bus.location_update.error';
}
