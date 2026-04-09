using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GdprRecord.Server.Feature.Organization.Migrations
{
	/// <inheritdoc />
	public partial class InitialCreate : Migration
	{
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.CreateTable(
				name: "Person",
				columns: table => new
				{
					Id = table.Column<int>(type: "INTEGER", nullable: false)
						.Annotation("Sqlite:Autoincrement", true),
					FullName = table.Column<string>(type: "TEXT", nullable: true),
					Address = table.Column<string>(type: "TEXT", nullable: true),
					City = table.Column<string>(type: "TEXT", nullable: true),
					ZipCode = table.Column<string>(type: "TEXT", nullable: true),
					Email = table.Column<string>(type: "TEXT", nullable: true),
					Phone = table.Column<string>(type: "TEXT", nullable: true),
					Company = table.Column<string>(type: "TEXT", nullable: true)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_Person", x => x.Id);
				});

			migrationBuilder.CreateTable(
				name: "Organization",
				columns: table => new
				{
					Id = table.Column<int>(type: "INTEGER", nullable: false)
						.Annotation("Sqlite:Autoincrement", true),
					Name = table.Column<string>(type: "TEXT", nullable: true),
					ControllerId = table.Column<int>(type: "INTEGER", nullable: true),
					JointControllerId = table.Column<int>(type: "INTEGER", nullable: true),
					ControllersRepresentativeId = table.Column<int>(type: "INTEGER", nullable: true),
					DataProtectionOfficerId = table.Column<int>(type: "INTEGER", nullable: true)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_Organization", x => x.Id);
					table.ForeignKey(
						name: "FK_Organization_Person_ControllerId",
						column: x => x.ControllerId,
						principalTable: "Person",
						principalColumn: "Id");
					table.ForeignKey(
						name: "FK_Organization_Person_ControllersRepresentativeId",
						column: x => x.ControllersRepresentativeId,
						principalTable: "Person",
						principalColumn: "Id");
					table.ForeignKey(
						name: "FK_Organization_Person_DataProtectionOfficerId",
						column: x => x.DataProtectionOfficerId,
						principalTable: "Person",
						principalColumn: "Id");
					table.ForeignKey(
						name: "FK_Organization_Person_JointControllerId",
						column: x => x.JointControllerId,
						principalTable: "Person",
						principalColumn: "Id");
				});

			migrationBuilder.CreateIndex(
				name: "IX_Organization_ControllerId",
				table: "Organization",
				column: "ControllerId");

			migrationBuilder.CreateIndex(
				name: "IX_Organization_ControllersRepresentativeId",
				table: "Organization",
				column: "ControllersRepresentativeId");

			migrationBuilder.CreateIndex(
				name: "IX_Organization_DataProtectionOfficerId",
				table: "Organization",
				column: "DataProtectionOfficerId");

			migrationBuilder.CreateIndex(
				name: "IX_Organization_JointControllerId",
				table: "Organization",
				column: "JointControllerId");
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropTable(
				name: "Organization");

			migrationBuilder.DropTable(
				name: "Person");
		}
	}
}
