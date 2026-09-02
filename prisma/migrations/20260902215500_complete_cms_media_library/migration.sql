ALTER TABLE `cms_media`
  ADD COLUMN `publicId` VARCHAR(191) NULL,
  ADD COLUMN `title` VARCHAR(191) NULL;

CREATE UNIQUE INDEX `cms_media_publicId_key` ON `cms_media`(`publicId`);

CREATE TABLE `cms_media_folders` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `createdBy` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `cms_media_folders_name_key`(`name`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
