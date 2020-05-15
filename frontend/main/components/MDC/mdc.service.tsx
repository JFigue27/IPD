import { CRUDFactory } from '../../core/CRUDFactory';

export default class MDCService extends CRUDFactory {
  constructor() {
    super({
      EndPoint: 'MDC'
    });
  }
  ADAPTER_IN(entity) {
///start:generated:adapterin<<<
entity.ConvertedMDCDeadLine = this.toJavascriptDate(entity.MDCDeadLine)
///end:generated:adapterin<<<

    return entity;
  }

  ADAPTER_OUT(entity) {
///start:generated:adapterout<<<
entity.MDCDeadLine = this.toServerDate(entity.ConvertedMDCDeadLine)
///end:generated:adapterout<<<

  }

}
