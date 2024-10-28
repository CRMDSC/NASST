using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NASSTBACKEND.Migrations
{
    /// <inheritdoc />
    public partial class EditInfoDoc : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsArchived",
                table: "SportPlayersCategories",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsArchived",
                table: "SportDocumentTypes",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsArchived",
                table: "SportAdditionalInformation",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsArchived",
                table: "SportPlayersCategories");

            migrationBuilder.DropColumn(
                name: "IsArchived",
                table: "SportDocumentTypes");

            migrationBuilder.DropColumn(
                name: "IsArchived",
                table: "SportAdditionalInformation");
        }
    }
}
