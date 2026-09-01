-- AlterTable: optional headcount/capacity for an Explore listing (e.g. group
-- excursions, guided tours) — null means unspecified/not applicable.
ALTER TABLE `explore_listings` ADD COLUMN `capacity` INT NULL;
