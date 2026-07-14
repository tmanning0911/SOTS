import { MEDIA } from "../../../js/data.js";
import { ArrowButton } from "../ArrowButton.jsx";
import { VenueDuo } from "./VenueDuo.jsx";

export function OurStorySection() {
  return (
    <section className="orpheum-our-story" aria-labelledby="story-heading">
      <p className="orpheum-our-story__watermark" aria-hidden="true">
        Our Story
      </p>

      <div className="orpheum-our-story__inner" data-reveal>
        <div className="orpheum-our-story__copy">
          <h2 id="story-heading" className="orpheum-underline-heading orpheum-underline-heading--light">
            Enriching Communities Through Performing Arts
          </h2>
          <p>
            Shakespeare on the Sound began in 1998 with a simple aim: bring free, professional outdoor Shakespeare
            to Fairfield County. Today, summer productions at Shakespeare in Pinkney Park, education programs in schools and camps,
            and community events come together to create lasting memories and nurture the performing arts under the
            open sky.
          </p>
          <ArrowButton href="/about/mission-history/" variant="light">
            Learn More
          </ArrowButton>
        </div>

        <div className="orpheum-our-story__media">
          <img
            src={MEDIA.educationBanner}
            alt="Performers at Shakespeare on the Sound"
            loading="lazy"
            width={700}
            height={820}
          />
        </div>
      </div>

      <div className="orpheum-our-story__tickets">
        <VenueDuo />
      </div>
    </section>
  );
}
