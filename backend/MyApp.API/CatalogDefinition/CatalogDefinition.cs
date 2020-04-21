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
    [Table("catalog_definitions")]
    public class CatalogDefinition : BaseEntity
    {
        public CatalogDefinition()
        {
            Fields = new List<Field>();
        }

        public string Name { get; set; }

        [Reference]
        public List<Field> Fields { get; set; }
    }
}
