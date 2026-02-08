using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MessagingPlatform.Infrastructure.Persistence.Migrations
{
    public partial class FixMessageUniqueIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_messages_wb_message_id",
                table: "messages");

            migrationBuilder.CreateIndex(
                name: "ix_messages_chat_wb_msg",
                table: "messages",
                columns: new[] { "chat_id", "wb_message_id" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_messages_chat_wb_msg",
                table: "messages");

            migrationBuilder.CreateIndex(
                name: "ix_messages_wb_message_id",
                table: "messages",
                column: "wb_message_id",
                unique: true);
        }
    }
}
