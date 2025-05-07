export interface IEvent {
    type: string; // Unique event identifier (e.g., 'bus.created', 'location.updated')
    payload: any;
    timestamp: Date;
  }

export interface IEventBus {
    publish<T extends IEvent>(event: T): void;
    subscribe<T extends IEvent>(
      eventType: T['type'],
      handler: (event: T) => void | Promise<void>,
    ): void;
  }