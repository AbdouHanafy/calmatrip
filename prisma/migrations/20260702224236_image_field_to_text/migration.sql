-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `returnDate` DATETIME(3) NULL,
    ADD COLUMN `returnTime` VARCHAR(191) NULL,
    ADD COLUMN `tripType` VARCHAR(191) NOT NULL DEFAULT 'one-way';

-- AlterTable
ALTER TABLE `services` MODIFY `image` TEXT NULL;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NULL,
    `recipient` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `link` VARCHAR(191) NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifications_recipient_isRead_idx`(`recipient`, `isRead`),
    INDEX `notifications_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NOT NULL,
    `service` VARCHAR(191) NULL,
    `approved` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RedefineIndex (accounts)
SET @idx_exists := (
  SELECT COUNT(1) FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'accounts' AND index_name = 'accounts_userId_idx'
);
SET @sql := IF(@idx_exists = 0, 'CREATE INDEX `accounts_userId_idx` ON `accounts`(`userId`)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx_exists := (
  SELECT COUNT(1) FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'accounts' AND index_name = 'accounts_userId_fkey'
);
SET @sql := IF(@idx_exists > 0, 'DROP INDEX `accounts_userId_fkey` ON `accounts`', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- RedefineIndex (order_items.orderId)
SET @idx_exists := (
  SELECT COUNT(1) FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'order_items' AND index_name = 'order_items_orderId_idx'
);
SET @sql := IF(@idx_exists = 0, 'CREATE INDEX `order_items_orderId_idx` ON `order_items`(`orderId`)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx_exists := (
  SELECT COUNT(1) FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'order_items' AND index_name = 'order_items_orderId_fkey'
);
SET @sql := IF(@idx_exists > 0, 'DROP INDEX `order_items_orderId_fkey` ON `order_items`', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- RedefineIndex (order_items.productId)
SET @idx_exists := (
  SELECT COUNT(1) FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'order_items' AND index_name = 'order_items_productId_idx'
);
SET @sql := IF(@idx_exists = 0, 'CREATE INDEX `order_items_productId_idx` ON `order_items`(`productId`)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx_exists := (
  SELECT COUNT(1) FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'order_items' AND index_name = 'order_items_productId_fkey'
);
SET @sql := IF(@idx_exists > 0, 'DROP INDEX `order_items_productId_fkey` ON `order_items`', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- RedefineIndex (sessions)
SET @idx_exists := (
  SELECT COUNT(1) FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'sessions' AND index_name = 'sessions_userId_idx'
);
SET @sql := IF(@idx_exists = 0, 'CREATE INDEX `sessions_userId_idx` ON `sessions`(`userId`)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx_exists := (
  SELECT COUNT(1) FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'sessions' AND index_name = 'sessions_userId_fkey'
);
SET @sql := IF(@idx_exists > 0, 'DROP INDEX `sessions_userId_fkey` ON `sessions`', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;