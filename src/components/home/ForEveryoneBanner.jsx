import { HOME_FOR_EVERYONE } from "../../../js/data.js";

export function ForEveryoneBanner() {
  return (
    <section className="cdc-everyone" aria-labelledby="cdc-everyone-heading">
      <h2 id="cdc-everyone-heading" className="cdc-everyone__headline">
        {HOME_FOR_EVERYONE.headline}
        <span>{HOME_FOR_EVERYONE.highlight}</span>
      </h2>
      <p className="cdc-everyone__sub">{HOME_FOR_EVERYONE.subhead}</p>
    </section>
  );
}
