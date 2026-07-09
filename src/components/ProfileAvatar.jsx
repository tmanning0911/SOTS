import { useState } from "react";
import { profileInitials, profileSlug } from "../../js/profile-utils.js";

export function ProfileAvatar({ name, image, folder, classPrefix = "orpheum-profile-card" }) {
  const slug = profileSlug(name);
  const [failedSrc, setFailedSrc] = useState(null);
  const candidates = [image, `/images/${folder}/${slug}.webp`, `/images/${folder}/${slug}.jpg`].filter(Boolean);
  const src = candidates.find((candidate) => candidate !== failedSrc);

  if (!src) {
    return (
      <div className={`${classPrefix}__avatar`} aria-hidden="true">
        {profileInitials(name)}
      </div>
    );
  }

  return (
    <img
      className={`${classPrefix}__photo`}
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailedSrc(src)}
    />
  );
}
