/** Hamlet-style menu toggle — custom skull-in-hand artwork */
export default function MenuSkullIcon({ className = '', light = false }) {
  return (
    <picture>
      <source srcSet="/images/icons/menu-skull.webp" type="image/webp" />
      <img
        src="/images/icons/menu-skull.png"
        alt=""
        aria-hidden
        width={26}
        height={26}
        className={`nav-menu-skull ${light ? 'nav-menu-skull--light' : ''} ${className}`}
      />
    </picture>
  );
}
