import { CRUDFactory } from '../../core/CRUDFactory';

export default class AccountService extends CRUDFactory {
  constructor() {
    super({
      EndPoint: 'Account'
    });
  }
  ADAPTER_IN(entity) {
    entity.displayValue = entity.UserName;
    entity.ConvertedCreatedDate = entity.CreatedDate ? new Date(entity.CreatedDate) : null;
    entity.ConvertedLastLoginAttempt = entity.LastLoginAttempt ? new Date(entity.LastLoginAttempt) : null;
    entity.ConvertedLockedDate = entity.LockedDate ? new Date(entity.LockedDate) : null;
    entity.CSVRoles = entity.Roles ? entity.Roles.join(', ') : '';
    // entity.CSVDepartments = entity.Departments ? entity.Departments.join(', ') : '';
    // entity.CSVManagerInDepartments = entity.ManagerInDepartments ? entity.ManagerInDepartments.join(', ') : '';
    return entity;
  }

  ADAPTER_OUT(entity) {
    entity.CreatedDate = this.toServerDate(entity.ConvertedCreatedDate);
    entity.LastLoginAttempt = this.toServerDate(entity.ConvertedLastLoginAttempt);
    entity.LockedDate = this.toServerDate(entity.ConvertedLockedDate);
    entity.Roles = entity.CSVRoles.split(',')
      .map(r => r.trim())
      .filter(r => r);
  }
}
