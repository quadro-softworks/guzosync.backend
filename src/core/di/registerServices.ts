import {
  IEmailServiceMeta,
  NodemailerEmailService,
} from '@core/services/email.service';
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
import { ConfirmPasswordResetHandler } from '@modules/userManagement/features/confirm-password-reset/confirm-password-reset.handler';
import { ConfirmPasswordResetController } from '@modules/userManagement/features/confirm-password-reset/confirm-password-reset.controller';
import { RequestPasswordResetHandler } from '@modules/userManagement/features/request-password-reset/request-password-reset.handler';
import { RequestPasswordResetController } from '@modules/userManagement/features/request-password-reset/request-password-reset.controller';
import { LogoutUserController } from '@modules/userManagement/features/logout-user/logout-user.controller';
import { GetMyProfileController } from '@modules/userManagement/features/get-my-profile/get-my-profile.controller';
import { GetMyProfileHandler } from '@modules/userManagement/features/get-my-profile/get-my-profile.handler';
import {
  IETAServiceMeta,
  SimpleETAService,
} from '@modules/busRouteManagement/services/eta.service';
import {
  ITrackingServiceMeta,
  TrackingService,
} from '@modules/busRouteManagement/services/tracking.service';
import { connectDB } from '@core/database/mongo';

export default async function registerServices(
  appContainer: DependencyContainer,
) {
  await connectDB();

  console.log('Registering dependencies...'); // Add log for debugging

  appContainer.registerSingleton(IEventBusMeta.name, AppEventBus);

  appContainer.registerSingleton(
    IHashingServiceMeta.name,
    BcryptHashingService,
  );

  appContainer.registerSingleton(IJwtServiceMeta.name, JwtService);

  appContainer.registerSingleton(
    IEmailServiceMeta.name,
    NodemailerEmailService,
  );

  appContainer.register('LogoutUserController', LogoutUserController);

  appContainer.registerSingleton(IETAServiceMeta.name, SimpleETAService);
  appContainer.registerSingleton(ITrackingServiceMeta.name, TrackingService);

  appContainer.register(
    'RequestPasswordResetHandler',
    RequestPasswordResetHandler,
  );
  appContainer.register(
    'RequestPasswordResetController',
    RequestPasswordResetController,
  );

  appContainer.register(
    'ConfirmPasswordResetHandler',
    ConfirmPasswordResetHandler,
  );
  appContainer.register(
    'ConfirmPasswordResetController',
    ConfirmPasswordResetController,
  );

  appContainer.register('GetMyProfileHandler', GetMyProfileHandler);
  appContainer.register('GetMyProfileController', GetMyProfileController);

  // appContainer.register('RegisterUserHandler', RegisterUserHandler);
  console.log('Registered dependencies!'); // Add log for debugging
}
