-- AlterTable: per-partner commission rate
ALTER TABLE `users`
  ADD COLUMN `commissionRate` DOUBLE NOT NULL DEFAULT 10;

-- AlterTable: commission snapshot on bookings (B2B agency services)
ALTER TABLE `bookings`
  ADD COLUMN `serviceId` INT NULL,
  ADD COLUMN `ownerId` VARCHAR(191) NULL,
  ADD COLUMN `commissionRate` DOUBLE NULL,
  ADD COLUMN `commissionAmount` DOUBLE NULL;

-- AlterTable: commission snapshot on order items (marketplace products)
ALTER TABLE `order_items`
  ADD COLUMN `ownerId` VARCHAR(191) NULL,
  ADD COLUMN `commissionRate` DOUBLE NULL,
  ADD COLUMN `commissionAmount` DOUBLE NULL;
