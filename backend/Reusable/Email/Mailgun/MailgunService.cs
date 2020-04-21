using Reusable.Attachments;
using ServiceStack.Configuration;
using System.Collections.Generic;
using RestSharp;
using System;
using RestSharp.Authenticators;
using ServiceStack.Logging;
using ServiceStack;

namespace Reusable.EmailServices
{
    public class MailgunService : IEmailService
    {
        public static ILog Log = LogManager.GetLogger("MyApp");

        public MailgunService()
        {
            To = new List<string>();
            Cc = new List<string>();
            Bcc = new List<string>();
            TemplateParameters = new Dictionary<string, object>();

            From = AppSettings.Get<string>("mailgun.from");
            API_KEY = AppSettings.Get<string>("mailgun.api.key");

            var url = AppSettings.Get<string>("mailgun.api.url");
            if (!string.IsNullOrWhiteSpace(url))
                Client = new RestClient
                {
                    BaseUrl = new Uri(url),
                    Authenticator = new HttpBasicAuthenticator("api", API_KEY)
                };
        }

        public static IAppSettings AppSettings { get; set; }

        public string From { get; set; }
        public string FromPassword { get; set; }
        public string API_KEY { get; set; }

        public List<string> To { get; set; }
        public List<string> Cc { get; set; }
        public List<string> Bcc { get; set; }
        public string Template { get; set; }
        public Dictionary<string, object> TemplateParameters { get; set; }

        public string Subject { get; set; }
        public string Body { get; set; }

        RestClient Client;

        public string AttachmentsFolder { get; set; }

        public void SendMail()
        {
            if (Client == null)
            {
                Log.Error($"Mailgun Email was not sent. Check AppSettings. By: [{From}] to:[{To.Join(", ")}] cc:[{Cc.Join(", ")}] bcc:[{Bcc.Join(", ")}] subject: [{Subject}]");
                return;
            }

            var request = new RestRequest();
            request.Method = Method.POST;

            request.AddParameter("from", From);

            foreach (var to in To)
                request.AddParameter("to", to);

            foreach (var cc in Cc)
                request.AddParameter("cc", cc);

            foreach (var bcc in Bcc)
                request.AddParameter("bcc", bcc);

            request.AddParameter("subject", Subject);

            string baseAttachmentsPath = AppSettings.Get<string>("EmailAttachments");
            var attachments = AttachmentsIO.getAttachmentsFromFolder(AttachmentsFolder, "EmailAttachments");
            foreach (var attachment in attachments)
            {
                string filePath = baseAttachmentsPath + attachment.Directory + "\\" + attachment.FileName;
                request.AddFile("attachment", filePath);
            }

            if (!string.IsNullOrWhiteSpace(Template))
            {
                request.AddParameter("template", Template);

                foreach (var param in TemplateParameters)
                    request.AddParameter($"v:{param.Key}", param.Value);
            }
            else
                request.AddParameter("html", Body);

            var response = Client.Execute(request);
            var content = response.Content;
            if (!response.IsSuccessful) throw new Exception(content);

            Log.Info($"Mailgun Email sent by: [{From}] to:[{To.Join(", ")}] cc:[{Cc.Join(", ")}] bcc:[{Bcc.Join(", ")}] subject: [{Subject}]");
        }
    }
}
