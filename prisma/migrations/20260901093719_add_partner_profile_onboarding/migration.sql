-- CreateTable: richer B2B onboarding/application record (draft + review lifecycle).
-- User.role / b2bType / b2bStatus remain untouched and stay authoritative for
-- access control; this table is additive.
CREATE TABLE `partner_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `partnerType` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
    `currentStep` INT NOT NULL DEFAULT 1,
    `organizationName` VARCHAR(191) NULL,
    `contactFirstName` VARCHAR(191) NULL,
    `contactLastName` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `countryCode` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `currency` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `rejectionReason` TEXT NULL,
    `submittedAt` DATETIME(3) NULL,
    `reviewedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `partner_profiles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `partner_interests` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `profileId` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `partner_interests_profileId_category_key`(`profileId`, `category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `partner_social_profiles` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `profileId` VARCHAR(191) NOT NULL,
    `platform` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `partner_social_profiles_profileId_platform_key`(`profileId`, `platform`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `partner_profiles` ADD CONSTRAINT `partner_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `partner_interests` ADD CONSTRAINT `partner_interests_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `partner_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `partner_social_profiles` ADD CONSTRAINT `partner_social_profiles_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `partner_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
