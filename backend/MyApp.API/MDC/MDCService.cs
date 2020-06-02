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
    public class MDCService : BaseService<MDCLogic>
    {
        #region Endpoints - Generic Read Only
        public object Get(GetAllMDCs request) => WithDb(db => Logic.GetAll());

        public object Get(GetMDCById request) => WithDb(db => Logic.GetById(request.Id));

        public object Get(GetMDCWhere request) => WithDb(db => Logic.GetSingleWhere(request.Property, request.Value));

        public object Get(GetPagedMDCs request)
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

        public object Get(CurrentDataToDBSeedMDCs request)
        {
            WithDb(db => Logic.CurrentDataToDBSeed());
            return new CommonResponse().Success();
        }
        #endregion

        #region Endpoints - Generic Write
        public object Post(CreateMDCInstance request)
        {
            return WithDb(db =>
            {
                var entity = request.ConvertTo<MDC>();
                return new HttpResult(new CommonResponse(Logic.CreateInstance(entity)))
                {
                    ResultScope = () => JsConfig.With(new Config { IncludeNullValues = true })
                };
            });
        }

        public object Post(InsertMDC request)
        {
            var entity = request.ConvertTo<MDC>();
            return InTransaction(db =>
            {
                Logic.Add(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }

        public object Put(UpdateMDC request)
        {
            var entity = request.ConvertTo<MDC>();
            return InTransaction(db =>
            {
                Logic.Update(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }
        public object Delete(DeleteMDC request)
        {
            var entity = request.ConvertTo<MDC>();
            return InTransaction(db =>
            {
                Logic.Remove(entity);
                return new CommonResponse();
            });
        }
        public object Delete(DeleteByIdMDC request)
        {
            var entity = request.ConvertTo<MDC>();
            return InTransaction(db =>
            {
                Logic.RemoveById(entity.Id);
                return new CommonResponse();
            });
        }
        #endregion

        #region Endpoints - Generic Document
        virtual public object Post(MakeMDCRevision request)
        {
            var entity = request.ConvertTo<MDC>();
            return InTransaction(db =>
            {
                Logic.MakeRevision(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }

        virtual public object Post(CheckoutMDC request)
        {
            var entity = request.ConvertTo<MDC>();
            return InTransaction(db =>
            {
                Logic.Checkout(entity.Id);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }

        virtual public object Post(CancelCheckoutMDC request)
        {
            var entity = request.ConvertTo<MDC>();
            return InTransaction(db =>
            {
                Logic.CancelCheckout(entity.Id);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }

        virtual public object Post(CheckinMDC request)
        {
            var entity = request.ConvertTo<MDC>();
            return InTransaction(db =>
            {
                Logic.Checkin(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }

        virtual public object Post(CreateAndCheckoutMDC request)
        {
            var entity = request.ConvertTo<MDC>();
            return InTransaction(db =>
            {
                Logic.CreateAndCheckout(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }
        #endregion

        #region Endpoints - Specific

        public object Post(ChangeStatus request)
        {
            return InTransaction(db =>
            {
                Logic.ChangeStatus(request.ControlNumber);
                return new CommonResponse();
            });
        }

        #endregion

    }

    #region Specific

    [Route("/Mdc/ChangeStatus", "POST")]
    public class ChangeStatus
    {
        public string ControlNumber { get; set; }
    }

    #endregion

    #region Generic Read Only
    [Route("/MDC", "GET")]
    public class GetAllMDCs : GetAll<MDC> { }

    [Route("/MDC/{Id}", "GET")]
    public class GetMDCById : GetSingleById<MDC> { }

    [Route("/MDC/GetSingleWhere", "GET")]
    [Route("/MDC/GetSingleWhere/{Property}/{Value}", "GET")]
    public class GetMDCWhere : GetSingleWhere<MDC> { }

    [Route("/MDC/GetPaged/{Limit}/{Page}", "GET")]
    public class GetPagedMDCs : QueryDb<MDC>
    {
        public string FilterGeneral { get; set; }
        //public long? FilterUser { get; set; }
        public int Limit { get; set; }
        public int Page { get; set; }

        public bool RequiresKeysInJsons { get; set; }
    }

    [Route("/MDC/CurrentDataToDBSeed", "GET")]
    public class CurrentDataToDBSeedMDCs { }
    #endregion

    #region Generic Write
    [Route("/MDC/CreateInstance", "POST")]
    public class CreateMDCInstance : MDC { }

    [Route("/MDC", "POST")]
    public class InsertMDC : MDC { }

    [Route("/MDC", "PUT")]
    public class UpdateMDC : MDC { }

    [Route("/MDC", "DELETE")]
    public class DeleteMDC : MDC { }

    [Route("/MDC/{Id}", "DELETE")]
    public class DeleteByIdMDC : MDC { }
    #endregion

    #region Generic Documents
    [Route("/MDC/MakeRevision", "POST")]
    public class MakeMDCRevision : MDC { }

    [Route("/MDC/Checkout/{Id}", "POST")]
    public class CheckoutMDC : MDC { }

    [Route("/MDC/CancelCheckout/{Id}", "POST")]
    public class CancelCheckoutMDC : MDC { }

    [Route("/MDC/Checkin", "POST")]
    public class CheckinMDC : MDC { }

    [Route("/MDC/CreateAndCheckout", "POST")]
    public class CreateAndCheckoutMDC : MDC { }
    #endregion
}