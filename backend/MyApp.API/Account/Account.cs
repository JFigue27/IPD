using Reusable.Attachments;
using Reusable.CRUD.Contract;
using Reusable.CRUD.Entities;
using Reusable.CRUD.JsonEntities;
using ServiceStack;
using ServiceStack.Auth;
using ServiceStack.DataAnnotations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace MyApp.Logic.Entities
{
    public class Account : UserAuth, IUserAuth, IEntity
    {
        public Account()
        {
        }
        public string Departments { get; set; }
        public string ManagerInDepartments { get; set; }

        [NotMapped]
        [Ignore]
        public string Password { get; set; }

        [NotMapped]
        [Ignore]
        public string ConfirmPassword { get; set; }

        [NotMapped]
        [Ignore]
        public bool UpdatePassword { get; set; }

        [NotMapped]
        [Ignore]
        public string EntityName { get; set; }

        [AutoIncrement]
        long IEntity.Id { get { return Id; } set { Id = (int)value; } }

        public object Clone() => MemberwiseClone();

    }
}
