import { MEDIA } from "../../../js/data.js";
import { ArrowButton } from "../ArrowButton.jsx";

export function SupportMission() {
  return (
    <section className="orpheum-support-banner" aria-labelledby="support-heading">
      <div className="orpheum-support-banner__stage">
        <img
          className="orpheum-support-banner__bg"
          src={MEDIA.donateImage}
          alt=""
          loading="lazy"
          width={1200}
          height={675}
        />
        <span className="orpheum-support-banner__gradient" aria-hidden="true" />

        <div className="orpheum-support-banner__shell">
          <div className="orpheum-support-banner__frame" aria-hidden="true" />

          <div className="orpheum-support-banner__content" data-reveal>
            <h2 id="support-heading">Support Our Mission</h2>
            <p>
              Shakespeare on the Sound relies on donations to fund preservation, performances, and educational
              programs for our community.
            </p>
            <ArrowButton href="/support/donate/">Learn More</ArrowButton>
          </div>
        </div>
      </div>
    </section>
  );
}
