import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSeoOverrideValue } from '@/lib/SeoOverrideContext';
import {
  absoluteUrl,
  buildArticleJsonLd,
  buildEventJsonLd,
  buildOrganizationJsonLd,
  defaultOgImage,
  pageSeo,
  seoDefaults,
} from '@/content/seo';

function upsertMeta(attr, key, content, isProperty = false) {
  if (!content) return;
  const selector = isProperty ? `meta[property="${key}"]` : `meta[name="${key}"]`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    if (isProperty) el.setAttribute('property', key);
    else el.setAttribute('name', key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export default function PageSEO() {
  const { pathname } = useLocation();
  const seoOverride = useSeoOverrideValue();

  useEffect(() => {
    const routeMeta =
      pageSeo[pathname] ||
      (pathname.startsWith('/news/') && pathname.length > 6 ? pageSeo['/news/:id'] : null) ||
      null;

    const meta = seoOverride
      ? { ...routeMeta, ...seoOverride }
      : routeMeta || {
          title: 'Page Not Found',
          description: seoDefaults.defaultDescription,
          path: pathname,
          noindex: true,
        };

    const title = meta.title || seoDefaults.defaultTitle;
    const description = meta.description || seoDefaults.defaultDescription;
    const canonical = absoluteUrl(seoOverride?.path || meta.path || pathname);
    const ogImage = meta.image || defaultOgImage;
    const robots = meta.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';

    document.title = title;
    document.documentElement.lang = 'en';

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', robots);
    upsertMeta('name', 'author', seoDefaults.siteName);
    upsertMeta('name', 'theme-color', '#0f1a2e');

    upsertLink('canonical', canonical);

    upsertMeta('property', 'og:site_name', seoDefaults.siteName, true);
    upsertMeta('property', 'og:title', title, true);
    upsertMeta('property', 'og:description', description, true);
    upsertMeta('property', 'og:type', seoOverride?.path?.startsWith('/news/') ? 'article' : 'website', true);
    upsertMeta('property', 'og:url', canonical, true);
    upsertMeta('property', 'og:image', ogImage, true);
    upsertMeta('property', 'og:locale', seoDefaults.locale, true);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:site', seoDefaults.twitterHandle);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);

    if (!meta.noindex) {
      upsertJsonLd('jsonld-organization', buildOrganizationJsonLd());
      if (pathname === '/' || pathname === '/plays') {
        upsertJsonLd('jsonld-event', buildEventJsonLd());
      } else {
        const eventEl = document.getElementById('jsonld-event');
        if (eventEl) eventEl.remove();
      }
      if (seoOverride?.path?.startsWith('/news/') && seoOverride.title) {
        upsertJsonLd(
          'jsonld-article',
          buildArticleJsonLd({
            title: seoOverride.title.replace(/ \| Shakespeare on the Sound$/, ''),
            description,
            path: seoOverride.path,
            datePublished: seoOverride.datePublished,
            image: seoOverride.image,
          }),
        );
      } else {
        const articleEl = document.getElementById('jsonld-article');
        if (articleEl) articleEl.remove();
      }
    }
  }, [pathname, seoOverride]);

  return null;
}
