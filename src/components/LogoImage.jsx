import { images } from '@/content/images';

/** Site logo with WebP when available (PNG fallback for older browsers / favicons). */
export default function LogoImage({ className = '', priority = false }) {
  return (
    <picture>
      <source srcSet="/images/logo.webp" type="image/webp" />
      <img
        src={images.logo}
        alt="Shakespeare on the Sound"
        width={200}
        height={64}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        className={className}
      />
    </picture>
  );
}
