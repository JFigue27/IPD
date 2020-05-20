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
    [Alias("mdc_attachment_file")]
    [Table("mdc_attachment_files")]
    public class MdcAttachmentFile : BaseDocument
    {
        public MdcAttachmentFile()
        {

            PeriodicReview = DateTimeOffset.Now;
            ReleaseDate = DateTimeOffset.Now;
            Attachments = new List<Attachment>();
        }

        public string MdcAttachment { get; set; }
        public string FileVersion { get; set; }
        public DateTimeOffset PeriodicReview { get; set; }
        public DateTimeOffset ReleaseDate { get; set; }
        public string ApprovalFileStatus { get; set; }
        public string AttachmentsFolder { get; set; }

        [NotMapped]
        [Ignore]
        public List<Attachment> Attachments { get; set; }

        [Reference]
        public List<AttachmentFileComment> AttachmentFileComments { get; set; }

        [Reference]
        public MDC MDC { get; set; }
        public long? MDCId { get; set; }

    }
}
