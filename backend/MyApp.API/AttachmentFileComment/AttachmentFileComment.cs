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
    [Alias("Attachment File Comment")]
    [Table("Attachment File Comments")]
    public class AttachmentFileComment : BaseEntity
    {
        public AttachmentFileComment()
        {

        }

        public string ApproverName { get; set; }
        public string Comment { get; set; }

    }
}
