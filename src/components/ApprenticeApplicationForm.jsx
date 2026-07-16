import { useId, useState } from "react";
import { ArrowButton } from "./ArrowButton.jsx";

const TRACKS = [
  "Acting — SOS Players",
  "Directing",
  "Education",
  "Playwriting",
  "Costuming",
  "Production",
  "Other",
];

const MAX_RESUME_BYTES = 1_500_000;
const APPLICATIONS_OPEN = false;

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Could not read resume file."));
    reader.readAsDataURL(file);
  });
}

export function ApprenticeApplicationForm() {
  const formId = useId();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [track, setTrack] = useState("");
  const [resumeWillEmail, setResumeWillEmail] = useState(false);

  if (!APPLICATIONS_OPEN) {
    return (
      <div className="sots-apprentice-form sots-apprentice-form--closed" id="apply">
        <p className="sots-apprentice-form__closed-title">Applications closed</p>
        <p>
          The 2026 Apprentice Company application period ended March 8, 2026. For questions about
          future seasons, email{" "}
          <a href="mailto:stephanie@shakespeareonthesound.org">stephanie@shakespeareonthesound.org</a>.
        </p>
      </div>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === "loading") return;

    const formEl = event.currentTarget;
    const data = new FormData(formEl);
    const resumeFile = data.get("resume");

    let resume = null;
    if (resumeFile instanceof File && resumeFile.size > 0) {
      if (resumeFile.size > MAX_RESUME_BYTES) {
        setStatus("error");
        setError("Resume must be under about 1.5 MB. Email a larger file to Stephanie instead.");
        return;
      }
      try {
        resume = {
          filename: resumeFile.name,
          contentType: resumeFile.type || "application/pdf",
          content: await readFileAsBase64(resumeFile),
        };
      } catch (err) {
        setStatus("error");
        setError(err?.message || "Could not read resume file.");
        return;
      }
    }

    const fields = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      location: String(data.get("location") || "").trim(),
      track: String(data.get("track") || "").trim(),
      trackOther: String(data.get("trackOther") || "").trim(),
      availableConfirm: data.get("availableConfirm") === "on",
      statementDrew: String(data.get("statementDrew") || "").trim(),
      statementArtist: String(data.get("statementArtist") || "").trim(),
      statementInterest: String(data.get("statementInterest") || "").trim(),
      ref1Name: String(data.get("ref1Name") || "").trim(),
      ref1Email: String(data.get("ref1Email") || "").trim(),
      ref1Phone: String(data.get("ref1Phone") || "").trim(),
      ref1Relation: String(data.get("ref1Relation") || "").trim(),
      ref2Name: String(data.get("ref2Name") || "").trim(),
      ref2Email: String(data.get("ref2Email") || "").trim(),
      ref2Phone: String(data.get("ref2Phone") || "").trim(),
      ref2Relation: String(data.get("ref2Relation") || "").trim(),
      resumeWillEmail: resumeWillEmail,
      resume,
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
      "bot-field": String(data.get("bot-field") || ""),
    };

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form: "apprentice", fields }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || "Could not submit your application.");
      setStatus("success");
      formEl.reset();
      setTrack("");
      setResumeWillEmail(false);
    } catch (err) {
      setStatus("error");
      setError(err?.message || "Could not submit your application. Please try again.");
    }
  }

  return (
    <div className="sots-apprentice-form" id="apply">
      {status === "success" ? (
        <div className="sots-apprentice-form__success" role="status">
          <h3>Application sent</h3>
          <p>
            Thank you — your application is on its way to Stephanie Eiss. You should also receive a
            confirmation email. Successful candidates will be invited to interview in person or via Zoom.
          </p>
          <ArrowButton type="button" onClick={() => setStatus("idle")}>
            Submit another application
          </ArrowButton>
        </div>
      ) : (
        <form className="sots-apprentice-form__form" onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            name="bot-field"
            tabIndex={-1}
            autoComplete="off"
            className="sots-apprentice-form__honeypot"
            aria-hidden="true"
          />

          <fieldset>
            <legend>Your information</legend>
            <div className="sots-apprentice-form__grid">
              <label htmlFor={`${formId}-name`}>
                Full name
                <input id={`${formId}-name`} name="name" type="text" required autoComplete="name" />
              </label>
              <label htmlFor={`${formId}-email`}>
                Email
                <input id={`${formId}-email`} name="email" type="email" required autoComplete="email" />
              </label>
              <label htmlFor={`${formId}-phone`}>
                Phone <span className="sots-apprentice-form__optional">(optional)</span>
                <input id={`${formId}-phone`} name="phone" type="tel" autoComplete="tel" />
              </label>
              <label htmlFor={`${formId}-location`}>
                City / State <span className="sots-apprentice-form__optional">(optional)</span>
                <input id={`${formId}-location`} name="location" type="text" autoComplete="address-level2" />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Apprenticeship track</legend>
            <label htmlFor={`${formId}-track`}>
              Discipline
              <select
                id={`${formId}-track`}
                name="track"
                required
                value={track}
                onChange={(e) => setTrack(e.target.value)}
              >
                <option value="">Select a track…</option>
                {TRACKS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            {track === "Other" ? (
              <label htmlFor={`${formId}-trackOther`}>
                Describe your proposed track
                <input id={`${formId}-trackOther`} name="trackOther" type="text" required />
              </label>
            ) : null}
            <label className="sots-apprentice-form__check" htmlFor={`${formId}-available`}>
              <input id={`${formId}-available`} name="availableConfirm" type="checkbox" required />
              <span>I can start Monday, May 4, 2026 and am available through the program dates.</span>
            </label>
          </fieldset>

          <fieldset>
            <legend>Personal statement</legend>
            <label htmlFor={`${formId}-drew`}>
              What drew you to theater?
              <textarea id={`${formId}-drew`} name="statementDrew" rows={4} required minLength={40} />
            </label>
            <label htmlFor={`${formId}-artist`}>
              Who are you as an artist, and where are you in your artistic journey?
              <textarea id={`${formId}-artist`} name="statementArtist" rows={4} required minLength={40} />
            </label>
            <label htmlFor={`${formId}-interest`}>
              What interests you in apprenticing at Shakespeare on the Sound, and what do you hope to gain?
              <textarea id={`${formId}-interest`} name="statementInterest" rows={4} required minLength={40} />
            </label>
          </fieldset>

          <fieldset>
            <legend>Reference 1 — professional / educational</legend>
            <div className="sots-apprentice-form__grid">
              <label htmlFor={`${formId}-ref1Name`}>
                Name
                <input id={`${formId}-ref1Name`} name="ref1Name" type="text" required />
              </label>
              <label htmlFor={`${formId}-ref1Email`}>
                Email
                <input id={`${formId}-ref1Email`} name="ref1Email" type="email" required />
              </label>
              <label htmlFor={`${formId}-ref1Phone`}>
                Phone <span className="sots-apprentice-form__optional">(optional)</span>
                <input id={`${formId}-ref1Phone`} name="ref1Phone" type="tel" />
              </label>
              <label htmlFor={`${formId}-ref1Relation`}>
                Relationship <span className="sots-apprentice-form__optional">(optional)</span>
                <input id={`${formId}-ref1Relation`} name="ref1Relation" type="text" placeholder="e.g. Professor, director" />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Reference 2 — personal</legend>
            <div className="sots-apprentice-form__grid">
              <label htmlFor={`${formId}-ref2Name`}>
                Name
                <input id={`${formId}-ref2Name`} name="ref2Name" type="text" required />
              </label>
              <label htmlFor={`${formId}-ref2Email`}>
                Email
                <input id={`${formId}-ref2Email`} name="ref2Email" type="email" required />
              </label>
              <label htmlFor={`${formId}-ref2Phone`}>
                Phone <span className="sots-apprentice-form__optional">(optional)</span>
                <input id={`${formId}-ref2Phone`} name="ref2Phone" type="tel" />
              </label>
              <label htmlFor={`${formId}-ref2Relation`}>
                Relationship <span className="sots-apprentice-form__optional">(optional)</span>
                <input id={`${formId}-ref2Relation`} name="ref2Relation" type="text" />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Resume</legend>
            <label htmlFor={`${formId}-resume`}>
              Upload resume (PDF or Word, max 1.5 MB)
              <input
                id={`${formId}-resume`}
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                disabled={resumeWillEmail}
              />
            </label>
            <label className="sots-apprentice-form__check" htmlFor={`${formId}-resumeLater`}>
              <input
                id={`${formId}-resumeLater`}
                type="checkbox"
                checked={resumeWillEmail}
                onChange={(e) => setResumeWillEmail(e.target.checked)}
              />
              <span>
                I&apos;ll email my resume separately to{" "}
                <a href="mailto:stephanie@shakespeareonthesound.org">stephanie@shakespeareonthesound.org</a>
              </span>
            </label>
          </fieldset>

          {error ? (
            <p className="sots-apprentice-form__error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="sots-apprentice-form__actions">
            <ArrowButton type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Submitting…" : "Submit application"}
            </ArrowButton>
            <p className="sots-apprentice-form__note">
              Applications go to Stephanie Eiss, Director of Education and Outreach. Deadline: Sunday, March 8,
              2026.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
