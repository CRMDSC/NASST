using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NASSTBACKEND.Migrations
{
    /// <inheritdoc />
    public partial class EditSportTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DocumentLink",
                table: "SportDocumentTypes");

            migrationBuilder.DropColumn(
                name: "InformationValue",
                table: "SportAdditionalInformation");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DocumentLink",
                table: "SportDocumentTypes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "InformationValue",
                table: "SportAdditionalInformation",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
