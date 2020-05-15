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
    public class AttachmentFileCommentService : BaseService<AttachmentFileCommentLogic>
    {
        #region Endpoints - Generic Read Only
        public object Get(GetAllAttachmentFileComments request) => WithDb(db => Logic.GetAll());

        public object Get(GetAttachmentFileCommentById request) => WithDb(db => Logic.GetById(request.Id));

        public object Get(GetAttachmentFileCommentWhere request) => WithDb(db => Logic.GetSingleWhere(request.Property, request.Value));

        public object Get(GetPagedAttachmentFileComments request)
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

        public object Get(CurrentDataToDBSeedAttachmentFileComments request)
        {
            WithDb(db => Logic.CurrentDataToDBSeed());
            return new CommonResponse().Success();
        }
        #endregion

        #region Endpoints - Generic Write
        public object Post(CreateAttachmentFileCommentInstance request)
        {
            return WithDb(db =>
            {
                var entity = request.ConvertTo<AttachmentFileComment>();
                return new HttpResult(new CommonResponse(Logic.CreateInstance(entity)))
                {
                    ResultScope = () => JsConfig.With(new Config { IncludeNullValues = true })
                };
            });
        }

        public object Post(InsertAttachmentFileComment request)
        {
            var entity = request.ConvertTo<AttachmentFileComment>();
            return InTransaction(db =>
            {
                Logic.Add(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }

        public object Put(UpdateAttachmentFileComment request)
        {
            var entity = request.ConvertTo<AttachmentFileComment>();
            return InTransaction(db =>
            {
                Logic.Update(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }
        public object Delete(DeleteAttachmentFileComment request)
        {
            var entity = request.ConvertTo<AttachmentFileComment>();
            return InTransaction(db =>
            {
                Logic.Remove(entity);
                return new CommonResponse();
            });
        }
        public object Delete(DeleteByIdAttachmentFileComment request)
        {
            var entity = request.ConvertTo<AttachmentFileComment>();
            return InTransaction(db =>
            {
                Logic.RemoveById(entity.Id);
                return new CommonResponse();
            });
        }
        #endregion

    }

    #region Generic Read Only
    [Route("/AttachmentFileComment", "GET")]
    public class GetAllAttachmentFileComments : GetAll<AttachmentFileComment> { }

    [Route("/AttachmentFileComment/{Id}", "GET")]
    public class GetAttachmentFileCommentById : GetSingleById<AttachmentFileComment> { }

    [Route("/AttachmentFileComment/GetSingleWhere", "GET")]
    [Route("/AttachmentFileComment/GetSingleWhere/{Property}/{Value}", "GET")]
    public class GetAttachmentFileCommentWhere : GetSingleWhere<AttachmentFileComment> { }

    [Route("/AttachmentFileComment/GetPaged/{Limit}/{Page}", "GET")]
    public class GetPagedAttachmentFileComments : QueryDb<AttachmentFileComment>
    {
        public string FilterGeneral { get; set; }
        //public long? FilterUser { get; set; }
        public int Limit { get; set; }
        public int Page { get; set; }

        public bool RequiresKeysInJsons { get; set; }
    }

    [Route("/AttachmentFileComment/CurrentDataToDBSeed", "GET")]
    public class CurrentDataToDBSeedAttachmentFileComments { }
    #endregion

    #region Generic Write
    [Route("/AttachmentFileComment/CreateInstance", "POST")]
    public class CreateAttachmentFileCommentInstance : AttachmentFileComment { }

    [Route("/AttachmentFileComment", "POST")]
    public class InsertAttachmentFileComment : AttachmentFileComment { }

    [Route("/AttachmentFileComment", "PUT")]
    public class UpdateAttachmentFileComment : AttachmentFileComment { }

    [Route("/AttachmentFileComment", "DELETE")]
    public class DeleteAttachmentFileComment : AttachmentFileComment { }

    [Route("/AttachmentFileComment/{Id}", "DELETE")]
    public class DeleteByIdAttachmentFileComment : AttachmentFileComment { }
    #endregion

}