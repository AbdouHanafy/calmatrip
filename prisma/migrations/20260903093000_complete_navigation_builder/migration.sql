ALTER TABLE `cms_navigations`
  ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN `createdBy` VARCHAR(191) NULL,
  ADD COLUMN `updatedBy` VARCHAR(191) NULL,
  ADD COLUMN `publishedAt` DATETIME(3) NULL;

ALTER TABLE `cms_navigation_items`
  ADD COLUMN `pageId` VARCHAR(191) NULL;

CREATE INDEX `cms_navigation_items_pageId_idx` ON `cms_navigation_items`(`pageId`);

ALTER TABLE `cms_navigation_items`
  ADD CONSTRAINT `cms_navigation_items_pageId_fkey`
  FOREIGN KEY (`pageId`) REFERENCES `cms_pages`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Preserve the current public navigation as editable CMS data on installations
-- that do not already have a main menu. Existing menus are never overwritten.
INSERT INTO `cms_navigations` (`id`, `name`, `key`, `status`, `publishedAt`, `createdAt`, `updatedAt`)
SELECT 'nav_main_20260903', 'Main Navigation', 'main', 'PUBLISHED', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
WHERE NOT EXISTS (SELECT 1 FROM `cms_navigations` WHERE `key` = 'main');

INSERT INTO `cms_navigation_items` (`id`, `navigationId`, `parentId`, `pageId`, `label`, `url`, `type`, `target`, `visible`, `position`)
SELECT CONCAT('nav_main_item_', seed.position), 'nav_main_20260903', NULL, NULL, seed.label, seed.url, 'CUSTOM', '_self', TRUE, seed.position
FROM (
  SELECT 0 position, JSON_OBJECT('fr','Accueil','en','Home','ar','الرئيسية') label, '/' url
  UNION ALL SELECT 1, JSON_OBJECT('fr','Explorer','en','Explore','ar','استكشف'), '/explore'
  UNION ALL SELECT 2, JSON_OBJECT('fr','Services','en','Services','ar','الخدمات'), '/services'
  UNION ALL SELECT 3, JSON_OBJECT('fr','Marché','en','Marketplace','ar','السوق'), '/marketplace'
  UNION ALL SELECT 4, JSON_OBJECT('fr','Guides','en','Guides','ar','الأدلة'), '/guides'
  UNION ALL SELECT 5, JSON_OBJECT('fr','Communauté','en','Community','ar','المجتمع'), '/community'
  UNION ALL SELECT 6, JSON_OBJECT('fr','À propos','en','About','ar','من نحن'), '/about'
  UNION ALL SELECT 7, JSON_OBJECT('fr','Contact','en','Contact','ar','اتصل بنا'), '/contact'
) seed
WHERE EXISTS (SELECT 1 FROM `cms_navigations` WHERE `id` = 'nav_main_20260903');

INSERT INTO `cms_navigations` (`id`, `name`, `key`, `status`, `publishedAt`, `createdAt`, `updatedAt`)
SELECT 'nav_footer_company_20260903', 'Footer Company', 'footer-company', 'PUBLISHED', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
WHERE NOT EXISTS (SELECT 1 FROM `cms_navigations` WHERE `key` = 'footer-company');

INSERT INTO `cms_navigation_items` (`id`, `navigationId`, `parentId`, `pageId`, `label`, `url`, `type`, `target`, `visible`, `position`)
SELECT CONCAT('nav_footer_company_item_', seed.position), 'nav_footer_company_20260903', NULL, NULL, seed.label, seed.url, 'CUSTOM', '_self', TRUE, seed.position
FROM (
  SELECT 0 position, JSON_OBJECT('fr','À propos','en','About','ar','من نحن') label, '/about' url
  UNION ALL SELECT 1, JSON_OBJECT('fr','Services','en','Services','ar','الخدمات'), '/services'
  UNION ALL SELECT 2, JSON_OBJECT('fr','Contact','en','Contact','ar','اتصل بنا'), '/contact'
) seed
WHERE EXISTS (SELECT 1 FROM `cms_navigations` WHERE `id` = 'nav_footer_company_20260903');
