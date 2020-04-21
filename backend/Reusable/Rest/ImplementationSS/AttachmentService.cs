using Reusable.Attachments;
using Reusable.Utils;
using ServiceStack;
using ServiceStack.Configuration;
using ServiceStack.Logging;
using System;
using System.IO;
using System.Linq;
using System.Net;

namespace Reusable.Rest.Implementations.SS
{
    public class AttachmentService : Service
    {
        public static ILog Log = LogManager.GetLogger("MyApp");

        public IAppSettings AppSettings { get; set; }

        protected bool IsValidJSValue(string value)
        {
            if (string.IsNullOrWhiteSpace(value) || value == "null" || value == "undefined")
            {
                return false;
            }

            return true;
        }

        protected bool IsValidParam(string param)
        {
            //reserved and invalid params:
            if (new string[] {
                "limit",
                "perPage",
                "page",
                "filterGeneral",
                "itemsCount",
                "noCache",
                "totalItems",
                "parentKey",
                "parentField",
                "filterUser",
                null
            }.Contains(param))
                return false;

            return true;
        }

        public object Post(PostAttachment request)
        {
            var AttachmentKind = request.AttachmentKind;
            if (!IsValidJSValue(AttachmentKind))
                throw new KnownError("Invalid [Attachment Kind].");

            if (Request.Files.Length == 0)
                throw new HttpError(HttpStatusCode.BadRequest, "NoFile");

            var postedFile = Request.Files[0];
            string FileName = postedFile.FileName;

            string baseAttachmentsPath = AppSettings.Get<string>(AttachmentKind);
            if (string.IsNullOrWhiteSpace(baseAttachmentsPath))
                throw new KnownError("Invalid Attachment Kind.");

            bool useAttachmentsRelativePath = false;
            string sUseAttachmentsRelativePath = AppSettings.Get<string>("UseAttachmentsRelativePath");
            if (!string.IsNullOrWhiteSpace(sUseAttachmentsRelativePath) && bool.TryParse(sUseAttachmentsRelativePath, out bool bUseAttachmentsRelativePath))
                useAttachmentsRelativePath = bUseAttachmentsRelativePath;

            string currentPathAttachments;
            string folderName = request.TargetFolder;
            if (IsValidJSValue(folderName))
            {
                if (useAttachmentsRelativePath)
                    currentPathAttachments = "~/" + baseAttachmentsPath + folderName + @"/".MapHostAbsolutePath();
                else
                    currentPathAttachments = baseAttachmentsPath + folderName + @"\";

                if (!Directory.Exists(currentPathAttachments))
                    Directory.CreateDirectory(currentPathAttachments);
            }
            else
            {
                string folderPrefix = request.FolderPrefix;
                if (!IsValidJSValue(folderPrefix)) folderPrefix = "";

                do
                {
                    DateTime date = DateTime.Now;
                    folderName = folderPrefix + date.ToString("yy") + date.Month.ToString("d2") +
                                    date.Day.ToString("d2") + "_" + MD5HashGenerator.GenerateKey(date);

                    if (useAttachmentsRelativePath)
                        currentPathAttachments = "~/" + baseAttachmentsPath + folderName.MapHostAbsolutePath();
                    else
                        currentPathAttachments = baseAttachmentsPath + folderName;
                } while (Directory.Exists(currentPathAttachments));
                Directory.CreateDirectory(currentPathAttachments);
                if (useAttachmentsRelativePath)
                    currentPathAttachments += @"/";
                else
                    currentPathAttachments += @"\";
            }

            if (postedFile.ContentLength > 0)
            {
                Log.Info($"Attachment Posted: [{currentPathAttachments + Path.GetFileName(postedFile.FileName)}] by User: [{GetSession().UserName}]");
                postedFile.SaveTo(currentPathAttachments + Path.GetFileName(postedFile.FileName));
            }

            return new // FileId
            {
                FileName,
                AttachmentKind,
                Directory = folderName
            };
        }

        public object Post(DeleteAttachment request)
        {
            bool useAttachmentsRelativePath = false;
            string sUseAttachmentsRelativePath = AppSettings.Get<string>("UseAttachmentsRelativePath");
            if (!string.IsNullOrWhiteSpace(sUseAttachmentsRelativePath) && bool.TryParse(sUseAttachmentsRelativePath, out bool bUseAttachmentsRelativePath))
                useAttachmentsRelativePath = bUseAttachmentsRelativePath;

            string strDirectory = request.Directory;
            string strFileName = request.FileName;
            string appSettingsFolder = request.AttachmentKind;
            string baseAttachmentsPath = AppSettings.Get<string>(appSettingsFolder);

            string filePath;
            if (useAttachmentsRelativePath)
                filePath = "~/" + baseAttachmentsPath + strDirectory + "/" + strFileName.MapHostAbsolutePath();
            else
                filePath = baseAttachmentsPath + strDirectory + "\\" + strFileName;

            FileInfo file = new FileInfo(filePath);
            file.Delete();

            Log.Info($"Attachment Deleted: [{filePath}] by User: [{GetSession().UserName}]");

            return "OK";
        }

        public object Get(DownloadAttachment request)
        {
            bool useAttachmentsRelativePath = false;
            string sUseAttachmentsRelativePath = AppSettings.Get<string>("UseAttachmentsRelativePath");
            if (!string.IsNullOrWhiteSpace(sUseAttachmentsRelativePath) && bool.TryParse(sUseAttachmentsRelativePath, out bool bUseAttachmentsRelativePath))
            {
                useAttachmentsRelativePath = bUseAttachmentsRelativePath;
            }

            string strDirectory = request.Directory;
            string strFileName = request.FileName;
            string appSettingsFolder = request.AttachmentKind;
            string baseAttachmentsPath = AppSettings.Get<string>(appSettingsFolder);

            string filePath;
            if (useAttachmentsRelativePath)
            {
                filePath = "~/" + baseAttachmentsPath + strDirectory + "/" + strFileName.MapHostAbsolutePath();
            }
            else
            {
                filePath = baseAttachmentsPath + strDirectory + "\\" + strFileName;
            }

            var file = new FileInfo(filePath);

            Log.Info($"Attachment Download: [{filePath}] by User: [{GetSession().UserName}]");

            //Response.StatusCode = 200;
            //Response.AddHeader("Content-Type", "application/octet-stream");
            //Response.AddHeader("Content-Disposition", $"attachment;filename=\"{file.Name}\"");

            return new HttpResult(file, true)
            {
                //ContentType = "application/octet-stream",
                Headers =
                {
                    [HttpHeaders.ContentDisposition] = $"inline; filename=\"{file.Name}\""
                }
            };
        }

        public object Get(DownloadPublicAttachment request)
        {
            bool useAttachmentsRelativePath = false;
            string sUseAttachmentsRelativePath = AppSettings.Get<string>("UseAttachmentsRelativePath");
            if (!string.IsNullOrWhiteSpace(sUseAttachmentsRelativePath) && bool.TryParse(sUseAttachmentsRelativePath, out bool bUseAttachmentsRelativePath))
            {
                useAttachmentsRelativePath = bUseAttachmentsRelativePath;
            }

            string strDirectory = "Public";
            string strFileName = request.FileName;
            string appSettingsFolder = "Public";
            string baseAttachmentsPath = AppSettings.Get<string>(appSettingsFolder);

            string filePath;
            if (useAttachmentsRelativePath)
            {
                filePath = "~/" + baseAttachmentsPath + strDirectory + "/" + strFileName.MapHostAbsolutePath();
            }
            else
            {
                filePath = baseAttachmentsPath + strDirectory + "\\" + strFileName;
            }

            var file = new FileInfo(filePath);

            Log.Info($"Attachment Public Download: [{filePath}] by User: [{GetSession().UserName}]");

            return new HttpResult(file, true)
            {
                Headers =
                {
                    [HttpHeaders.ContentDisposition] = $"inline; filename=\"{file.Name}\""
                }
            };
        }
        public object Get(GetAvatarFromFolder request)
        {
            return AttachmentsIO.getAvatarsFromFolder(request.Directory, request.AttachmentKind);
        }


    }

    [Route("/Attachment", "POST")]
    public class PostAttachment
    {
        public string AttachmentKind { get; set; }
        public string FileName { get; set; }
        public string UploadedByUserName { get; set; }
        public string TargetFolder { get; set; }
        public string FolderPrefix { get; set; }
    }

    [Route("/Attachment/delete", "POST")]
    public class DeleteAttachment : Attachment
    { }

    [Route("/Attachment/download", "GET")]
    public class DownloadAttachment : IReturn<byte[]>
    {
        public string Directory { get; set; }
        public string FileName { get; set; }
        public string AttachmentKind { get; set; }
    }
    [Route("/Attachment/download/{FileName}", "GET")]
    public class DownloadPublicAttachment : IReturn<byte[]>
    {
        public string FileName { get; set; }
    }

    [Route("/Attachment/GetAvatarFromFolder/{AttachmentKind}/{Directory}", "GET")]
    public class GetAvatarFromFolder
    {
        public string Directory { get; set; }
        public string AttachmentKind { get; set; }
    }
}
