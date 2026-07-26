-- AlterTable: contact phone number (used for WhatsApp notifications + B2B profile)
ALTER TABLE `users`
  ADD COLUMN `phone` VARCHAR(191) NULL;
