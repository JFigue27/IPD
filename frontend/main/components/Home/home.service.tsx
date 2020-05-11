import { CRUDFactory } from '../../core/CRUDFactory';

export default class HomeService extends CRUDFactory {
  constructor() {
    super({
      EndPoint: 'Home'
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
