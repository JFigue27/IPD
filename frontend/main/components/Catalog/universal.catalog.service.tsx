import { CRUDFactory } from '../../core/CRUDFactory';
import AppConfig from '../../core/AppConfig';

export default class CatalogService extends CRUDFactory {
  constructor() {
    super({
      EndPoint: 'Catalog',
      BaseURL: AppConfig.UniversalCatalogsURL
    });
  }

  ADAPTER_IN(entity) {
    entity.displayValue = entity.Value;

    return entity;
  }

  GetCatalog = async (name: string, qparams: string = '', wantCommonResponse: boolean = false) => {
    return await this.GetPaged(0, 1, '?CatalogDefinition=' + name + '&' + qparams).then(r => (wantCommonResponse ? r : r.Result));
  };
}
