import { RegisterUserHandler } from './../../modules/userManagement/features/register-user/register-user.handler';
import { IEventBus, IEventBusMeta, AppEventBus } from '@core/events/event-bus';
import {
  IHashingService,
  IHashingServiceMeta,
  BcryptHashingService,
} from '@core/services/hashing.service';
import {
  IJwtService,
  IJwtServiceMeta,
  JwtService,
} from '@core/services/jwt.service';
import { DependencyContainer } from 'tsyringe';

export default function registerServices(appContainer: DependencyContainer) {
  console.log('Registering dependencies...'); // Add log for debugging
  appContainer.registerSingleton(IEventBusMeta.name, AppEventBus);
  appContainer.registerSingleton(
    IHashingServiceMeta.name,
    BcryptHashingService,
  );
  appContainer.registerSingleton(IJwtServiceMeta.name, JwtService);

  // appContainer.register('RegisterUserHandler', RegisterUserHandler);
  console.log('Registered dependencies!'); // Add log for debugging
}
