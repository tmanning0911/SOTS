import { PlanVisitBar } from "./home/PlanVisitBar.jsx";
import { SupportMission } from "./home/SupportMission.jsx";
import { Newsletter } from "./home/Newsletter.jsx";

export function PageTail({ showVisit = true, showSupport = false, showNewsletter = true }) {
  return (
    <div className="orpheum-page-tail">
      {showVisit ? <PlanVisitBar /> : null}
      {showSupport ? <SupportMission /> : null}
      {showNewsletter ? <Newsletter /> : null}
    </div>
  );
}
