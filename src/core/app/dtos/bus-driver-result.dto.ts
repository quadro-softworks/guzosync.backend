import { PublicUser } from '@core/app/dtos/user-result';
import { BusDriver } from '@core/domain/models/bus-driver.model';

export type BusDriverResult = PublicUser & BusDriver;
