using MyApp.Logic.Entities;
using ServiceStack;
using ServiceStack.Data;
using ServiceStack.OrmLite;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
namespace MyApp
{
    public class Sower
    {
        static public bool Seed(IDbConnectionFactory DbConnectionFactory)
        {
            using var db = DbConnectionFactory.Open();
            using var transaction = db.OpenTransaction();
            try
            {
                #region Catalog Definition
                // var catalogDefinitions = File.ReadAllText("DBSeed/CatalogDefinition.json").FromJson<List<CatalogDefinition>>();
                // db.SaveAll(catalogDefinitions);

                // foreach (var item in catalogDefinitions)
                //     db.SaveAllReferences(item);

                // var catalogs = File.ReadAllText("DBSeed/Catalog.json").FromJson<List<Catalog>>();
                // db.SaveAll(catalogs);

                // foreach (var item in catalogs)
                //     db.SaveAllReferences(item);
                #endregion

                transaction.Commit();
                return true;
            }
            catch (Exception)
            {
                transaction.Rollback();
                throw;
            }
        }
    }
}
