-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_order_id_fkey";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "attachment_id" TEXT;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "attachments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
