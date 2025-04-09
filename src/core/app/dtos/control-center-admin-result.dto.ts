import { IUserResult, UserResult } from '@core/app/dtos/user-result.dto';
import { ControlCenterAdmin } from '@core/domain/models/control-center-admin.model';
import { ControlCenterAdminId, UserId } from '@core/domain/valueObjects';

export interface IControlCenterAdminResult
  extends Omit<ControlCenterAdmin, 'id' | 'userId'> {}

export class ControlCenterAdminResult
  extends UserResult
  implements IControlCenterAdminResult
{
  constructor(user: IUserResult) {
    super(user);
  }
}
