/**
 * Shared inner-page hero — cinematic (photo + veil) or plain band.
 * Matches homepage / production page visual language.
 */
export function InnerPageHero({
  eyebrow,
  title,
  intro,
  image,
  variant,
  compact = false,
  beforeTitle,
  afterTitle,
  actions,
  introClassName = "orpheum-inner-page__intro",
  belowIntro,
  className = "",
  innerClassName = "",
}) {
  const resolvedVariant = variant ?? (image ? "cinematic" : "plain");
  const cinematic = resolvedVariant === "cinematic" && Boolean(image);

  const headerClass = [
    "orpheum-page-hero",
    cinematic ? "orpheum-page-hero--cinematic" : "orpheum-page-hero--plain",
    compact ? "orpheum-page-hero--compact" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const innerClass = ["orpheum-page-hero__inner", "orpheum-inner-page__hero-inner", innerClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClass}>
      {cinematic ? (
        <>
          <div
            className="orpheum-page-hero__bg"
            style={{ backgroundImage: `url('${image}')` }}
            aria-hidden="true"
          />
          <div className="orpheum-page-hero__veil" aria-hidden="true" />
        </>
      ) : null}
      <div className={innerClass} data-reveal>
        {eyebrow ? <p className="orpheum-inner-page__eyebrow">{eyebrow}</p> : null}
        {beforeTitle}
        {title ? <h1>{title}</h1> : null}
        {afterTitle}
        {intro ? <p className={introClassName}>{intro}</p> : null}
        {belowIntro}
        {actions ? <div className="orpheum-page-hero__actions">{actions}</div> : null}
      </div>
    </header>
  );
}
