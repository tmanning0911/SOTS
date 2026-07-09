import { ArrowButton } from "../ArrowButton.jsx";

const IMPACT_IMAGE = "/images/news/kids-kings.jpg";

function ImpactSquiggle() {
  return (
    <svg
      className="orpheum-impact-frame__squiggle"
      viewBox="0 0 262.66 50.88"
      strokeWidth="2"
      strokeLinecap="round"
      stroke="currentColor"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M1,49.88C12.83,33.6,25.27,17.44,45.71,7.73,54.13,3.67,65.36.43,74.23,1.08c5.98.45,9.63,2.74,9.4,6.78-.93,6.71-6.51,11.82-10.4,17.12-4.2,5.15-15.37,18.92-2.96,17.41,18.35-3.44,34.01-21.1,51.58-28.07,7.12-3.04,14.45-4.75,16.8-3.12,5.07,4.64-14.32,19.05-2.82,24.65,8.76,3.52,19.48,1.5,28.61-.15,20.84-4.28,41.86-13.17,73.84-12.03,7.7.24,15.59.95,23.38,1.66" />
    </svg>
  );
}

export function ImpactSection() {
  return (
    <section className="orpheum-impact-split" aria-labelledby="impact-heading">
      <div className="orpheum-impact-split__inner" data-reveal>
        <div className="orpheum-impact-split__media">
          <div className="orpheum-impact-frame">
            <span className="orpheum-impact-frame__accent" aria-hidden="true" />
            <div className="orpheum-impact-frame__photo">
              <img
                className="orpheum-impact-frame__image"
                src={IMPACT_IMAGE}
                alt="Young performers at Shakespeare on the Sound"
                loading="lazy"
                width={600}
                height={600}
              />
            </div>
            <ImpactSquiggle />
          </div>
        </div>

        <div className="orpheum-impact-split__copy">
          <div className="orpheum-impact-split__prose">
            <p className="orpheum-impact-split__eyebrow">Making an impact</p>
            <h2 id="impact-heading" className="orpheum-impact-split__title">
              Setting the Scene for a
              <br />
              Better Connecticut
            </h2>
            <p>
              Our programs create positive change and foster community by providing a stage for creative expression —
              in the park, in schools, and across Fairfield County.
            </p>
            <ArrowButton href="/education/in-schools/">Learn Our Impact</ArrowButton>
          </div>
        </div>
      </div>
    </section>
  );
}
