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
    public class ApproverService : BaseService<ApproverLogic>
    {
        #region Endpoints - Generic Read Only
        public object Get(GetAllApprovers request) => WithDb(db => Logic.GetAll());

        public object Get(GetApproverById request) => WithDb(db => Logic.GetById(request.Id));

        public object Get(GetApproverWhere request) => WithDb(db => Logic.GetSingleWhere(request.Property, request.Value));

        public object Get(GetPagedApprovers request)
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

        public object Get(CurrentDataToDBSeedApprovers request)
        {
            WithDb(db => Logic.CurrentDataToDBSeed());
            return new CommonResponse().Success();
        }
        #endregion

        #region Endpoints - Generic Write
        public object Post(CreateApproverInstance request)
        {
            return WithDb(db =>
            {
                var entity = request.ConvertTo<Approver>();
                return new HttpResult(new CommonResponse(Logic.CreateInstance(entity)))
                {
                    ResultScope = () => JsConfig.With(new Config { IncludeNullValues = true })
                };
            });
        }

        public object Post(InsertApprover request)
        {
            var entity = request.ConvertTo<Approver>();
            return InTransaction(db =>
            {
                Logic.Add(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }

        public object Put(UpdateApprover request)
        {
            var entity = request.ConvertTo<Approver>();
            return InTransaction(db =>
            {
                Logic.Update(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }
        public object Delete(DeleteApprover request)
        {
            var entity = request.ConvertTo<Approver>();
            return InTransaction(db =>
            {
                Logic.Remove(entity);
                return new CommonResponse();
            });
        }
        public object Delete(DeleteByIdApprover request)
        {
            var entity = request.ConvertTo<Approver>();
            return InTransaction(db =>
            {
                Logic.RemoveById(entity.Id);
                return new CommonResponse();
            });
        }
        #endregion

        #region Endpoints - Generic Document
        virtual public object Post(MakeApproverRevision request)
        {
            var entity = request.ConvertTo<Approver>();
            return InTransaction(db =>
            {
                Logic.MakeRevision(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }

        virtual public object Post(CheckoutApprover request)
        {
            var entity = request.ConvertTo<Approver>();
            return InTransaction(db =>
            {
                Logic.Checkout(entity.Id);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }

        virtual public object Post(CancelCheckoutApprover request)
        {
            var entity = request.ConvertTo<Approver>();
            return InTransaction(db =>
            {
                Logic.CancelCheckout(entity.Id);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }

        virtual public object Post(CheckinApprover request)
        {
            var entity = request.ConvertTo<Approver>();
            return InTransaction(db =>
            {
                Logic.Checkin(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }

        virtual public object Post(CreateAndCheckoutApprover request)
        {
            var entity = request.ConvertTo<Approver>();
            return InTransaction(db =>
            {
                Logic.CreateAndCheckout(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }
        #endregion

    }

    #region Generic Read Only
    [Route("/Approver", "GET")]
    public class GetAllApprovers : GetAll<Approver> { }

    [Route("/Approver/{Id}", "GET")]
    public class GetApproverById : GetSingleById<Approver> { }

    [Route("/Approver/GetSingleWhere", "GET")]
    [Route("/Approver/GetSingleWhere/{Property}/{Value}", "GET")]
    public class GetApproverWhere : GetSingleWhere<Approver> { }

    [Route("/Approver/GetPaged/{Limit}/{Page}", "GET")]
    public class GetPagedApprovers : QueryDb<Approver>
    {
        public string FilterGeneral { get; set; }
        //public long? FilterUser { get; set; }
        public int Limit { get; set; }
        public int Page { get; set; }

        public bool RequiresKeysInJsons { get; set; }
    }

    [Route("/Approver/CurrentDataToDBSeed", "GET")]
    public class CurrentDataToDBSeedApprovers { }
    #endregion

    #region Generic Write
    [Route("/Approver/CreateInstance", "POST")]
    public class CreateApproverInstance : Approver { }

    [Route("/Approver", "POST")]
    public class InsertApprover : Approver { }

    [Route("/Approver", "PUT")]
    public class UpdateApprover : Approver { }

    [Route("/Approver", "DELETE")]
    public class DeleteApprover : Approver { }

    [Route("/Approver/{Id}", "DELETE")]
    public class DeleteByIdApprover : Approver { }
    #endregion

    #region Generic Documents
    [Route("/Approver/MakeRevision", "POST")]
    public class MakeApproverRevision : Approver { }

    [Route("/Approver/Checkout/{Id}", "POST")]
    public class CheckoutApprover : Approver { }

    [Route("/Approver/CancelCheckout/{Id}", "POST")]
    public class CancelCheckoutApprover : Approver { }

    [Route("/Approver/Checkin", "POST")]
    public class CheckinApprover : Approver { }

    [Route("/Approver/CreateAndCheckout", "POST")]
    public class CreateAndCheckoutApprover : Approver { }
    #endregion
}