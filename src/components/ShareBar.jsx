import { useCallback, useEffect, useState } from "react";
import { SITE } from "../../js/data.js";

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
 * Share strip — native share when available, plus copy / social / email.
 */
export function ShareBar({
  path,
  title,
  label = "Share",
  text,
  className = "",
  compact = false,
}) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const url = absoluteUrl(path);
  const links = shareLinks(url, title);
  const shareText = text || `${title} — ${SITE.name}`;

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
      await navigator.share({ title, text: shareText, url });
    } catch {
      /* user cancelled */
    }
  }, [shareText, title, url]);

  return (
    <div
      className={["sots-share", compact ? "sots-share--compact" : "", className].filter(Boolean).join(" ")}
    >
      <p className="sots-share__label">{label}</p>
      <div className="sots-share__actions">
        {canNativeShare ? (
          <button type="button" className="sots-share__btn" onClick={nativeShare}>
            Share
          </button>
        ) : null}
        <button type="button" className="sots-share__btn" onClick={copyLink}>
          {copied ? "Copied" : "Copy link"}
        </button>
        <a className="sots-share__btn" href={links.facebook} target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
        <a className="sots-share__btn" href={links.x} target="_blank" rel="noopener noreferrer">
          X
        </a>
        <a className="sots-share__btn" href={links.email}>
          Email
        </a>
      </div>
    </div>
  );
}

/** @deprecated Prefer ShareBar — kept for news article imports. */
export function NewsShare({ path, title }) {
  return <ShareBar path={path} title={title} label="Share this story" />;
}

/** Build a stable public path for sharing an event card. */
export function eventSharePath(event) {
  if (!event) return "/support/events/";
  const href = String(event.ctaUrl || event.href || "").trim();
  if (/^https?:\/\//i.test(href)) {
    try {
      const u = new URL(href);
      return `${u.pathname}${u.hash || ""}`;
    } catch {
      /* fall through */
    }
  }
  if (href.startsWith("/events/")) {
    return href.includes("#") ? href : `${href.replace(/\/?$/, "/")}`;
  }
  if (href.startsWith("/education/") || href.startsWith("/productions/") || href.startsWith("/support/")) {
    return href;
  }
  if (event.id) {
    // Education calendar items without dedicated event URLs
    if (String(event.source || "").includes("seed") || String(event.category || "").match(/Camp|Tour|Program|Park/i)) {
      return `/education/events/#${event.id}`;
    }
    return `/support/events/#${event.id}`;
  }
  return "/support/events/";
}
