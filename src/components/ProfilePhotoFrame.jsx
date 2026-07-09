export function ProfilePhotoFrame({ children, shape = "square", size = "md", empty = false }) {
  return (
    <div
      className={`orpheum-profile-frame orpheum-profile-frame--${shape} orpheum-profile-frame--${size}${
        empty ? " orpheum-profile-frame--empty" : ""
      }`}
    >
      {!empty ? <div className="orpheum-profile-frame__accent" aria-hidden="true" /> : null}
      <div className="orpheum-profile-frame__photo">{children}</div>
    </div>
  );
}
