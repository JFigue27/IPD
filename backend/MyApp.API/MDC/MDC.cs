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
    [Alias("mdc")]
    [Table("mdcs")]
    public class MDC : BaseDocument
    {
        public MDC()
        {

            MDCDeadLine = DateTimeOffset.Now;
        }

        public string ControlNumber { get; set; }
        public string DocumentTitle { get; set; }
        public string ProcessType { get; set; }
        public DateTimeOffset MDCDeadLine { get; set; }
        public string DepartmentArea { get; set; }
        public string Owner { get; set; }
        public string ApprovalStatus { get; set; }
        public bool IsNeedTraining { get; set; }
        public string Comments { get; set; }

        [Reference]
        public List<Approver> Approvers { get; set; }

        [Reference]
        public List<MdcAttachmentFile> MdcAttachmentFiles { get; set; }

    }
}
