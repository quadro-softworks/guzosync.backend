import { Schema } from 'mongoose';

export type BusStopId = Schema.Types.ObjectId;
export type BusId = Schema.Types.ObjectId;
export type IncidentId = Schema.Types.ObjectId;
export type FeedbackId = Schema.Types.ObjectId;
export type RouteId = Schema.Types.ObjectId;
export type TripId = Schema.Types.ObjectId;
export type ScheduleId = Schema.Types.ObjectId;
export type NotificationId = Schema.Types.ObjectId;
export type AlertId = Schema.Types.ObjectId;

// User Ids
export type UserId = Schema.Types.ObjectId;
export type QueueRegulatorId = Schema.Types.ObjectId;
export type ControlCenterAdminId = Schema.Types.ObjectId;
export type BusDriverId = Schema.Types.ObjectId;
export type PassengerId = Schema.Types.ObjectId;
