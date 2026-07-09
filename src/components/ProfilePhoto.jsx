import { useState } from "react";
import { getProfileImageCandidates } from "../../js/profile-images.js";

export function ProfilePhoto({ name, image, folder, className = "" }) {
  const candidates = getProfileImageCandidates(name, folder, image);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const src = candidates[candidateIndex];

  if (!src) return null;

  return (
    <img
      className={className}
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setCandidateIndex((index) => index + 1)}
    />
  );
}

export function hasProfilePhoto(name, folder, image) {
  return getProfileImageCandidates(name, folder, image).length > 0;
}
