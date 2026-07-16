import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { applyDocumentSeo, resolveSeo } from "../../js/seo.js";

/**
 * Apply SEO from the shared catalog.
 * @param {string | {
 *   title?: string,
 *   description?: string,
 *   path?: string,
 *   image?: string,
 *   noindex?: boolean,
 *   isHome?: boolean,
 * }} [input] Path string (e.g. "/tickets/") or overrides. Defaults to location.
 */
export function usePageMeta(input) {
  const location = useLocation();
  const seo = resolveSeo(input, location.pathname);

  useEffect(() => {
    applyDocumentSeo(seo);
  }, [seo.path, seo.title, seo.description, seo.image, seo.noindex, seo.isHome]);
}

/** Declarative wrapper for route trees that need a null-rendering child. */
export function PageMeta(props) {
  usePageMeta(props.path && Object.keys(props).length === 1 ? props.path : props);
  return null;
}
