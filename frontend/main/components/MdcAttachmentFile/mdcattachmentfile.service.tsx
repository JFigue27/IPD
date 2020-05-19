import { CRUDFactory } from '../../core/CRUDFactory';

export default class MdcAttachmentFileService extends CRUDFactory {
  constructor() {
    super({
      EndPoint: 'MdcAttachmentFile'
    });
  }
  ADAPTER_IN(entity) {
///start:generated:adapterin<<<
entity.ConvertedPeriodicReview = this.toJavascriptDate(entity.PeriodicReview)
entity.ConvertedReleaseDate = this.toJavascriptDate(entity.ReleaseDate)
///end:generated:adapterin<<<

    return entity;
  }

  ADAPTER_OUT(entity) {
///start:generated:adapterout<<<
entity.PeriodicReview = this.toServerDate(entity.ConvertedPeriodicReview)
entity.ReleaseDate = this.toServerDate(entity.ConvertedReleaseDate)
///end:generated:adapterout<<<

  }

}
