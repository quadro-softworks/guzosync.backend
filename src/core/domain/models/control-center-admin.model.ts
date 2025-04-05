import { ControlCenterAdminId, UserId } from '@core/domain/valueObjects';

export interface ControlCenterAdmin {
  controlCenterAdminId: ControlCenterAdminId;
  userId: UserId;
}
