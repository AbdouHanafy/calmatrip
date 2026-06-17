-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `hasLuggage` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `timeSlotId` INTEGER NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `sizes` JSON NULL;

-- CreateTable
CREATE TABLE `time_slots` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serviceId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL DEFAULT 5,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `time_slots_serviceId_date_time_key`(`serviceId`, `date`, `time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `bookings_timeSlotId_idx` ON `bookings`(`timeSlotId`);

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_timeSlotId_fkey` FOREIGN KEY (`timeSlotId`) REFERENCES `time_slots`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
