import { visitInfo, parkDirectionsUrl } from '@/content/site';

const MAP_QUERY = encodeURIComponent(`${visitInfo.park}, ${visitInfo.address}`);
const EMBED_URL = `https://maps.google.com/maps?q=${MAP_QUERY}&z=15&output=embed`;

/** Embedded map — Pinkney Park, Rowayton. */
export default function ParkLocationMap({ className = '', showCaption = true }) {
  const directionsUrl = parkDirectionsUrl();

  return (
    <figure className={`visit-map ${className}`}>
      <iframe
        title={`Map — ${visitInfo.park}, ${visitInfo.address}`}
        src={EMBED_URL}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="visit-map__frame"
      />
      {showCaption && (
        <figcaption className="visit-map__caption">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="visit-map__location-link"
          >
            <span className="visit-map__label">{visitInfo.park}</span>
            <span className="visit-map__city">Rowayton, CT</span>
          </a>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="visit-map__directions"
          >
            Get directions
          </a>
        </figcaption>
      )}
    </figure>
  );
}
