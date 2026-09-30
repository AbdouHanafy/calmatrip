-- AlterTable
ALTER TABLE `destinations` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `emoji` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE `_DestinationToService` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DestinationToService_AB_unique`(`A`, `B`),
    INDEX `_DestinationToService_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_DestinationToService` ADD CONSTRAINT `_DestinationToService_A_fkey` FOREIGN KEY (`A`) REFERENCES `destinations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DestinationToService` ADD CONSTRAINT `_DestinationToService_B_fkey` FOREIGN KEY (`B`) REFERENCES `services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


-- Launch with Hammamet as the only destination offered in the search bar;
-- admins switch others on from /admin/destinations.
INSERT INTO `destinations` (`name`, `emoji`, `description`, `order`, `active`)
SELECT 'Hammamet', '', 'Tunisian Riviera', 0, true
WHERE NOT EXISTS (SELECT 1 FROM `destinations` WHERE `name` = 'Hammamet');

UPDATE `destinations` SET `active` = (`name` = 'Hammamet');
