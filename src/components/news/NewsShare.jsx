import { NewsShare as NewsShareImpl, ShareBar, eventSharePath } from "../ShareBar.jsx";

/** Back-compat re-export for news article pages. */
export function NewsShare(props) {
  return <NewsShareImpl {...props} />;
}

export { ShareBar, eventSharePath };
