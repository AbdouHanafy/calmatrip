-- AlterTable: B2B account fields on users
ALTER TABLE `users`
  ADD COLUMN `b2bType` VARCHAR(191) NULL,
  ADD COLUMN `b2bStatus` VARCHAR(191) NULL DEFAULT 'pending';

-- AlterTable: ownership + moderation on products
ALTER TABLE `products`
  ADD COLUMN `ownerId` VARCHAR(191) NULL,
  ADD COLUMN `submissionStatus` VARCHAR(191) NOT NULL DEFAULT 'approved',
  ADD COLUMN `rejectionReason` TEXT NULL;

-- AlterTable: ownership + moderation on services
ALTER TABLE `services`
  ADD COLUMN `ownerId` VARCHAR(191) NULL,
  ADD COLUMN `submissionStatus` VARCHAR(191) NOT NULL DEFAULT 'approved',
  ADD COLUMN `rejectionReason` TEXT NULL;

-- CreateIndex
CREATE INDEX `products_ownerId_idx` ON `products`(`ownerId`);
CREATE INDEX `services_ownerId_idx` ON `services`(`ownerId`);

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `services` ADD CONSTRAINT `services_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
