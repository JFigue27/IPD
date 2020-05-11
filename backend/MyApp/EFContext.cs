namespace MyApp.Database
{
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata;
    using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
    using MyApp.Logic.Entities;
    using Reusable.CRUD.Contract;
    using Reusable.CRUD.Entities;
    using Reusable.CRUD.JsonEntities;
    using ServiceStack.Text;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Security.Cryptography.X509Certificates;

    public class EFContext : DbContext
    {
        private JsonObject appSettings;
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            appSettings = JsonObject.Parse(File.ReadAllText(@"appsettings.json"));

            var connString = appSettings["dbConnectionString"];
            if (connString == "%%CONN_STR%%")
                connString = appSettings["dbConnectionStringDev"];

            switch (appSettings["dbProvider"])
            {
                case "postgresql":
                    optionsBuilder.UseNpgsql(connString, a => a.ProvideClientCertificatesCallback(ProvideClientCertificate))
                        .UseSnakeCaseNamingConvention();
                    break;
                default: //SQL Server:
                    optionsBuilder.UseSqlServer(connString)
                        .UseSnakeCaseNamingConvention();
                    break;
            }
        }

        private void ProvideClientCertificate(X509CertificateCollection clientCerts)
        {
            var clientCertPath = "ca-certificate.crt";
            var cert = new X509Certificate2(clientCertPath);

            clientCerts.Add(cert);
        }

        #region App
        ///start:generated:dbsets<<<///end:generated:dbsets<<<
        #endregion

        #region Reusable
        public virtual DbSet<Catalog> Catalogs { get; set; }
        public virtual DbSet<CatalogDefinition> CatalogDefinitionnitions { get; set; }
        public virtual DbSet<Field> CatalogDefinitionFields { get; set; }
        public virtual DbSet<CatalogFieldValue> CatalogFieldValues { get; set; }
        public virtual DbSet<Revision> Revisions { get; set; }
        public virtual DbSet<Token> Tokens { get; set; }
        #endregion
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                entity.SetTableName(entity.GetTableName().Substring(0, entity.GetTableName().Length - 1));
            }

            IEnumerable<IMutableEntityType> documents;
            switch (appSettings["dbProvider"])
            {
                case "postgresql":

                    documents = modelBuilder.Model.GetEntityTypes()
                        .Where(t => typeof(BaseDocument).IsAssignableFrom(t.ClrType));

                    for (var i = documents.Count() - 1; i >= 0; i--)
                    {
                        var docBuilder = modelBuilder.Entity(documents.ElementAt(i).ClrType);
                        //documents.ElementAt(i).AddProperty("xmin", typeof(uint));
                        docBuilder.Property("RowVersion")
                            .HasColumnName("xmin")
                            .HasColumnType("xid")
                            .ValueGeneratedOnAddOrUpdate()
                            .IsConcurrencyToken();

                        //docBuilder.Ignore("RowVersion");

                        //docBuilder.Property("RowVersion")
                        //            .HasColumnName("xmin")
                        //            .HasColumnType("xid")
                        //            .HasConversion(byteLongConverter)
                        //            .HasAnnotation("ConcurrencyCheck", true);
                        //docBuilder.UseXminAsConcurrencyToken();
                    }
                    break;
                default: //SQL Server:
                    documents = modelBuilder.Model.GetEntityTypes()
                        .Where(t => typeof(BaseDocument).IsAssignableFrom(t.ClrType));

                    for (var i = documents.Count() - 1; i >= 0; i--)
                    {
                        var docBuilder = modelBuilder.Entity(documents.ElementAt(i).ClrType);
                        docBuilder.Property("RowVersion")
                            .HasColumnName("RowVersion")
                            .HasColumnType("rowversion")
                            .IsRowVersion();
                    }
                    break;
            }

            modelBuilder.Ignore<Account>();
            modelBuilder.Ignore<IEntity>();
            modelBuilder.Ignore<BaseEntity>();
            modelBuilder.Ignore<BaseCatalog>();
            modelBuilder.Ignore<Trackable>();
            modelBuilder.Ignore<BaseDocument>();

            modelBuilder.Ignore<Contact>();
        }
    }
}
