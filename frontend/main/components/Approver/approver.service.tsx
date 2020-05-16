import { CRUDFactory } from '../../core/CRUDFactory';

export default class ApproverService extends CRUDFactory {
  constructor() {
    super({
      EndPoint: 'Approver'
    });
  }
  ADAPTER_IN(entity) {
///start:generated:adapterin<<<
entity.ConvertedDeadline = this.toJavascriptDate(entity.Deadline)
///end:generated:adapterin<<<

    return entity;
  }

  ADAPTER_OUT(entity) {
///start:generated:adapterout<<<
entity.Deadline = this.toServerDate(entity.ConvertedDeadline)
///end:generated:adapterout<<<

  }

}
