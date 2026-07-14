import { useCallback, useEffect, useState } from "react";
import { SITE } from "../../../js/data.js";

function absoluteUrl(path) {
  if (typeof window !== "undefined" && window.location?.origin) {
    return new URL(path, window.location.origin).href;
  }
  const base = import.meta.env.VITE_SITE_URL || "https://www.shakespeareonthesound.org";
  return new URL(path, base).href;
}

function shareLinks(url, title) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    x: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    email: `mailto:?subject=${t}&body=${encodeURIComponent(`${title}\n\n${url}\n\n— ${SITE.name}`)}`,
  };
}

/**
 * Share strip for news articles — native share when available, plus copy / social / email.
 */
export function NewsShare({ path, title }) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const url = absoluteUrl(path);
  const links = shareLinks(url, title);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [url]);

  const nativeShare = useCallback(async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ title, text: `${title} — ${SITE.name}`, url });
    } catch {
      /* user cancelled */
    }
  }, [title, url]);

  return (
    <div className="sots-news-share">
      <p className="sots-news-share__label">Share this story</p>
      <div className="sots-news-share__actions">
        {canNativeShare ? (
          <button type="button" className="sots-news-share__btn" onClick={nativeShare}>
            Share
          </button>
        ) : null}
        <button type="button" className="sots-news-share__btn" onClick={copyLink}>
          {copied ? "Copied" : "Copy link"}
        </button>
        <a
          className="sots-news-share__btn"
          href={links.facebook}
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>
        <a className="sots-news-share__btn" href={links.x} target="_blank" rel="noopener noreferrer">
          X
        </a>
        <a className="sots-news-share__btn" href={links.email}>
          Email
        </a>
      </div>
    </div>
  );
}
