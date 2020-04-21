using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Funq;
using ServiceStack;
using MyApp.API;
using ServiceStack.Text;
using ServiceStack.OrmLite;
using ServiceStack.Data;
using System.Collections.Generic;
using ServiceStack.Auth;
using Reusable.CRUD.Contract;
using Reusable.EmailServices;
using ServiceStack.Api.OpenApi;
using MyApp.Logic;
using Microsoft.Extensions.Hosting;
using ServiceStack.Admin;
using Reusable.Rest.Implementations.SS;
using System;
using ServiceStack.Configuration;
using MyApp.Logic.Entities;
using ServiceStack.Logging;
using ServiceStack.Logging.NLogger;
using ServiceStack.OrmLite.PostgreSQL;

namespace MyApp
{
    public class Startup : ModularStartup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public new void ConfigureServices(IServiceCollection services)
        {
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseServiceStack(new AppHost
            {
                AppSettings = new NetCoreAppSettings(Configuration)
            });
        }
    }

    public class AppHost : AppHostBase
    {
        public AppHost() : base("MyApp", typeof(MyServices).Assembly, typeof(PingService).Assembly)
        {
            Licensing.RegisterLicenseFromFileIfExists("ss_license.txt");
        }
        private IAuthSession SessionFactory()
        {
            return new AuthUserSession();
        }
        // Configure your AppHost with the necessary configuration and dependencies your App needs
        public override void Configure(Container container)
        {
            #region Logger
            LogManager.LogFactory = new NLogFactory();

            Plugins.Add(new SharpPagesFeature
            {
                MetadataDebugAdminRole = RoleNames.Admin
            });

            ILog Log = LogManager.GetLogger("MyApp");
            #endregion

            SetConfig(new HostConfig
            {
                DefaultRedirectPath = "/index.html",
                DebugMode = AppSettings.Get(nameof(HostConfig.DebugMode), false)
            });

            JsConfig.IncludeNullValues = false;
            JsConfig.ExcludeTypeInfo = true;
            JsConfig.DateHandler = DateHandler.ISO8601;
            JsConfig.TextCase = TextCase.PascalCase;
            JsConfig.TimeSpanHandler = TimeSpanHandler.StandardFormat;

            #region Database
            var connString = AppSettings.Get("dbConnectionString", "");
            if (connString == "%%CONN_STR%%")
                connString = AppSettings.Get("dbConnectionStringDev", "");
            IOrmLiteDialectProvider dbProvider;
            switch (AppSettings.Get("dbProvider", ""))
            {
                case "postgresql":
                    dbProvider = PostgreSqlDialect.Provider;
                    break;
                case "sqlserver2008":
                    dbProvider = SqlServerDialect.Provider;
                    break;
                case "sqlserver2012":
                    dbProvider = SqlServer2012Dialect.Provider;
                    break;
                case "sqlserver2014":
                    dbProvider = SqlServer2014Dialect.Provider;
                    break;
                case "sqlserver2016":
                    dbProvider = SqlServer2016Dialect.Provider;
                    break;
                case "sqlserver2017":
                    dbProvider = SqlServer2017Dialect.Provider;
                    break;
                default:
                    dbProvider = SqlServerDialect.Provider;
                    break;
            }

            var dbFactory = new OrmLiteConnectionFactory(connString, dbProvider);
            container.Register<IDbConnectionFactory>(dbFactory);

            // OrmLiteConfig.StringFilter = s => s.Trim();
            OrmLiteConfig.DialectProvider.StringSerializer = new JsonStringSerializer();
            MyNamingStrategy.AppSettings = AppSettings;
            dbProvider.NamingStrategy = new MyNamingStrategy();
            #endregion

            #region Plugins
            Plugins.Add(new CorsFeature(
                    allowedHeaders: "Content-Type, Allow, Authorization"));

            Plugins.Add(new OpenApiFeature()
            {
                ApiDeclarationFilter = declaration =>
                {
                    declaration.Info.Title = "MDC";
                    // declaration.Info.Contact = new ServiceStack.Api.OpenApi.Specification.OpenApiContact()
                    // {
                    //    Email = "inspiracode@gmail.com",
                    //    Name = "Alfredo Pacheco"
                    // };
                    declaration.Info.Description = "";
                },
                OperationFilter = (verb, op) =>
                {
                    switch (verb)
                    {
                        case "POST":
                            op.Parameters.RemoveAll(p => p.Name == "Id");
                            op.Parameters.RemoveAll(p => p.Name == "RowVersion");
                            break;
                        default:
                            break;
                    }
                    op.Parameters.RemoveAll(p => p.Name == "EntityName");
                    op.Parameters.RemoveAll(p => p.Name == "EF_State");
                }
            });

            Plugins.Add(new AutoQueryFeature
            {
                // MaxLimit = 100
            });

            Plugins.Add(new RequestLogsFeature());

            Plugins.Add(new AdminFeature());

            Plugins.Add(new ServerEventsFeature());
            // var rollbarSettings = AppSettings.Get<RollbarSettings>("RollbarPluginSettings");
            // Plugins.Add(new RollbarLoggerPlugin
            // {
            //     ApiKey = rollbarSettings.ApiKey,
            //     Enabled = rollbarSettings.Enabled,
            //     EnableErrorTracking = rollbarSettings.EnableErrorTracking,
            //     EnableRequestBodyTracking = rollbarSettings.EnableRequestBodyTracking,
            //     EnableResponseTracking = rollbarSettings.EnableResponseTracking,
            //     EnableSessionTracking = rollbarSettings.EnableSessionTracking,
            //     Environment = rollbarSettings.Environment,
            //     // HideRequestBodyForRequestDtoTypes = new List<Type>(),
            //     // ExcludeRequestDtoTypes = new List<Type>
            //     // {
            //     //         // Might have to exclude the Swagger requests to get the two to play nicely
            //     //     typeof(RollbarLogConfigRequest),
            //     //     typeof(SwaggerResource),
            //     //     typeof(SwaggerApiDeclaration)
            //     // },
            //     RequiredRoles = rollbarSettings.RequiredRoles,
            //     SkipLogging = IsRequestSkippedDuringRequestLogging
            // });
            #endregion

            #region Auth
            var authProviders = new List<IAuthProvider>
            {
                new JwtAuthProvider(AppSettings) {
                    RequireSecureConnection = false,
                    AllowInQueryString = true
                },
                new CredentialsAuthProvider(),
                new ApiKeyAuthProvider()
                {
                    RequireSecureConnection = false,
                    SessionCacheDuration = TimeSpan.FromMinutes(30)
                }
            };
            var authFeature = new AuthFeature(SessionFactory, authProviders.ToArray());
            Plugins.Add(authFeature);

            var authRepo = new OrmLiteAuthRepository<Account, UserAuthDetails>(dbFactory);
            container.Register<IAuthRepository>(authRepo);

            authRepo.InitSchema();
            authRepo.InitApiKeySchema();

            Plugins.Add(new RegistrationFeature());

            var admin = authRepo.GetUserAuthByUserName("admin");
            if (admin == null)
                authRepo.CreateUserAuth(new Account
                {
                    UserName = "admin",
                    Roles = new List<string> { RoleNames.Admin }
                }, "admin");
            #endregion
            // TODO:
            // Cache.
            // Logging.
            // Batched requests.
            // Profiler.
            // Versioning.
            // stripe.com

            #region Cache
            // container.Register<ICacheClient>(new MemoryCacheClient());
            #endregion

            #region App
            // container.Register(c => dbFactory.Open());
            // container.Register(c => c.Resolve<IDbConnectionFactory>().OpenDbConnection()).ReusedWithin(ReuseScope.Request);
            container.RegisterAutoWired<RevisionLogic>().ReusedWithin(ReuseScope.Request);
            MailgunService.AppSettings = AppSettings;
            container.Register<IEmailService>(i => new MailgunService()).ReusedWithin(ReuseScope.Request);
            container.RegisterAutoWired<CatalogLogic>().ReusedWithin(ReuseScope.Request);
            container.RegisterAutoWired<CatalogDefinitionLogic>().ReusedWithin(ReuseScope.Request);
            container.RegisterAutoWired<FieldLogic>().ReusedWithin(ReuseScope.Request);
            container.RegisterAutoWired<CatalogFieldValueLogic>().ReusedWithin(ReuseScope.Request);
            container.RegisterAutoWired<AccountLogic>().ReusedWithin(ReuseScope.Request);

            // This App:
            ///start:generated:di<<<
            container.RegisterAutoWired<TestLogic>().ReusedWithin(ReuseScope.Request);
            ///end:generated:di<<<
            #endregion

            #region Seed Data
            Sower.Seed(dbFactory);
            #endregion

            Log.Info("================= Application Started =================");
        } // Configure

        // private static bool IsRequestSkippedDuringRequestLogging(IRequest request1)
        // {
        //     // ignore some typical servicestack requests that we aren't interested in
        //     if (request1.PathInfo == "/metadata") return true;
        //     if (request1.PathInfo == "/favicon.ico") return true;
        //     if (request1.PathInfo == "/swagger-ui/") return true;
        //     return false;
        // }
    }

    public class MyNamingStrategy : PostgreSqlNamingStrategy
    {
        public static IAppSettings AppSettings { get; set; }

        public override string GetColumnName(string name)
        {
            if (name == "RowVersion")
            {
                switch (AppSettings.Get("dbProvider", ""))
                {
                    case "postgresql":
                        return "xmin";
                    default:
                        return name;
                }
            }

            return name.ToLowercaseUnderscore();
        }
    }
}
