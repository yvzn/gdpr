using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GdprRecord.Server.Feature.ProcessingActivity.Migrations
{
	/// <inheritdoc />
	public partial class InitialCreate : Migration
	{
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.CreateTable(
				name: "ProcessingActivity",
				columns: table => new
				{
					Id = table.Column<int>(type: "INTEGER", nullable: false)
						.Annotation("Sqlite:Autoincrement", true),
					Description = table.Column<string>(type: "TEXT", nullable: true),
					Reference = table.Column<string>(type: "TEXT", nullable: true),
					Created = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
					Updated = table.Column<DateTimeOffset>(type: "TEXT", nullable: true)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_ProcessingActivity", x => x.Id);
				});

			migrationBuilder.CreateTable(
				name: "DataSubject",
				columns: table => new
				{
					Id = table.Column<int>(type: "INTEGER", nullable: false)
						.Annotation("Sqlite:Autoincrement", true),
					Type = table.Column<string>(type: "TEXT", nullable: true),
					Description = table.Column<string>(type: "TEXT", nullable: true),
					ProcessingActivityId = table.Column<int>(type: "INTEGER", nullable: false)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_DataSubject", x => x.Id);
					table.ForeignKey(
						name: "FK_DataSubject_ProcessingActivity_ProcessingActivityId",
						column: x => x.ProcessingActivityId,
						principalTable: "ProcessingActivity",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
				});

			migrationBuilder.CreateTable(
				name: "InternationalRecipient",
				columns: table => new
				{
					Id = table.Column<int>(type: "INTEGER", nullable: false)
						.Annotation("Sqlite:Autoincrement", true),
					Description = table.Column<string>(type: "TEXT", nullable: true),
					Country = table.Column<string>(type: "TEXT", nullable: true),
					Guarantees = table.Column<string>(type: "TEXT", nullable: false),
					Documentation = table.Column<string>(type: "TEXT", nullable: true),
					ProcessingActivityId = table.Column<int>(type: "INTEGER", nullable: false)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_InternationalRecipient", x => x.Id);
					table.ForeignKey(
						name: "FK_InternationalRecipient_ProcessingActivity_ProcessingActivityId",
						column: x => x.ProcessingActivityId,
						principalTable: "ProcessingActivity",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
				});

			migrationBuilder.CreateTable(
				name: "PersonalData",
				columns: table => new
				{
					Id = table.Column<int>(type: "INTEGER", nullable: false)
						.Annotation("Sqlite:Autoincrement", true),
					ProcessingActivityId = table.Column<int>(type: "INTEGER", nullable: false),
					Description = table.Column<string>(type: "TEXT", nullable: true),
					StoragePeriod = table.Column<string>(type: "TEXT", nullable: true)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_PersonalData", x => x.Id);
					table.ForeignKey(
						name: "FK_PersonalData_ProcessingActivity_ProcessingActivityId",
						column: x => x.ProcessingActivityId,
						principalTable: "ProcessingActivity",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
				});

			migrationBuilder.CreateTable(
				name: "Purpose",
				columns: table => new
				{
					Id = table.Column<int>(type: "INTEGER", nullable: false)
						.Annotation("Sqlite:Autoincrement", true),
					Description = table.Column<string>(type: "TEXT", nullable: true),
					ProcessingActivityId = table.Column<int>(type: "INTEGER", nullable: false)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_Purpose", x => x.Id);
					table.ForeignKey(
						name: "FK_Purpose_ProcessingActivity_ProcessingActivityId",
						column: x => x.ProcessingActivityId,
						principalTable: "ProcessingActivity",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
				});

			migrationBuilder.CreateTable(
				name: "Recipient",
				columns: table => new
				{
					Id = table.Column<int>(type: "INTEGER", nullable: false)
						.Annotation("Sqlite:Autoincrement", true),
					Type = table.Column<string>(type: "TEXT", nullable: true),
					Description = table.Column<string>(type: "TEXT", nullable: true),
					ProcessingActivityId = table.Column<int>(type: "INTEGER", nullable: false)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_Recipient", x => x.Id);
					table.ForeignKey(
						name: "FK_Recipient_ProcessingActivity_ProcessingActivityId",
						column: x => x.ProcessingActivityId,
						principalTable: "ProcessingActivity",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
				});

			migrationBuilder.CreateTable(
				name: "SecurityMeasure",
				columns: table => new
				{
					Id = table.Column<int>(type: "INTEGER", nullable: false)
						.Annotation("Sqlite:Autoincrement", true),
					Type = table.Column<string>(type: "TEXT", nullable: true),
					Description = table.Column<string>(type: "TEXT", nullable: true),
					ProcessingActivityId = table.Column<int>(type: "INTEGER", nullable: false)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_SecurityMeasure", x => x.Id);
					table.ForeignKey(
						name: "FK_SecurityMeasure_ProcessingActivity_ProcessingActivityId",
						column: x => x.ProcessingActivityId,
						principalTable: "ProcessingActivity",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
				});

			migrationBuilder.CreateTable(
				name: "SensitiveData",
				columns: table => new
				{
					Id = table.Column<int>(type: "INTEGER", nullable: false)
						.Annotation("Sqlite:Autoincrement", true),
					ProcessingActivityId = table.Column<int>(type: "INTEGER", nullable: false),
					Description = table.Column<string>(type: "TEXT", nullable: true),
					StoragePeriod = table.Column<string>(type: "TEXT", nullable: true)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_SensitiveData", x => x.Id);
					table.ForeignKey(
						name: "FK_SensitiveData_ProcessingActivity_ProcessingActivityId",
						column: x => x.ProcessingActivityId,
						principalTable: "ProcessingActivity",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
				});

			migrationBuilder.CreateIndex(
				name: "IX_DataSubject_ProcessingActivityId",
				table: "DataSubject",
				column: "ProcessingActivityId");

			migrationBuilder.CreateIndex(
				name: "IX_InternationalRecipient_ProcessingActivityId",
				table: "InternationalRecipient",
				column: "ProcessingActivityId");

			migrationBuilder.CreateIndex(
				name: "IX_PersonalData_ProcessingActivityId",
				table: "PersonalData",
				column: "ProcessingActivityId");

			migrationBuilder.CreateIndex(
				name: "IX_Purpose_ProcessingActivityId",
				table: "Purpose",
				column: "ProcessingActivityId");

			migrationBuilder.CreateIndex(
				name: "IX_Recipient_ProcessingActivityId",
				table: "Recipient",
				column: "ProcessingActivityId");

			migrationBuilder.CreateIndex(
				name: "IX_SecurityMeasure_ProcessingActivityId",
				table: "SecurityMeasure",
				column: "ProcessingActivityId");

			migrationBuilder.CreateIndex(
				name: "IX_SensitiveData_ProcessingActivityId",
				table: "SensitiveData",
				column: "ProcessingActivityId");
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropTable(
				name: "DataSubject");

			migrationBuilder.DropTable(
				name: "InternationalRecipient");

			migrationBuilder.DropTable(
				name: "PersonalData");

			migrationBuilder.DropTable(
				name: "Purpose");

			migrationBuilder.DropTable(
				name: "Recipient");

			migrationBuilder.DropTable(
				name: "SecurityMeasure");

			migrationBuilder.DropTable(
				name: "SensitiveData");

			migrationBuilder.DropTable(
				name: "ProcessingActivity");
		}
	}
}
