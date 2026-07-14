import { useRef, useState } from "react";

function initialsFrom(name, email) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const local = String(email || "").split("@")[0] || "?";
  return local.slice(0, 2).toUpperCase();
}

export function PatronAvatarField({
  avatarUrl,
  name,
  email,
  onUpload,
  onRemove,
  uploading = false,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    try {
      await onUpload(file);
    } catch (err) {
      setError(err.message || "Could not upload that photo.");
    }
  }

  async function handleRemove() {
    setError("");
    try {
      await onRemove();
    } catch (err) {
      setError(err.message || "Could not remove that photo.");
    }
  }

  const busy = uploading || disabled;

  return (
    <div className="sots-patron-avatar">
      <div className="sots-patron-avatar__preview" aria-hidden={!avatarUrl}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="sots-patron-avatar__img" />
        ) : (
          <span className="sots-patron-avatar__initials">{initialsFrom(name, email)}</span>
        )}
      </div>

      <div className="sots-patron-avatar__copy">
        <p className="sots-patron-avatar__label">Profile photo</p>
        <p className="sots-patron-avatar__hint">Optional. JPEG, PNG, or WebP.</p>
        <div className="sots-patron-avatar__actions">
          <button
            type="button"
            className="orpheum-arrow-btn orpheum-arrow-btn--gold"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "Uploading…" : avatarUrl ? "Change photo" : "Upload photo"}
          </button>
          {avatarUrl ? (
            <button
              type="button"
              className="orpheum-arrow-btn orpheum-arrow-btn--ghost"
              disabled={busy}
              onClick={handleRemove}
            >
              Remove
            </button>
          ) : null}
        </div>
        {error ? (
          <p className="sots-checkout__error" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="visually-hidden"
        disabled={busy}
        onChange={handleFileChange}
      />
    </div>
  );
}
