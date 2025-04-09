import mongoose, { Schema } from 'mongoose';

export type BusStopId = mongoose.mongo.BSON.ObjectId;
export type BusId = mongoose.mongo.BSON.ObjectId;
export type IncidentId = mongoose.mongo.BSON.ObjectId;
export type FeedbackId = mongoose.mongo.BSON.ObjectId;
export type RouteId = mongoose.mongo.BSON.ObjectId;
export type TripId = mongoose.mongo.BSON.ObjectId;
export type ScheduleId = mongoose.mongo.BSON.ObjectId;
export type NotificationId = mongoose.mongo.BSON.ObjectId;
export type AlertId = mongoose.mongo.BSON.ObjectId;

// User Ids
export type UserId = mongoose.mongo.BSON.ObjectId;
export type NotificationSettingsId = mongoose.mongo.BSON.ObjectId;
export type QueueRegulatorId = mongoose.mongo.BSON.ObjectId;
export type ControlCenterAdminId = mongoose.mongo.BSON.ObjectId;
export type BusDriverId = mongoose.mongo.BSON.ObjectId;
export type PassengerId = mongoose.mongo.BSON.ObjectId;
