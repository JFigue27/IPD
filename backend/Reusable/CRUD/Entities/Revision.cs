using Reusable.CRUD.Contract;
using System.ComponentModel.DataAnnotations.Schema;

namespace Reusable.CRUD.Entities
{
    public class Revision : BaseDocument
    {
        public string ForeignType { get; set; }
        public long ForeignKey { get; set; }
    }
}
