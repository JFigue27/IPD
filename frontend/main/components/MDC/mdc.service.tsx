import { CRUDFactory } from '../../core/CRUDFactory';

export default class MDCService extends CRUDFactory {
  constructor() {
    super({
      EndPoint: 'MDC'
    });
  }
  ADAPTER_IN(entity) {
///start:generated:adapterin<<<

///end:generated:adapterin<<<

    return entity;
  }

  ADAPTER_OUT(entity) {
///start:generated:adapterout<<<

///end:generated:adapterout<<<

  }

}
