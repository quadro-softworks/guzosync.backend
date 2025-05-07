// src/core/events/event-bus.ts
import EventEmitter from 'eventemitter3';
import { injectable, singleton } from 'tsyringe';
import { IEvent, IEventBus } from './event-bus.interface';





export const IEventBusMeta = {
  name: 'IEventBus',
};

@injectable()
@singleton() // Ensure only one instance of EventBus exists
export class AppEventBus implements IEventBus {
  private emitter = new EventEmitter();

  publish<T extends IEvent>(event: T): void {
    console.log(`[EventBus] Publishing event: ${event.type}`, event.payload);
    this.emitter.emit(event.type, event);
  }

  subscribe<T extends IEvent>(
    eventType: T['type'],
    handler: (event: T) => void | Promise<void>,
  ): void {
    console.log(`[EventBus] Subscribing to event: ${eventType}`);
    this.emitter.on(eventType, async (event: T) => {
      try {
        await handler(event);
      } catch (error) {
        console.error(`[EventBus] Error handling event ${eventType}:`, error);
        // Add more robust error handling/logging here if needed
      }
    });
  }
}

// Register the EventBus with the DI container in main.ts or a dedicated setup file
// Example registration (in main.ts or src/core/di/register-core.ts):
// import { AppEventBus } from '@core/events/event-bus';
// appContainer.registerSingleton<IEventBus>('IEventBus', AppEventBus);
// Make sure to use the token 'IEventBus' when injecting
