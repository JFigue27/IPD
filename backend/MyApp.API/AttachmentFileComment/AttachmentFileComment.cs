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
    [Alias("attachment_file_comment")]
    [Table("attachment_file_comments")]
    public class AttachmentFileComment : BaseEntity
    {
        public AttachmentFileComment()
        {

        }

        public string ApproverName { get; set; }
        public string Comment { get; set; }

        [Reference]
        public MdcAttachmentFile MdcAttachmentFile { get; set; }
        public long? MdcAttachmentFileId { get; set; }

    }
}
