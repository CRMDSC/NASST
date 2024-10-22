using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NASSTBACKEND.Migrations
{
    /// <inheritdoc />
    public partial class SportsTypesAddition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PlayersCount",
                table: "SportTypes");

            migrationBuilder.RenameColumn(
                name: "TeamsCount",
                table: "SportTypes",
                newName: "MaxTeams");

            migrationBuilder.AddColumn<DateTime>(
                name: "RegistrationTime",
                table: "SportTypes",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "ReplacementTime",
                table: "SportTypes",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "TeamAdminId",
                table: "SportTypes",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SportAdditionalInformation",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdditionalInformationId = table.Column<int>(type: "int", nullable: false),
                    InformationValue = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SportTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SportAdditionalInformation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SportAdditionalInformation_AdditionalInformation_AdditionalInformationId",
                        column: x => x.AdditionalInformationId,
                        principalTable: "AdditionalInformation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SportAdditionalInformation_SportTypes_SportTypeId",
                        column: x => x.SportTypeId,
                        principalTable: "SportTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SportDocumentTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DocumentTypeId = table.Column<int>(type: "int", nullable: false),
                    DocumentLink = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SportTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SportDocumentTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SportDocumentTypes_DocumentTypes_DocumentTypeId",
                        column: x => x.DocumentTypeId,
                        principalTable: "DocumentTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SportDocumentTypes_SportTypes_SportTypeId",
                        column: x => x.SportTypeId,
                        principalTable: "SportTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SportPlayersCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    SportTypeId = table.Column<int>(type: "int", nullable: false),
                    PlayersCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SportPlayersCategories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SportPlayersCategories_Category_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Category",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SportPlayersCategories_SportTypes_SportTypeId",
                        column: x => x.SportTypeId,
                        principalTable: "SportTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SportTypes_TeamAdminId",
                table: "SportTypes",
                column: "TeamAdminId");

            migrationBuilder.CreateIndex(
                name: "IX_SportAdditionalInformation_AdditionalInformationId",
                table: "SportAdditionalInformation",
                column: "AdditionalInformationId");

            migrationBuilder.CreateIndex(
                name: "IX_SportAdditionalInformation_SportTypeId",
                table: "SportAdditionalInformation",
                column: "SportTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_SportDocumentTypes_DocumentTypeId",
                table: "SportDocumentTypes",
                column: "DocumentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_SportDocumentTypes_SportTypeId",
                table: "SportDocumentTypes",
                column: "SportTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_SportPlayersCategories_CategoryId",
                table: "SportPlayersCategories",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_SportPlayersCategories_SportTypeId",
                table: "SportPlayersCategories",
                column: "SportTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_SportTypes_AspNetUsers_TeamAdminId",
                table: "SportTypes",
                column: "TeamAdminId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SportTypes_AspNetUsers_TeamAdminId",
                table: "SportTypes");

            migrationBuilder.DropTable(
                name: "SportAdditionalInformation");

            migrationBuilder.DropTable(
                name: "SportDocumentTypes");

            migrationBuilder.DropTable(
                name: "SportPlayersCategories");

            migrationBuilder.DropIndex(
                name: "IX_SportTypes_TeamAdminId",
                table: "SportTypes");

            migrationBuilder.DropColumn(
                name: "RegistrationTime",
                table: "SportTypes");

            migrationBuilder.DropColumn(
                name: "ReplacementTime",
                table: "SportTypes");

            migrationBuilder.DropColumn(
                name: "TeamAdminId",
                table: "SportTypes");

            migrationBuilder.RenameColumn(
                name: "MaxTeams",
                table: "SportTypes",
                newName: "TeamsCount");

            migrationBuilder.AddColumn<int>(
                name: "PlayersCount",
                table: "SportTypes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
