import { User } from '@core/domain/models/user.model';
import {
  createMap,
  Dictionary,
  Mapper,
  ModelIdentifier,
} from '@automapper/core';
import { mapper } from '@core/mapping/mapper';
import { UserModel } from '@modules/userManagement/infrastructure/mongodb/schemas/user.schema';
import { QueueRegulatorResult } from '@core/app/dtos/queue-regulator-result.dto';
import { ControlCenterAdmin } from '@core/domain/models/control-center-admin.model';
import { Alert } from '@core/domain/models/alert.model';
import { AlertResult } from '@core/app/dtos/alert-result.dto';
import { Bus } from '@core/domain/models/bus.model';
import { BusResult } from '@core/app/dtos/bus-result.dto';
import { BusDriver } from '@core/domain/models/bus-driver.model';
import { BusDriverResult } from '@core/app/dtos/bus-driver-result.dto';
import { BusStop } from '@core/domain/models/bus-stop.model';
import { BusStopResult } from '@core/app/dtos/bus-stop-result.dto';
import { ControlCenterAdminResult } from '@core/app/dtos/control-center-admin-result.dto';
import { Feedback } from '@core/domain/models/feedback.model';
import { FeedbackResult } from '@core/app/dtos/feedback-result.dto';
import { Incident } from '@core/domain/models/incident.model';
import { IncidentResult } from '@core/app/dtos/incident-result.dto';
import { Notification } from '@core/domain/models/notification.model';
import { NotificationResult } from '@core/app/dtos/notification-result.dto';
import { NotificationSettings } from '@core/domain/models/notification-settings.model';
import { NotificationSettingsResult } from '@core/app/dtos/notification-settings-result.dto';
import { Passenger } from '@core/domain/models/passenger.model';
import { PassengerResult } from '@core/app/dtos/passenger-result.dto';
import { QueueRegulator } from '@core/domain/models/queue-regulator.model';
import { Route } from '@core/domain/models/route.model';
import { RouteResult } from '@core/app/dtos/route-result.dto';
import { Schedule } from '@core/domain/models/schedule.model';
import { ScheduleResult } from '@core/app/dtos/schedule-result.dto';
import { Trip } from '@core/domain/models/trip.model';
import { TripResult } from '@core/app/dtos/trip-result.dto';
import { BusLocationUpdateResult } from '@core/app/dtos/bus-location-update-result.dto';

export const registerMapping = () => {
  // Your existing mappings
  map(User, QueueRegulatorResult);
  map(User, ControlCenterAdmin);

  // Model to Result mappings
  map(Alert, AlertResult);
  map(Bus, BusResult);
  map(BusDriver, BusDriverResult);
  map(BusStop, BusStopResult);
  map(ControlCenterAdmin, ControlCenterAdminResult);
  map(Feedback, FeedbackResult);
  map(Incident, IncidentResult);
  map(Notification, NotificationResult);
  map(NotificationSettings, NotificationSettingsResult);
  map(Passenger, PassengerResult);
  map(QueueRegulator, QueueRegulatorResult);
  map(Route, RouteResult);
  map(Schedule, ScheduleResult);
  map(Trip, TripResult);

  map(Bus, BusLocationUpdateResult);
};

function map<
  From extends ModelIdentifier<Dictionary<unknown>>,
  To extends ModelIdentifier<Dictionary<unknown>>,
>(from: From, to: To) {
  createMap(mapper, from, to);
}
