export default class TrafficEvents {
  // Common Events
  static readonly ON_CONNECTION = 'connection';
  static readonly ON_DISCONNECTION = 'disconnect';
  
  // Traffic Info Events
  static readonly ON_TRAFFIC_INFO_REQUESTED = 'tracking.traffic_info';
  static readonly ON_TRAFFIC_INFO_UNSUBSCRIBE = 'tracking.traffic_info.unsubscribe';
  static readonly EMIT_TRAFFIC_INFO = 'tracking.traffic_info.update';
  static readonly EMIT_TRAFFIC_ERROR = 'tracking.traffic_info.error';
} 