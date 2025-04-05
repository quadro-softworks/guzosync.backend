export default class TrackingEvents {
  // Listening Events
  static readonly ON_CONNECTION = 'connection';
  static readonly ON_DISCONNECTION = 'disconnect';
  static readonly ON_BUS_UPDATES_REQUESTED = 'tracking.bus_updates.request';

  // Emitting Events
  static readonly EMIT_BUS_UPDATES = 'tracking.bus_updates';
  static readonly EMIT_TRACKING_ERROR = 'tracking.error';
}
