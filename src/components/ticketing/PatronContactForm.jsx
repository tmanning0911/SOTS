import { useEffect, useState } from "react";
import { PatronAvatarField } from "./PatronAvatarField.jsx";

const EMPTY_ADDRESS = {
  line1: "",
  line2: "",
  city: "",
  state: "CT",
  postalCode: "",
};

export function PatronContactForm({
  profile,
  email,
  avatarUrl,
  onSave,
  onUploadAvatar,
  onRemoveAvatar,
  saving = false,
  loading = false,
  uploadingAvatar = false,
  showIntro = true,
}) {
  const [name, setName] = useState(profile?.name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [address, setAddress] = useState(() => ({
    ...EMPTY_ADDRESS,
    ...(profile?.address ?? {}),
    state: profile?.address?.state || "CT",
  }));
  const [marketingOptIn, setMarketingOptIn] = useState(Boolean(profile?.marketingOptIn));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(profile?.name ?? "");
    setPhone(profile?.phone ?? "");
    setAddress({
      ...EMPTY_ADDRESS,
      ...(profile?.address ?? {}),
      state: profile?.address?.state || "CT",
    });
    setMarketingOptIn(Boolean(profile?.marketingOptIn));
  }, [profile]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    if (loading) {
      setError("Still loading your saved details — wait a moment, then save.");
      return;
    }
    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }
    try {
      await onSave({
        name: name.trim(),
        phone: phone.trim(),
        address,
        marketingOptIn,
      });
      setMessage("Your contact information has been saved.");
    } catch (err) {
      setError(err.message || "Could not save your information.");
    }
  }

  const fieldsDisabled = saving || loading;

  return (
    <form className="sots-patron-contact" onSubmit={handleSubmit} noValidate>
      {showIntro ? (
        <div className="sots-patron-contact__intro">
          <h2 id="patron-contact-heading">Contact information</h2>
          <p>
            Kept on file so the box office can reach you. Season email only if you opt in below.
          </p>
        </div>
      ) : (
        <p className="sots-patron-contact__intro sots-patron-contact__intro--nested">
          Kept on file so the box office can reach you. Season email only if you opt in below.
        </p>
      )}

      {onUploadAvatar && onRemoveAvatar ? (
        <PatronAvatarField
          avatarUrl={avatarUrl}
          name={name}
          email={email}
          onUpload={onUploadAvatar}
          onRemove={onRemoveAvatar}
          uploading={uploadingAvatar}
          disabled={fieldsDisabled}
        />
      ) : null}

      <div className="sots-patron-contact__grid">
        <label className="sots-patron-contact__field sots-patron-contact__field--wide">
          <span>Email</span>
          <input type="email" value={email || ""} readOnly disabled />
        </label>
        <label className="sots-patron-contact__field sots-patron-contact__field--wide">
          <span>Full name</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Smith"
            disabled={fieldsDisabled}
          />
        </label>
        <label className="sots-patron-contact__field">
          <span>Phone</span>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(203) 555-0100"
            disabled={fieldsDisabled}
          />
        </label>
        <label className="sots-patron-contact__field sots-patron-contact__field--wide">
          <span>Street address</span>
          <input
            type="text"
            name="address-line1"
            autoComplete="address-line1"
            value={address.line1}
            onChange={(e) => setAddress((prev) => ({ ...prev, line1: e.target.value }))}
            placeholder="123 Main Street"
            disabled={fieldsDisabled}
          />
        </label>
        <label className="sots-patron-contact__field sots-patron-contact__field--wide">
          <span>
            Apt / suite <span className="sots-patron-contact__optional">(optional)</span>
          </span>
          <input
            type="text"
            name="address-line2"
            autoComplete="address-line2"
            value={address.line2}
            onChange={(e) => setAddress((prev) => ({ ...prev, line2: e.target.value }))}
            disabled={fieldsDisabled}
          />
        </label>
        <label className="sots-patron-contact__field">
          <span>City</span>
          <input
            type="text"
            name="city"
            autoComplete="address-level2"
            value={address.city}
            onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
            disabled={fieldsDisabled}
          />
        </label>
        <label className="sots-patron-contact__field sots-patron-contact__field--state">
          <span>State</span>
          <input
            type="text"
            name="state"
            autoComplete="address-level1"
            value={address.state}
            onChange={(e) => setAddress((prev) => ({ ...prev, state: e.target.value }))}
            disabled={fieldsDisabled}
          />
        </label>
        <label className="sots-patron-contact__field">
          <span>ZIP</span>
          <input
            type="text"
            name="postal-code"
            autoComplete="postal-code"
            value={address.postalCode}
            onChange={(e) => setAddress((prev) => ({ ...prev, postalCode: e.target.value }))}
            disabled={fieldsDisabled}
          />
        </label>
      </div>

      <label className="sots-patron-contact__consent">
        <input
          type="checkbox"
          checked={marketingOptIn}
          onChange={(e) => setMarketingOptIn(e.target.checked)}
          disabled={fieldsDisabled}
        />
        <span>
          Yes, Shakespeare on the Sound may email me about performances, community programs, and fundraising.
          You can update this preference anytime.
        </span>
      </label>

      <div className="sots-patron-contact__actions">
        <button type="submit" className="orpheum-arrow-btn orpheum-arrow-btn--gold" disabled={fieldsDisabled}>
          {loading ? "Loading…" : saving ? "Saving…" : "Save contact information"}
        </button>
        {message ? (
          <p className="sots-checkout__hint sots-checkout__hint--success" role="status">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="sots-checkout__error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
