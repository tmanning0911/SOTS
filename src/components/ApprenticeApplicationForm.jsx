import { useId, useState } from "react";
import { ArrowButton } from "./ArrowButton.jsx";

const TRACKS = ["Acting", "Directing", "Education", "Playwriting", "Costuming", "Production"];
const MAX_FILE_BYTES = 1_500_000;
const FILE_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

async function fileToAttachment(file, label) {
  if (!(file instanceof File) || file.size <= 0) return null;
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(
      `${label} must be under about 1.5 MB. Email larger files to stephanie@shakespeareonthesound.org.`,
    );
  }
  return {
    filename: file.name,
    contentType: file.type || "application/pdf",
    content: await readFileAsBase64(file),
  };
}

export function ApprenticeApplicationForm() {
  const formId = useId();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [tracks, setTracks] = useState([]);
  const [statementMode, setStatementMode] = useState("typed");
  const [resumeWillEmail, setResumeWillEmail] = useState(false);
  const [statementWillEmail, setStatementWillEmail] = useState(false);

  function toggleTrack(track) {
    setTracks((prev) => (prev.includes(track) ? prev.filter((t) => t !== track) : [...prev, track]));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === "loading") return;

    const formEl = event.currentTarget;
    const data = new FormData(formEl);

    if (!tracks.length) {
      setStatus("error");
      setError("Select at least one apprenticeship track.");
      return;
    }

    let resume = null;
    let personalStatementFile = null;
    try {
      resume = await fileToAttachment(data.get("resume"), "Resume");
      if (statementMode === "upload") {
        personalStatementFile = await fileToAttachment(
          data.get("personalStatementFile"),
          "Personal statement",
        );
      }
    } catch (err) {
      setStatus("error");
      setError(err?.message || "Could not read an uploaded file.");
      return;
    }

    const statementDrew = String(data.get("statementDrew") || "").trim();
    const statementArtist = String(data.get("statementArtist") || "").trim();
    const statementInterest = String(data.get("statementInterest") || "").trim();

    if (statementMode === "typed") {
      if (statementDrew.length < 40 || statementArtist.length < 40 || statementInterest.length < 40) {
        setStatus("error");
        setError("Please answer each personal-statement question (at least a short paragraph).");
        return;
      }
    } else if (!personalStatementFile && !statementWillEmail) {
      setStatus("error");
      setError("Upload your personal statement or check that you will email it separately.");
      return;
    }

    if (!resume && !resumeWillEmail) {
      setStatus("error");
      setError("Upload a resume or check that you will email it separately.");
      return;
    }

    const fields = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      age: String(data.get("age") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      address: String(data.get("address") || "").trim(),
      school: String(data.get("school") || "").trim(),
      semesterEnd: String(data.get("semesterEnd") || "").trim(),
      conflicts: String(data.get("conflicts") || "").trim(),
      tracks,
      trackOther: String(data.get("trackOther") || "").trim(),
      availableConfirm: data.get("availableConfirm") === "on",
      statementMode,
      statementDrew,
      statementArtist,
      statementInterest,
      ref1Name: String(data.get("ref1Name") || "").trim(),
      ref1Email: String(data.get("ref1Email") || "").trim(),
      ref1Phone: String(data.get("ref1Phone") || "").trim(),
      ref1Relation: String(data.get("ref1Relation") || "").trim(),
      ref2Name: String(data.get("ref2Name") || "").trim(),
      ref2Email: String(data.get("ref2Email") || "").trim(),
      ref2Phone: String(data.get("ref2Phone") || "").trim(),
      ref2Relation: String(data.get("ref2Relation") || "").trim(),
      resumeWillEmail,
      statementWillEmail,
      resume,
      personalStatementFile,
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
      setTracks([]);
      setStatementMode("typed");
      setResumeWillEmail(false);
      setStatementWillEmail(false);
    } catch (err) {
      setStatus("error");
      setError(err?.message || "Could not submit your application. Please try again.");
    }
  }

  return (
    <div className="sots-apprentice-form">
      {status === "success" ? (
        <div className="sots-apprentice-form__success" role="status">
          <h3>Application sent</h3>
          <p>
            Thank you — your application is on its way to Stephanie Eiss. You should also receive a
            confirmation email. Email any track-specific supplemental materials (monologues notes,
            lesson plans, treatments, writing samples, costume sketches) to{" "}
            <a href="mailto:stephanie@shakespeareonthesound.org">stephanie@shakespeareonthesound.org</a>{" "}
            if you have not already. Successful candidates will be invited to interview in person or
            via Zoom.
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

          <p className="sots-apprentice-form__lead">
            Complete the form below. Upload your resume and personal statement here, then email any
            track-specific supplemental materials listed above to{" "}
            <a href="mailto:stephanie@shakespeareonthesound.org">stephanie@shakespeareonthesound.org</a>.
          </p>

          <fieldset>
            <legend><span className="sots-apprentice-form__step">1</span> Your information</legend>
            <div className="sots-apprentice-form__grid">
              <label htmlFor={`${formId}-name`}>
                Name
                <input id={`${formId}-name`} name="name" type="text" required autoComplete="name" />
              </label>
              <label htmlFor={`${formId}-email`}>
                Email
                <input id={`${formId}-email`} name="email" type="email" required autoComplete="email" />
              </label>
              <label htmlFor={`${formId}-age`}>
                Age
                <input id={`${formId}-age`} name="age" type="text" inputMode="numeric" required />
              </label>
              <label htmlFor={`${formId}-phone`}>
                Phone
                <input id={`${formId}-phone`} name="phone" type="tel" required autoComplete="tel" />
              </label>
              <label htmlFor={`${formId}-address`} className="sots-apprentice-form__span-2">
                Address
                <input
                  id={`${formId}-address`}
                  name="address"
                  type="text"
                  required
                  autoComplete="street-address"
                />
              </label>
              <label htmlFor={`${formId}-school`}>
                School <span className="sots-apprentice-form__optional">(if applicable)</span>
                <input id={`${formId}-school`} name="school" type="text" autoComplete="organization" />
              </label>
              <label htmlFor={`${formId}-semester`}>
                Last day of semester{" "}
                <span className="sots-apprentice-form__optional">(if applicable)</span>
                <input id={`${formId}-semester`} name="semesterEnd" type="text" placeholder="e.g. May 1, 2026" />
              </label>
              <label htmlFor={`${formId}-conflicts`} className="sots-apprentice-form__span-2">
                Conflicts between May 4 – July 5
                <textarea
                  id={`${formId}-conflicts`}
                  name="conflicts"
                  rows={3}
                  placeholder="List any known conflicts, or write None"
                  required
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend><span className="sots-apprentice-form__step">2</span> Which apprenticeship?</legend>
            <p className="sots-apprentice-form__hint">You can choose more than one.</p>
            <div className="sots-apprentice-form__tracks" role="group" aria-label="Apprenticeship tracks">
              {TRACKS.map((track) => (
                <label key={track} className="sots-apprentice-form__check" htmlFor={`${formId}-track-${track}`}>
                  <input
                    id={`${formId}-track-${track}`}
                    type="checkbox"
                    checked={tracks.includes(track)}
                    onChange={() => toggleTrack(track)}
                  />
                  <span>{track === "Acting" ? "Acting (SOS Players)" : track}</span>
                </label>
              ))}
            </div>
            <label htmlFor={`${formId}-trackOther`}>
              Proposed custom track <span className="sots-apprentice-form__optional">(optional)</span>
              <input
                id={`${formId}-trackOther`}
                name="trackOther"
                type="text"
                placeholder="Subject to approval by the organization"
              />
            </label>
            <label className="sots-apprentice-form__check" htmlFor={`${formId}-available`}>
              <input id={`${formId}-available`} name="availableConfirm" type="checkbox" required />
              <span>I can start Monday, May 4, 2026 and am available through the program dates.</span>
            </label>
          </fieldset>

          <fieldset>
            <legend><span className="sots-apprentice-form__step">3</span> Reference 1 — professional / educational</legend>
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
                <input
                  id={`${formId}-ref1Relation`}
                  name="ref1Relation"
                  type="text"
                  placeholder="e.g. Professor, director"
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend><span className="sots-apprentice-form__step">4</span> Reference 2 — personal</legend>
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
            <legend><span className="sots-apprentice-form__step">5</span> Resume</legend>
            <label htmlFor={`${formId}-resume`}>
              Resume (PDF or Word, max 1.5 MB)
              <input
                id={`${formId}-resume`}
                name="resume"
                type="file"
                accept={FILE_ACCEPT}
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

          <fieldset>
            <legend><span className="sots-apprentice-form__step">6</span> Personal statement</legend>
            <p className="sots-apprentice-form__hint">
              Answer the three questions below, or upload a personal statement file (as on the previous
              site). Your personal statement is the most important part of the application.
            </p>
            <div className="sots-apprentice-form__mode" role="group" aria-label="Personal statement format">
              <label className="sots-apprentice-form__check" htmlFor={`${formId}-mode-typed`}>
                <input
                  id={`${formId}-mode-typed`}
                  type="radio"
                  name="statementModeUi"
                  checked={statementMode === "typed"}
                  onChange={() => {
                    setStatementMode("typed");
                    setStatementWillEmail(false);
                  }}
                />
                <span>Type answers here</span>
              </label>
              <label className="sots-apprentice-form__check" htmlFor={`${formId}-mode-upload`}>
                <input
                  id={`${formId}-mode-upload`}
                  type="radio"
                  name="statementModeUi"
                  checked={statementMode === "upload"}
                  onChange={() => setStatementMode("upload")}
                />
                <span>Upload personal statement</span>
              </label>
            </div>

            {statementMode === "typed" ? (
              <>
                <label htmlFor={`${formId}-drew`}>
                  What drew you to theater?
                  <textarea id={`${formId}-drew`} name="statementDrew" rows={4} required minLength={40} />
                </label>
                <label htmlFor={`${formId}-artist`}>
                  Who are you as an artist, and where are you in your artistic journey?
                  <textarea id={`${formId}-artist`} name="statementArtist" rows={4} required minLength={40} />
                </label>
                <label htmlFor={`${formId}-interest`}>
                  What interests you in apprenticing at Shakespeare on the Sound, and what do you hope to
                  gain?
                  <textarea
                    id={`${formId}-interest`}
                    name="statementInterest"
                    rows={4}
                    required
                    minLength={40}
                  />
                </label>
              </>
            ) : (
              <>
                <label htmlFor={`${formId}-statementFile`}>
                  Upload personal statement (PDF or Word, max 1.5 MB)
                  <input
                    id={`${formId}-statementFile`}
                    name="personalStatementFile"
                    type="file"
                    accept={FILE_ACCEPT}
                    disabled={statementWillEmail}
                  />
                </label>
                <label className="sots-apprentice-form__check" htmlFor={`${formId}-statementLater`}>
                  <input
                    id={`${formId}-statementLater`}
                    type="checkbox"
                    checked={statementWillEmail}
                    onChange={(e) => setStatementWillEmail(e.target.checked)}
                  />
                  <span>
                    I&apos;ll email my personal statement separately to{" "}
                    <a href="mailto:stephanie@shakespeareonthesound.org">
                      stephanie@shakespeareonthesound.org
                    </a>
                  </span>
                </label>
              </>
            )}
          </fieldset>

          {error ? (
            <p className="sots-apprentice-form__error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="sots-apprentice-form__actions">
            <ArrowButton type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Submitting…" : "Apply"}
            </ArrowButton>
            <p className="sots-apprentice-form__note">
              Applications go to Stephanie Eiss, Director of Education and Outreach. Deadline: Sunday,
              March 8, 2026. Questions?{" "}
              <a href="mailto:stephanie@shakespeareonthesound.org">stephanie@shakespeareonthesound.org</a>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
