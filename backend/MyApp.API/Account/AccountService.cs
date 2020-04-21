using MyApp.Logic.Entities;
using MyApp.Logic;
using Reusable.Rest;
using ServiceStack;
using ServiceStack.OrmLite;
using System;
using System.Threading.Tasks;
using ServiceStack.Text;
using Reusable.Rest.Implementations.SS;
using ServiceStack.Auth;

namespace MyApp.API
{
    // [Authenticate]
    // [RequiredRole(ApplyTo.Post | ApplyTo.Put | ApplyTo.Delete, "admin")]

    public class AccountService : BaseService<AccountLogic>
    {
        #region Endpoints - Generic Read Only
        public object Get(GetAllAccounts request)
        {
            return WithDb(db => Logic.GetAll());
        }
        public object Get(GetAccountById request)
        {
            return WithDb(db => Logic.GetById(request.Id));
        }
        public object Get(GetAccountWhere request)
        {
            return WithDb(db => Logic.GetSingleWhere(request.Property, request.Value));
        }
        public object Get(GetPagedAccounts request)
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
        public object Get(CurrentDataToDBSeedAccounts request)
        {
            WithDb(db => Logic.CurrentDataToDBSeed());
            return new CommonResponse().Success();
        }
        #endregion
        #region Endpoints - Generic Write

        [RequiredRole("admin")]
        public object Post(CreateAccountInstance request)
        {
            return WithDb(db =>
            {
                var entity = request.ConvertTo<Account>();
                return new HttpResult(new CommonResponse(Logic.CreateInstance(entity)))
                {
                    ResultScope = () => JsConfig.With(new Config { IncludeNullValues = true })
                };
            });
        }

        [RequiredRole("admin")]
        public object Post(InsertAccount request)
        {
            var entity = request.ConvertTo<Account>();
            return InTransaction(db =>
            {
                Logic.Add(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }

        [RequiredRole("admin")]
        public object Put(UpdateAccount request)
        {
            var entity = request.ConvertTo<Account>();
            return InTransaction(db =>
            {
                Logic.Update(entity);
                return new CommonResponse(Logic.GetById(entity.Id));
            });
        }

        [RequiredRole("admin")]
        public object Delete(DeleteAccount request)
        {
            var entity = request.ConvertTo<Account>();
            return InTransaction(db =>
            {
                Logic.Remove(entity);
                return new CommonResponse();
            });
        }

        [RequiredRole("admin")]
        public object Delete(DeleteByIdAccount request)
        {
            var entity = request.ConvertTo<Account>();
            return InTransaction(db =>
            {
                Logic.RemoveById(entity.Id);
                return new CommonResponse();
            });
        }
        #endregion
        #region Endpoints - Specific

        public object Post(EmailForgotPassword request)
        {
            return InTransaction(db =>
            {
                Logic.EmailForgotPassword(request.UserName);
                return new CommonResponse();
            });
        }

        public object Post(EmailResetPassword request)
        {
            return InTransaction(db =>
            {
                Logic.EmailResetPassword(request.Token, request.Password, request.ConfirmPassword);
                return new CommonResponse();
            });
        }

        [Authenticate]
        public object Post(ResetCurrentPassword request)
        {
            return InTransaction(db =>
            {
                Logic.ResetCurrentPassword(request.CurrentPassword, request.Password, request.ConfirmPassword);
                return new CommonResponse();
            });
        }

        #endregion
    }
    #region Specific

    [Route("/Account/EmailForgotPassword", "POST")]
    public class EmailForgotPassword
    {
        public string UserName { get; set; }
    }

    [Route("/Account/EmailResetPassword", "POST")]
    public class EmailResetPassword
    {
        public string Token { get; set; }
        public string Password { get; set; }

        public string ConfirmPassword { get; set; }
    }
    [Route("/Account/ResetCurrentPassword", "POST")]
    public class ResetCurrentPassword
    {
        public string CurrentPassword { get; set; }
        public string Password { get; set; }

        public string ConfirmPassword { get; set; }
    }

    #endregion
    #region Generic Read Only
    [Route("/Account", "GET")]
    public class GetAllAccounts : GetAll<Account> { }
    [Route("/Account/{Id}", "GET")]
    public class GetAccountById : GetSingleById<Account> { }
    [Route("/Account/GetSingleWhere", "GET")]
    [Route("/Account/GetSingleWhere/{Property}/{Value}", "GET")]
    public class GetAccountWhere : GetSingleWhere<Account> { }
    [Route("/Account/GetPaged/{Limit}/{Page}", "GET")]
    public class GetPagedAccounts : QueryDb<Account>
    {
        public string FilterGeneral { get; set; }
        //public long? FilterUser { get; set; }
        public int Limit { get; set; }
        public int Page { get; set; }
        public bool RequiresKeysInJsons { get; set; }
    }
    [Route("/Account/CurrentDataToDBSeed", "GET")]
    public class CurrentDataToDBSeedAccounts { }
    #endregion
    #region Generic Write
    [Route("/Account/CreateInstance", "POST")]
    public class CreateAccountInstance : Account { }
    [Route("/Account", "POST")]
    public class InsertAccount : Account { }
    [Route("/Account", "PUT")]
    public class UpdateAccount : Account { }
    [Route("/Account", "DELETE")]
    public class DeleteAccount : Account { }
    [Route("/Account/{Id}", "DELETE")]
    public class DeleteByIdAccount : Account { }
    #endregion
}
