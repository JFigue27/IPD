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
    public class MDCLogic : DocumentLogic<MDC>, IDocumentLogicAsync<MDC>
    {
        public IAuthRepository AuthRepository { get; set; }
        public TokenLogic TokenLogic { get; set; }

        public override void Init(IDbConnection db, IAuthSession auth, IRequest request, IAppSettings appSettings)
        {
            base.Init(db, auth, request, appSettings);
            TokenLogic.Init(db, auth, request, appSettings);
        }

        public void ChangeStatus(string ControlNumber)
        {

            var controlNumberFound = GetAll().FirstOrDefault(a => a.ControlNumber == ControlNumber);

            if (controlNumberFound == null)
                throw new KnownError("User or Password doesn't exist");

            // var token = TokenLogic.GetNew("Account", controlNumberFound.Id);

            var templete = File.ReadAllText("~/../MyApp.Api/".MapHostAbsolutePath().CombineWith("MDC/Approved.html"));
            var context = new ScriptContext
            {
                Args = {
                    ["resetLink"] = $"http://localhost:3000/reset-password?token=21215"
                }
            }.Init();
            var body = context.RenderScript(templete);

            var emailService = new EmailService
            {
                // From = Auth.Email, // From appSettings
                Subject = "Reset Password.",
                Body = body
            };

            // emailService.To.Add(accountFound.Email);
            emailService.To.Add("josejaime.figueroa@molex.com");

            try
            {
                emailService.SendMail();
            }
            catch (Exception ex)
            {
                throw new KnownError("Could not send email:\n" + ex.Message);
            }
        }

    }
}
