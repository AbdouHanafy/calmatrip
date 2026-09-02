ALTER TABLE `cms_content_types`
  ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE `cms_field_definitions`
  ADD COLUMN `unique` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `relation` JSON NULL;
