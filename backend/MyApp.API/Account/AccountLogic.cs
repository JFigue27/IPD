using MyApp.Logic.Entities;
using Reusable.Attachments;
using Reusable.CRUD.Contract;
using Reusable.CRUD.Entities;
using Reusable.CRUD.Implementations.SS;
using Reusable.CRUD.JsonEntities;
using Reusable.EmailServices;
using Reusable.Rest;
using ServiceStack;
using ServiceStack.Auth;
using ServiceStack.Configuration;
using ServiceStack.OrmLite;
using ServiceStack.Script;
using ServiceStack.Text;
using ServiceStack.Web;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
namespace MyApp.Logic
{
    public class AccountLogic : WriteLogic<Account>, ILogicWriteAsync<Account>
    {
        public IAuthRepository AuthRepository { get; set; }
        public TokenLogic TokenLogic { get; set; }

        public override void Init(IDbConnection db, IAuthSession auth, IRequest request, IAppSettings appSettings)
        {
            base.Init(db, auth, request, appSettings);
            TokenLogic.Init(db, auth, request, appSettings);
        }

        protected override SqlExpression<Account> OnGetList(SqlExpression<Account> query)
        {
            //var managersOnly = Request.QueryString.GetValues(null)?.Contains("Managers") ?? false;
            //if (managersOnly)
            //    query.Where($"len({query.Column<Account>(e => e.ManagerInDepartments)}) > 2");

            return base.OnGetList(query);
        }
        protected override void OnBeforeSaving(Account entity, OPERATION_MODE mode = OPERATION_MODE.NONE)
        {
            if (string.IsNullOrWhiteSpace(entity.UserName))
                throw new KnownError("Error. [UserName] field is required.");

            if (string.IsNullOrWhiteSpace(entity.Email))
                throw new KnownError("Error. [Email] field is required.");

            if (mode == OPERATION_MODE.ADD || entity.UpdatePassword)
            {
                if (string.IsNullOrWhiteSpace(entity.Password))
                    throw new KnownError("Error. [Password] field is required.");

                if (string.IsNullOrWhiteSpace(entity.ConfirmPassword))
                    throw new KnownError("Error. [Confirm Password] field is required.");

                if (entity.Password != entity.ConfirmPassword)
                    throw new KnownError("Error. [Password] does not match with [Confirm Password].");
            }

            if (mode == OPERATION_MODE.UPDATE)
            {
                if (entity.UpdatePassword)
                {
                    var account = AuthRepository.GetUserAuthByUserName(entity.UserName);
                    AuthRepository.UpdateUserAuth(account, account, entity.Password);
                }
            }

        }
        protected override void OnAfterSaving(Account entity, OPERATION_MODE mode = OPERATION_MODE.NONE)
        {
            if (mode == OPERATION_MODE.ADD)
            {
                var authProvider = (ApiKeyAuthProvider)AuthenticateService.GetAuthProvider(ApiKeyAuthProvider.Name);
                var apiKeys = authProvider.GenerateNewApiKeys(entity.Id.ToString());
                var apiRepo = (IManageApiKeys)AuthRepository;
                apiRepo.StoreAll(apiKeys);
            }

        }
        public override List<Account> AdapterOut(params Account[] entities)
        {
            foreach (var item in entities)
            {
                item.Password = null;
                item.ConfirmPassword = null;
                item.PasswordHash = null;
                item.UpdatePassword = false;

            }
            return entities.ToList();
        }

        public override Account Add(Account entity)
        {
            OnBeforeSaving(entity, OPERATION_MODE.ADD);

            entity = AuthRepository.CreateUserAuth(entity, entity.Password) as Account;

            OnAfterSaving(entity, OPERATION_MODE.ADD);

            CacheOnAdd(entity);

            return entity;
        }

        public override Account Update(Account entity)
        {
            OnBeforeSaving(entity, OPERATION_MODE.UPDATE);

            //Update only these fields:
            Db.Update<Account>(new
            {
                entity.Address,
                entity.Address2,
                entity.City,
                entity.Company,
                entity.Country,
                entity.Culture,
                entity.DisplayName,
                entity.Email,
                entity.FirstName,
                entity.FullName,
                entity.Gender,
                entity.Language,
                entity.LastName,
                entity.MailAddress,
                entity.Meta,
                entity.Nickname,
                entity.Permissions,
                entity.PhoneNumber,
                entity.PostalCode,
                ModifiedDate = DateTime.Now,
                entity.PrimaryEmail,
                entity.Roles,
                entity.UserName,
                entity.State,
                entity.TimeZone,
                entity.Departments,
                entity.ManagerInDepartments
            }, u => u.Id == entity.Id);
            OnAfterSaving(entity, OPERATION_MODE.UPDATE);

            CacheOnUpdate(entity);

            return entity;
        }

        public override List<Account> GetAll()
        {
            //var cache = Cache.Get<List<Account>>(CACHE_GET_ALL);
            //if (cache != null)
            //    return cache;

            var query = Db.From<Account>();

            OnGetList(query);

            query.OrderBy(e => e.UserName);

            var entities = Db.LoadSelect(query);

            //Cache.Set(CACHE_GET_ALL, entities);
            return entities;
        }

        public Account GetByUserName(string username)
        {
            var user = AuthRepository.GetUserAuthByUserName(username);
            return user as Account;
        }
        public void EmailForgotPassword(string EmailOrUserName)
        {

            var accountFound = GetAll().FirstOrDefault(a => a.UserName == EmailOrUserName || a.Email == EmailOrUserName);

            if (accountFound == null)
                throw new KnownError("Usuario o Correo no existente.");


            var token = TokenLogic.GetNew("Account", accountFound.Id);


            var templete = File.ReadAllText("~/../MyApp.Api/".MapHostAbsolutePath().CombineWith("Account/AccountResetPasswd.html"));
            var context = new ScriptContext
            {
                Args = {
                    ["resetLink"] = $"http://localhost:3000/reset-password?token={token.Value}"
                }
            }.Init();
            var body = context.RenderScript(templete);

            var emailService = new EmailService
            {
                // From = Auth.Email, // From appSettings
                Subject = "Reestablecer Contraseña.",
                Body = body
            };

            emailService.To.Add(accountFound.Email);

            try
            {
                emailService.SendMail();
            }
            catch (Exception ex)
            {
                throw new KnownError("Could not send email:\n" + ex.Message);
            }
        }

        public void EmailResetPassword(string token, string password, string confirmPassword)
        {
            var tokenFound = TokenLogic.GetAll().FirstOrDefault(t => t.Value == token);
            if (tokenFound == null)
                throw new KnownError("Sesion Invalida.");

            if (tokenFound.ExpiresAt < DateTimeOffset.Now)
                throw new KnownError("Sesion Invalida.");

            var accountFound = GetAll().FirstOrDefault(a => a.Id == tokenFound.ForeignKey);
            if (accountFound == null)
                throw new KnownError("Sesion Invalida.");


            accountFound.UpdatePassword = true;

            accountFound.Password = password;
            accountFound.ConfirmPassword = confirmPassword;
            Update(accountFound);

        }

    }
}
