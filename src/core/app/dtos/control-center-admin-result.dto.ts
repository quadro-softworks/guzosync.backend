import { ControlCenterAdmin } from '@core/domain/models/control-center-admin.model';
import { ControlCenterAdminId, UserId } from '@core/domain/valueObjects';

export interface IControlCenterAdminResult extends ControlCenterAdmin {}

export class ControlCenterAdminResult implements IControlCenterAdminResult {
  id: ControlCenterAdminId;
  userId: UserId;

  constructor(controlCenterAdmin: ControlCenterAdminResult) {
    this.id = controlCenterAdmin.id;
    this.userId = controlCenterAdmin.userId;
  }
}
