-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `readAt` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `notifications_isRead_readAt_idx` ON `notifications`(`isRead`, `readAt`);
