-- CreateTable: B2B agency-submitted Explore listings (activities, hotels, etc.)
CREATE TABLE `explore_listings` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `image` TEXT NULL,
    `city` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `price` VARCHAR(191) NULL,
    `budget` INT NOT NULL DEFAULT 2,
    `duration` VARCHAR(191) NULL,
    `openingHours` VARCHAR(191) NULL,
    `lat` DOUBLE NULL,
    `lng` DOUBLE NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `ownerId` VARCHAR(191) NULL,
    `submissionStatus` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `rejectionReason` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `explore_listings_ownerId_idx`(`ownerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `explore_listings` ADD CONSTRAINT `explore_listings_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
