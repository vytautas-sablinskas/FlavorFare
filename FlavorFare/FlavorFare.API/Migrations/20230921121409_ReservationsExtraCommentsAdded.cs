using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlavorFare.Data.Migrations
{
    /// <inheritdoc />
    public partial class ReservationsExtraCommentsAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExtraInformation",
                table: "Reservations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExtraInformation",
                table: "Reservations");
        }
    }
}
