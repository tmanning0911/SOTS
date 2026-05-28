/**
 * Build-time JSON seeds — instant first paint; cms refreshes in the background on production.
 */
import playsSeed from '../../public/data/plays.json';
import articlesSeed from '../../public/data/articles.json';
import learningSeed from '../../public/data/learning.json';

function sortItems(items, sortKey) {
  if (!sortKey) return items;
  const desc = sortKey.startsWith('-');
  const field = desc ? sortKey.slice(1) : sortKey;
  return [...items].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av === bv) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === 'number' && typeof bv === 'number') {
      return desc ? bv - av : av - bv;
    }
    return desc ? String(bv).localeCompare(String(av)) : String(av).localeCompare(String(bv));
  });
}

export const seedPlays = sortItems(playsSeed, 'sort_order').filter((p) => p.status !== 'Archived');

export const seedArticles = sortItems(articlesSeed, '-date').filter((a) => a.published !== false);

export const seedLearning = sortItems(learningSeed, 'sort_order');
