-- AlterTable: link a review to the specific booking it's about
ALTER TABLE `reviews`
  ADD COLUMN `bookingId` INT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `reviews_bookingId_key` ON `reviews`(`bookingId`);

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
