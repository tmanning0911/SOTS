import { useState } from "react";
import { getProfileImageCandidates } from "../../js/profile-images.js";
import { ProfilePlaceholderIcon } from "./ProfilePlaceholderIcon.jsx";

export function ProfileAvatar({ name, image, folder, classPrefix = "orpheum-profile-card" }) {
  const candidates = getProfileImageCandidates(name, folder, image);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const src = candidates[candidateIndex];

  if (!src) {
    return (
      <div className={`${classPrefix}__avatar ${classPrefix}__avatar--empty`} aria-hidden="true">
        <ProfilePlaceholderIcon />
      </div>
    );
  }

  return (
    <img
      className={`${classPrefix}__photo`}
      src={src}
      alt={`Portrait of ${name}`}
      loading="lazy"
      decoding="async"
      onError={() => {
        setCandidateIndex((index) => index + 1);
      }}
    />
  );
}

export function profileHasPhoto(name, folder, image) {
  return getProfileImageCandidates(name, folder, image).length > 0;
}
