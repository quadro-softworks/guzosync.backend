import { ControlCenterAdminId, UserId } from '@core/domain/valueObjects';

export interface IControlCenterAdmin {
  id: ControlCenterAdminId;
  userId: UserId;
}

export class ControlCenterAdmin {
  id: ControlCenterAdminId;
  userId: UserId;

  constructor(controlCenterAdmin: IControlCenterAdmin) {
    this.id = controlCenterAdmin.id;
    this.userId = controlCenterAdmin.userId;
  }
}
