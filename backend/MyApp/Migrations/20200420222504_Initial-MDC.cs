using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MyApp.Migrations
{
    public partial class InitialMDC : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "catalog_definition",
                columns: table => new
                {
                    id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_catalog_definitions", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "revision",
                columns: table => new
                {
                    id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    value = table.Column<string>(nullable: true),
                    is_deleted = table.Column<bool>(nullable: false),
                    created_at = table.Column<DateTimeOffset>(nullable: false),
                    updated_at = table.Column<DateTimeOffset>(nullable: true),
                    removed_at = table.Column<DateTimeOffset>(nullable: true),
                    used_at = table.Column<DateTimeOffset>(nullable: true),
                    created_by = table.Column<string>(nullable: true),
                    updated_by = table.Column<string>(nullable: true),
                    removed_by = table.Column<string>(nullable: true),
                    assigned_to = table.Column<string>(nullable: true),
                    assigned_by = table.Column<string>(nullable: true),
                    RowVersion = table.Column<byte[]>(type: "rowversion", nullable: false),
                    document_status = table.Column<string>(nullable: true),
                    checkedout_by = table.Column<string>(nullable: true),
                    revision_message = table.Column<string>(nullable: true),
                    foreign_type = table.Column<string>(nullable: true),
                    foreign_key = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_revisions", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "catalog",
                columns: table => new
                {
                    id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    value = table.Column<string>(nullable: true),
                    hidden = table.Column<bool>(nullable: false),
                    catalog_definition_id = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_catalogs", x => x.id);
                    table.ForeignKey(
                        name: "fk_catalogs_catalog_definitions_catalog_definition_id",
                        column: x => x.catalog_definition_id,
                        principalTable: "catalog_definition",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "catalog_field",
                columns: table => new
                {
                    id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    field_name = table.Column<string>(nullable: true),
                    field_type = table.Column<string>(nullable: true),
                    catalog_definition_id = table.Column<long>(nullable: false),
                    foreign_id = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_catalog_fields", x => x.id);
                    table.ForeignKey(
                        name: "fk_catalog_fields_catalog_definitions_foreign_id",
                        column: x => x.foreign_id,
                        principalTable: "catalog_definition",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "catalog_field_value",
                columns: table => new
                {
                    id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    value = table.Column<string>(nullable: true),
                    ids = table.Column<string>(nullable: true),
                    catalog_id = table.Column<long>(nullable: false),
                    field_id = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_catalog_field_values", x => x.id);
                    table.ForeignKey(
                        name: "fk_catalog_field_values_catalogs_catalog_id",
                        column: x => x.catalog_id,
                        principalTable: "catalog",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_catalog_field_values_catalog_fields_field_id",
                        column: x => x.field_id,
                        principalTable: "catalog_field",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_catalogs_catalog_definition_id",
                table: "catalog",
                column: "catalog_definition_id");

            migrationBuilder.CreateIndex(
                name: "ix_catalog_fields_foreign_id",
                table: "catalog_field",
                column: "foreign_id");

            migrationBuilder.CreateIndex(
                name: "ix_catalog_field_values_catalog_id",
                table: "catalog_field_value",
                column: "catalog_id");

            migrationBuilder.CreateIndex(
                name: "ix_catalog_field_values_field_id",
                table: "catalog_field_value",
                column: "field_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "catalog_field_value");

            migrationBuilder.DropTable(
                name: "revision");

            migrationBuilder.DropTable(
                name: "catalog");

            migrationBuilder.DropTable(
                name: "catalog_field");

            migrationBuilder.DropTable(
                name: "catalog_definition");
        }
    }
}
