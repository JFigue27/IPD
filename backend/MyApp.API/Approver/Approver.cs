using Reusable.Attachments;
using Reusable.CRUD.Contract;
using Reusable.CRUD.Entities;
using Reusable.CRUD.JsonEntities;
using ServiceStack;
using ServiceStack.DataAnnotations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Logic.Entities
{
    [Alias("approver")]
    [Table("approvers")]
    public class Approver : BaseDocument
    {
        public Approver()
        {

            Deadline = DateTimeOffset.Now;
        }

        public DateTimeOffset Deadline { get; set; }
        public string ApproverName { get; set; }
        public string DepartmentArea { get; set; }
        public string ApprovalStatus { get; set; }
        public string ApprovalComments { get; set; }

        [Reference]
        public MDC MDC { get; set; }
        public long? MDCId { get; set; }

    }
}
