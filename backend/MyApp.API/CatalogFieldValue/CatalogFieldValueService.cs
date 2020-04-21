using MyApp.Logic.Entities;
using MyApp.Logic;
using Reusable.Rest;
using ServiceStack;
using ServiceStack.OrmLite;
using System;
using System.Threading.Tasks;
using ServiceStack.Text;
using Reusable.Rest.Implementations.SS;
namespace MyApp.API
{
    // [Authenticate]
    public class CatalogFieldValueService : BaseService<CatalogFieldValueLogic>
    {
        #region Endpoints - Generic Read Only
        public object Get(GetAllCatalogFieldValues request)
        {
            return WithDb(db => Logic.GetAll());
        }
        public object Get(GetCatalogFieldValueById request)
        {
            return WithDb(db => Logic.GetById(request.Id));
        }
        public object Get(GetCatalogFieldValueWhere request)
        {
            return WithDb(db => Logic.GetSingleWhere(request.Property, request.Value));
        }
        public object Get(GetPagedCatalogFieldValues request)
        {
            var query = AutoQuery.CreateQuery(request, Request);
            return WithDb(db => Logic.GetPaged(
                request.Limit,
                request.Page,
                request.FilterGeneral,
                query,
                requiresKeysInJsons: request.RequiresKeysInJsons
                ));
        }
        public object Get(CurrentDataToDBSeedCatalogFieldValue request)
        {
            WithDb(db => Logic.CurrentDataToDBSeed());
            return new CommonResponse().Success();
        }
        #endregion
        #region Endpoints - Generic Write
        public object Post(CreateCatalogFieldValueInstance request)
        {
            return WithDb(db =>
            {
                var entity = request.ConvertTo<CatalogFieldValue>();
                return new HttpResult(new CommonResponse(Logic.CreateInstance(entity)))
                {
                    ResultScope = () => JsConfig.With(new Config { IncludeNullValues = true })
                };
            });
        }
        public object Post(InsertCatalogFieldValue request)
        {
            var entity = request.ConvertTo<CatalogFieldValue>();
            return InTransaction(db =>
            {
                Logic.Add(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }
        public object Put(UpdateCatalogFieldValue request)
        {
            var entity = request.ConvertTo<CatalogFieldValue>();
            return InTransaction(db =>
            {
                Logic.Update(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }
        public object Delete(DeleteCatalogFieldValue request)
        {
            var entity = request.ConvertTo<CatalogFieldValue>();
            return InTransaction(db =>
            {
                Logic.Remove(entity);
                return new CommonResponse();
            });
        }
        public object Delete(DeleteByIdCatalogFieldValue request)
        {
            var entity = request.ConvertTo<CatalogFieldValue>();
            return InTransaction(db =>
            {
                Logic.RemoveById(entity.Id);
                return new CommonResponse();
            });
        }
        #endregion
        #region Endpoints - Specific
        #endregion
    }
    #region Specific
    #endregion
    #region Generic Read Only
    [Route("/CatalogFieldValue", "GET")]
    public class GetAllCatalogFieldValues : GetAll<CatalogFieldValue> { }
    [Route("/CatalogFieldValue/{Id}", "GET")]
    public class GetCatalogFieldValueById : GetSingleById<CatalogFieldValue> { }
    [Route("/CatalogFieldValue/GetSingleWhere", "GET")]
    [Route("/CatalogFieldValue/GetSingleWhere/{Property}/{Value}", "GET")]
    public class GetCatalogFieldValueWhere : GetSingleWhere<CatalogFieldValue> { }
    [Route("/CatalogFieldValue/GetPaged/{Limit}/{Page}", "GET")]
    public class GetPagedCatalogFieldValues : QueryDb<CatalogFieldValue>
    {
        public string FilterGeneral { get; set; }
        //public long? FilterUser { get; set; }
        public int Limit { get; set; }
        public int Page { get; set; }
        public bool RequiresKeysInJsons { get; set; }
    }
    [Route("/CatalogFieldValue/CurrentDataToDBSeed", "GET")]
    public class CurrentDataToDBSeedCatalogFieldValue { }
    #endregion
    #region Generic Write
    [Route("/CatalogFieldValue/CreateInstance", "POST")]
    public class CreateCatalogFieldValueInstance : CatalogFieldValue { }
    [Route("/CatalogFieldValue", "POST")]
    public class InsertCatalogFieldValue : CatalogFieldValue { }
    [Route("/CatalogFieldValue", "PUT")]
    public class UpdateCatalogFieldValue : CatalogFieldValue { }
    [Route("/CatalogFieldValue", "DELETE")]
    public class DeleteCatalogFieldValue : CatalogFieldValue { }
    [Route("/CatalogFieldValue/{Id}", "DELETE")]
    public class DeleteByIdCatalogFieldValue : CatalogFieldValue { }
    #endregion
}
