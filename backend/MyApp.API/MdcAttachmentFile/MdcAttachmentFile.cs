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
    [Alias("Mdc Attachment File")]
    [Table("Mdc Attachment Files")]
    public class MdcAttachmentFile : BaseDocument
    {
        public MdcAttachmentFile()
        {

            PeriodicReview = DateTimeOffset.Now;
            ReleaseDate = DateTimeOffset.Now;
        }

        public string MdcAttachmentFile { get; set; }
        public string FileVersion { get; set; }
        public DateTimeOffset PeriodicReview { get; set; }
        public DateTimeOffset ReleaseDate { get; set; }
        public string ApprovalFileStatus { get; set; }

    }
}
