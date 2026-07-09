export function ProfilePhotoFrame({ children, shape = "square", size = "md" }) {
  return (
    <div className={`orpheum-profile-frame orpheum-profile-frame--${shape} orpheum-profile-frame--${size}`}>
      <div className="orpheum-profile-frame__accent" aria-hidden="true" />
      <div className="orpheum-profile-frame__photo">{children}</div>
    </div>
  );
}
