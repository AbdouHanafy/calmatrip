INSERT INTO `cms_navigations` (`id`, `name`, `key`, `status`, `publishedAt`, `createdAt`, `updatedAt`)
SELECT 'nav_footer_explore_20260903', 'Footer Explore', 'footer-explore', 'PUBLISHED', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
WHERE NOT EXISTS (SELECT 1 FROM `cms_navigations` WHERE `key` = 'footer-explore');

INSERT INTO `cms_navigation_items` (`id`, `navigationId`, `parentId`, `pageId`, `label`, `url`, `type`, `target`, `visible`, `position`)
SELECT CONCAT('nav_footer_explore_item_', seed.position), 'nav_footer_explore_20260903', NULL, NULL, seed.label, seed.url, 'CUSTOM', '_self', TRUE, seed.position
FROM (
  SELECT 0 position, JSON_OBJECT('fr','Explorer','en','Explore','ar','استكشف') label, '/explore' url
  UNION ALL SELECT 1, JSON_OBJECT('fr','Guides','en','Guides','ar','الأدلة'), '/guides'
  UNION ALL SELECT 2, JSON_OBJECT('fr','Favoris','en','Favorites','ar','المفضلة'), '/favorites'
) seed
WHERE EXISTS (SELECT 1 FROM `cms_navigations` WHERE `id` = 'nav_footer_explore_20260903');
