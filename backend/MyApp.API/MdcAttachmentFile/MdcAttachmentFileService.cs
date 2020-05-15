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
    public class MdcAttachmentFileService : BaseService<MdcAttachmentFileLogic>
    {
        #region Endpoints - Generic Read Only
        public object Get(GetAllMdcAttachmentFiles request) => WithDb(db => Logic.GetAll());

        public object Get(GetMdcAttachmentFileById request) => WithDb(db => Logic.GetById(request.Id));

        public object Get(GetMdcAttachmentFileWhere request) => WithDb(db => Logic.GetSingleWhere(request.Property, request.Value));

        public object Get(GetPagedMdcAttachmentFiles request)
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

        public object Get(CurrentDataToDBSeedMdcAttachmentFiles request)
        {
            WithDb(db => Logic.CurrentDataToDBSeed());
            return new CommonResponse().Success();
        }
        #endregion

        #region Endpoints - Generic Write
        public object Post(CreateMdcAttachmentFileInstance request)
        {
            return WithDb(db =>
            {
                var entity = request.ConvertTo<MdcAttachmentFile>();
                return new HttpResult(new CommonResponse(Logic.CreateInstance(entity)))
                {
                    ResultScope = () => JsConfig.With(new Config { IncludeNullValues = true })
                };
            });
        }

        public object Post(InsertMdcAttachmentFile request)
        {
            var entity = request.ConvertTo<MdcAttachmentFile>();
            return InTransaction(db =>
            {
                Logic.Add(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }

        public object Put(UpdateMdcAttachmentFile request)
        {
            var entity = request.ConvertTo<MdcAttachmentFile>();
            return InTransaction(db =>
            {
                Logic.Update(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }
        public object Delete(DeleteMdcAttachmentFile request)
        {
            var entity = request.ConvertTo<MdcAttachmentFile>();
            return InTransaction(db =>
            {
                Logic.Remove(entity);
                return new CommonResponse();
            });
        }
        public object Delete(DeleteByIdMdcAttachmentFile request)
        {
            var entity = request.ConvertTo<MdcAttachmentFile>();
            return InTransaction(db =>
            {
                Logic.RemoveById(entity.Id);
                return new CommonResponse();
            });
        }
        #endregion

        #region Endpoints - Generic Document
        virtual public object Post(MakeMdcAttachmentFileRevision request)
        {
            var entity = request.ConvertTo<MdcAttachmentFile>();
            return InTransaction(db =>
            {
                Logic.MakeRevision(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }

        virtual public object Post(CheckoutMdcAttachmentFile request)
        {
            var entity = request.ConvertTo<MdcAttachmentFile>();
            return InTransaction(db =>
            {
                Logic.Checkout(entity.Id);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }

        virtual public object Post(CancelCheckoutMdcAttachmentFile request)
        {
            var entity = request.ConvertTo<MdcAttachmentFile>();
            return InTransaction(db =>
            {
                Logic.CancelCheckout(entity.Id);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }

        virtual public object Post(CheckinMdcAttachmentFile request)
        {
            var entity = request.ConvertTo<MdcAttachmentFile>();
            return InTransaction(db =>
            {
                Logic.Checkin(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }

        virtual public object Post(CreateAndCheckoutMdcAttachmentFile request)
        {
            var entity = request.ConvertTo<MdcAttachmentFile>();
            return InTransaction(db =>
            {
                Logic.CreateAndCheckout(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }
        #endregion

    }

    #region Generic Read Only
    [Route("/MdcAttachmentFile", "GET")]
    public class GetAllMdcAttachmentFiles : GetAll<MdcAttachmentFile> { }

    [Route("/MdcAttachmentFile/{Id}", "GET")]
    public class GetMdcAttachmentFileById : GetSingleById<MdcAttachmentFile> { }

    [Route("/MdcAttachmentFile/GetSingleWhere", "GET")]
    [Route("/MdcAttachmentFile/GetSingleWhere/{Property}/{Value}", "GET")]
    public class GetMdcAttachmentFileWhere : GetSingleWhere<MdcAttachmentFile> { }

    [Route("/MdcAttachmentFile/GetPaged/{Limit}/{Page}", "GET")]
    public class GetPagedMdcAttachmentFiles : QueryDb<MdcAttachmentFile>
    {
        public string FilterGeneral { get; set; }
        //public long? FilterUser { get; set; }
        public int Limit { get; set; }
        public int Page { get; set; }

        public bool RequiresKeysInJsons { get; set; }
    }

    [Route("/MdcAttachmentFile/CurrentDataToDBSeed", "GET")]
    public class CurrentDataToDBSeedMdcAttachmentFiles { }
    #endregion

    #region Generic Write
    [Route("/MdcAttachmentFile/CreateInstance", "POST")]
    public class CreateMdcAttachmentFileInstance : MdcAttachmentFile { }

    [Route("/MdcAttachmentFile", "POST")]
    public class InsertMdcAttachmentFile : MdcAttachmentFile { }

    [Route("/MdcAttachmentFile", "PUT")]
    public class UpdateMdcAttachmentFile : MdcAttachmentFile { }

    [Route("/MdcAttachmentFile", "DELETE")]
    public class DeleteMdcAttachmentFile : MdcAttachmentFile { }

    [Route("/MdcAttachmentFile/{Id}", "DELETE")]
    public class DeleteByIdMdcAttachmentFile : MdcAttachmentFile { }
    #endregion

    #region Generic Documents
    [Route("/MdcAttachmentFile/MakeRevision", "POST")]
    public class MakeMdcAttachmentFileRevision : MdcAttachmentFile { }

    [Route("/MdcAttachmentFile/Checkout/{Id}", "POST")]
    public class CheckoutMdcAttachmentFile : MdcAttachmentFile { }

    [Route("/MdcAttachmentFile/CancelCheckout/{Id}", "POST")]
    public class CancelCheckoutMdcAttachmentFile : MdcAttachmentFile { }

    [Route("/MdcAttachmentFile/Checkin", "POST")]
    public class CheckinMdcAttachmentFile : MdcAttachmentFile { }

    [Route("/MdcAttachmentFile/CreateAndCheckout", "POST")]
    public class CreateAndCheckoutMdcAttachmentFile : MdcAttachmentFile { }
    #endregion
}