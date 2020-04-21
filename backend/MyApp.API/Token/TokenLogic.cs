using MyApp.Logic.Entities;
using Reusable.Attachments;
using Reusable.CRUD.Contract;
using Reusable.CRUD.Entities;
using Reusable.CRUD.Implementations.SS;
using Reusable.CRUD.JsonEntities;
using Reusable.EmailServices;
using Reusable.Rest;
using Reusable.Utils;
using ServiceStack;
using ServiceStack.Auth;
using ServiceStack.Configuration;
using ServiceStack.OrmLite;
using ServiceStack.Text;
using ServiceStack.Web;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;


namespace MyApp.Logic
{
    public class TokenLogic : WriteLogic<Token>, ILogicWriteAsync<Token>
    {









        protected override void OnBeforeSaving(Token entity, OPERATION_MODE mode = OPERATION_MODE.NONE)
        {
            entity.CreatedAt = DateTimeOffset.Now;
        }

        public Token GetNew(string ForeignType, long ForeignKey)
        {
            var token = new Token
            {
                ForeignKey = ForeignKey,
                ForeignType = ForeignType,
                Value = MD5HashGenerator.GenerateKey(DateTime.Now),
                ExpiresAt = DateTimeOffset.Now.AddMinutes(40)
            };

            return Add(token);
        }









    }
}
