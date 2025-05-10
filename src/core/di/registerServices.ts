import {
  IEmailServiceMeta,
  NodemailerEmailService,
} from '@core/services/email.service';
import { RegisterUserHandler } from './../../modules/userManagement/features/register-user/register-user.handler';
import { IEventBusMeta, AppEventBus } from '@core/events/event-bus';
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
  ETAService,
} from '@modules/busRouteManagement/services/eta.service';
import {
  ITrackingServiceMeta,
  TrackingService,
} from '@modules/busRouteManagement/services/tracking.service';
import {
  IMapServiceMeta,
  IMapService,
} from '@modules/busRouteManagement/services/map.service';
import { GoogleMapsService } from '@modules/busRouteManagement/services/google-maps.service';
import { MobileTrackingGateway } from '@modules/busRouteManagement/mobile-tracking.gateway';
import { TrafficInfoGateway } from '@modules/busRouteManagement/traffic-info.gateway';
import { ConversationGateway } from '@modules/operationsControl/conversation.gateway';
import { UpdateBusLocationMobileHandler } from '@modules/busRouteManagement/features/update-bus-location-mobile/update-bus-location-mobile.handler';
import { UpdateBusLocationMobileController } from '@modules/busRouteManagement/features/update-bus-location-mobile/update-bus-location-mobile.controller';
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

  // Register map service (Google Maps implementation)
  appContainer.registerSingleton(IMapServiceMeta.name, GoogleMapsService);
  
  // Register ETA service
  appContainer.registerSingleton(IETAServiceMeta.name, ETAService);
  
  // Register tracking service
  appContainer.registerSingleton(ITrackingServiceMeta.name, TrackingService);
  
  // Register mobile tracking components
  appContainer.register('UpdateBusLocationMobileHandler', UpdateBusLocationMobileHandler);
  appContainer.register('UpdateBusLocationMobileController', UpdateBusLocationMobileController);
  appContainer.register('MobileTrackingGateway', MobileTrackingGateway);
  
  // Register new gateways
  appContainer.registerSingleton(TrafficInfoGateway, TrafficInfoGateway);
  appContainer.registerSingleton(ConversationGateway, ConversationGateway);

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
