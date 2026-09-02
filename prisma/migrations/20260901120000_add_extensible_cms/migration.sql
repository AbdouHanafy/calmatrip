-- Additive schema-driven CMS. Existing business tables are intentionally unchanged.

CREATE TABLE `cms_content_types` (
  `id` VARCHAR(191) NOT NULL, `name` VARCHAR(191) NOT NULL, `slug` VARCHAR(191) NOT NULL,
  `description` TEXT NULL, `icon` VARCHAR(191) NULL, `listColumns` JSON NULL, `defaultSort` JSON NULL,
  `publishingEnabled` BOOLEAN NOT NULL DEFAULT true, `localized` BOOLEAN NOT NULL DEFAULT true,
  `createdBy` VARCHAR(191) NULL, `updatedBy` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `cms_content_types_slug_key`(`slug`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `cms_field_definitions` (
  `id` VARCHAR(191) NOT NULL, `contentTypeId` VARCHAR(191) NOT NULL, `key` VARCHAR(191) NOT NULL,
  `label` VARCHAR(191) NOT NULL, `type` VARCHAR(191) NOT NULL, `required` BOOLEAN NOT NULL DEFAULT false,
  `localized` BOOLEAN NOT NULL DEFAULT false, `searchable` BOOLEAN NOT NULL DEFAULT false,
  `sortable` BOOLEAN NOT NULL DEFAULT false, `position` INTEGER NOT NULL DEFAULT 0,
  `placeholder` JSON NULL, `helpText` JSON NULL, `defaultValue` JSON NULL, `validation` JSON NULL,
  `options` JSON NULL, `visibility` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `updatedAt` DATETIME(3) NOT NULL,
  INDEX `cms_field_definitions_contentTypeId_position_idx`(`contentTypeId`, `position`),
  UNIQUE INDEX `cms_field_definitions_contentTypeId_key_key`(`contentTypeId`, `key`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `cms_content_entries` (
  `id` VARCHAR(191) NOT NULL, `contentTypeId` VARCHAR(191) NOT NULL, `slug` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT', `locale` VARCHAR(191) NOT NULL DEFAULT 'fr',
  `data` JSON NOT NULL, `seo` JSON NULL, `createdBy` VARCHAR(191) NULL, `updatedBy` VARCHAR(191) NULL,
  `publishedBy` VARCHAR(191) NULL, `publishedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `updatedAt` DATETIME(3) NOT NULL,
  INDEX `cms_content_entries_contentTypeId_status_updatedAt_idx`(`contentTypeId`, `status`, `updatedAt`),
  INDEX `cms_content_entries_slug_locale_status_idx`(`slug`, `locale`, `status`),
  UNIQUE INDEX `cms_content_entries_contentTypeId_slug_locale_key`(`contentTypeId`, `slug`, `locale`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `cms_pages` (
  `id` VARCHAR(191) NOT NULL, `title` VARCHAR(191) NOT NULL, `slug` VARCHAR(191) NOT NULL,
  `locale` VARCHAR(191) NOT NULL DEFAULT 'fr', `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT', `seo` JSON NULL,
  `createdBy` VARCHAR(191) NULL, `updatedBy` VARCHAR(191) NULL, `publishedBy` VARCHAR(191) NULL,
  `publishedAt` DATETIME(3) NULL, `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL, INDEX `cms_pages_status_locale_updatedAt_idx`(`status`, `locale`, `updatedAt`),
  UNIQUE INDEX `cms_pages_slug_locale_key`(`slug`, `locale`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `cms_page_blocks` (
  `id` VARCHAR(191) NOT NULL, `pageId` VARCHAR(191) NOT NULL, `type` VARCHAR(191) NOT NULL,
  `position` INTEGER NOT NULL DEFAULT 0, `data` JSON NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `updatedAt` DATETIME(3) NOT NULL,
  INDEX `cms_page_blocks_pageId_position_idx`(`pageId`, `position`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `cms_form_definitions` (
  `id` VARCHAR(191) NOT NULL, `name` VARCHAR(191) NOT NULL, `slug` VARCHAR(191) NOT NULL,
  `description` JSON NULL, `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT', `settings` JSON NULL,
  `createdBy` VARCHAR(191) NULL, `updatedBy` VARCHAR(191) NULL, `publishedBy` VARCHAR(191) NULL,
  `publishedAt` DATETIME(3) NULL, `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL, UNIQUE INDEX `cms_form_definitions_slug_key`(`slug`),
  INDEX `cms_form_definitions_status_updatedAt_idx`(`status`, `updatedAt`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `cms_form_steps` (
  `id` VARCHAR(191) NOT NULL, `formId` VARCHAR(191) NOT NULL, `title` JSON NOT NULL,
  `description` JSON NULL, `position` INTEGER NOT NULL DEFAULT 0, `condition` JSON NULL,
  INDEX `cms_form_steps_formId_position_idx`(`formId`, `position`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `cms_form_fields` (
  `id` VARCHAR(191) NOT NULL, `stepId` VARCHAR(191) NOT NULL, `key` VARCHAR(191) NOT NULL,
  `label` JSON NOT NULL, `type` VARCHAR(191) NOT NULL, `required` BOOLEAN NOT NULL DEFAULT false,
  `position` INTEGER NOT NULL DEFAULT 0, `placeholder` JSON NULL, `helpText` JSON NULL,
  `defaultValue` JSON NULL, `validation` JSON NULL, `options` JSON NULL, `condition` JSON NULL,
  INDEX `cms_form_fields_stepId_position_idx`(`stepId`, `position`),
  UNIQUE INDEX `cms_form_fields_stepId_key_key`(`stepId`, `key`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `cms_form_submissions` (
  `id` VARCHAR(191) NOT NULL, `formId` VARCHAR(191) NOT NULL, `status` VARCHAR(191) NOT NULL DEFAULT 'NEW',
  `locale` VARCHAR(191) NOT NULL DEFAULT 'fr', `data` JSON NOT NULL, `notes` JSON NULL,
  `assignedTo` VARCHAR(191) NULL, `submitterId` VARCHAR(191) NULL, `draftToken` VARCHAR(191) NULL,
  `submittedAt` DATETIME(3) NULL, `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL, UNIQUE INDEX `cms_form_submissions_draftToken_key`(`draftToken`),
  INDEX `cms_form_submissions_formId_status_createdAt_idx`(`formId`, `status`, `createdAt`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `cms_media` (
  `id` VARCHAR(191) NOT NULL, `filename` VARCHAR(191) NOT NULL, `url` TEXT NOT NULL,
  `mimeType` VARCHAR(191) NOT NULL, `size` INTEGER NOT NULL, `width` INTEGER NULL, `height` INTEGER NULL,
  `alt` JSON NULL, `caption` JSON NULL, `description` JSON NULL, `folder` VARCHAR(191) NULL,
  `createdBy` VARCHAR(191) NULL, `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL, INDEX `cms_media_mimeType_createdAt_idx`(`mimeType`, `createdAt`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `cms_navigations` (
  `id` VARCHAR(191) NOT NULL, `name` VARCHAR(191) NOT NULL, `key` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `cms_navigations_key_key`(`key`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `cms_navigation_items` (
  `id` VARCHAR(191) NOT NULL, `navigationId` VARCHAR(191) NOT NULL, `parentId` VARCHAR(191) NULL,
  `label` JSON NOT NULL, `url` VARCHAR(191) NOT NULL, `type` VARCHAR(191) NOT NULL DEFAULT 'INTERNAL',
  `target` VARCHAR(191) NOT NULL DEFAULT '_self', `visible` BOOLEAN NOT NULL DEFAULT true,
  `position` INTEGER NOT NULL DEFAULT 0,
  INDEX `cms_navigation_items_navigationId_parentId_position_idx`(`navigationId`, `parentId`, `position`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `cms_site_settings` (
  `id` VARCHAR(191) NOT NULL, `key` VARCHAR(191) NOT NULL, `value` JSON NOT NULL,
  `group` VARCHAR(191) NOT NULL DEFAULT 'general', `updatedBy` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `cms_site_settings_key_key`(`key`), INDEX `cms_site_settings_group_idx`(`group`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `cms_redirects` (
  `id` VARCHAR(191) NOT NULL, `source` VARCHAR(191) NOT NULL, `destination` VARCHAR(191) NOT NULL,
  `statusCode` INTEGER NOT NULL DEFAULT 301, `active` BOOLEAN NOT NULL DEFAULT true, `createdBy` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `cms_redirects_source_key`(`source`), INDEX `cms_redirects_active_idx`(`active`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `cms_revisions` (
  `id` VARCHAR(191) NOT NULL, `entityType` VARCHAR(191) NOT NULL, `entityId` VARCHAR(191) NOT NULL,
  `version` INTEGER NOT NULL, `snapshot` JSON NOT NULL, `actorId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `cms_revisions_entityType_entityId_createdAt_idx`(`entityType`, `entityId`, `createdAt`),
  UNIQUE INDEX `cms_revisions_entityType_entityId_version_key`(`entityType`, `entityId`, `version`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `cms_audit_logs` (
  `id` VARCHAR(191) NOT NULL, `actorId` VARCHAR(191) NULL, `action` VARCHAR(191) NOT NULL,
  `entityType` VARCHAR(191) NOT NULL, `entityId` VARCHAR(191) NULL, `before` JSON NULL,
  `after` JSON NULL, `metadata` JSON NULL, `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `cms_audit_logs_entityType_entityId_createdAt_idx`(`entityType`, `entityId`, `createdAt`),
  INDEX `cms_audit_logs_actorId_createdAt_idx`(`actorId`, `createdAt`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `cms_field_definitions` ADD CONSTRAINT `cms_field_definitions_contentTypeId_fkey` FOREIGN KEY (`contentTypeId`) REFERENCES `cms_content_types`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `cms_content_entries` ADD CONSTRAINT `cms_content_entries_contentTypeId_fkey` FOREIGN KEY (`contentTypeId`) REFERENCES `cms_content_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `cms_page_blocks` ADD CONSTRAINT `cms_page_blocks_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `cms_pages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `cms_form_steps` ADD CONSTRAINT `cms_form_steps_formId_fkey` FOREIGN KEY (`formId`) REFERENCES `cms_form_definitions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `cms_form_fields` ADD CONSTRAINT `cms_form_fields_stepId_fkey` FOREIGN KEY (`stepId`) REFERENCES `cms_form_steps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `cms_form_submissions` ADD CONSTRAINT `cms_form_submissions_formId_fkey` FOREIGN KEY (`formId`) REFERENCES `cms_form_definitions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `cms_navigation_items` ADD CONSTRAINT `cms_navigation_items_navigationId_fkey` FOREIGN KEY (`navigationId`) REFERENCES `cms_navigations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `cms_navigation_items` ADD CONSTRAINT `cms_navigation_items_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `cms_navigation_items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
