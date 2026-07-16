import { useId, useState } from "react";
import { ArrowButton } from "./ArrowButton.jsx";

const MAX_RESUME_BYTES = 1_500_000;

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

export function BoardApplicationForm() {
  const formId = useId();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

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
        setError("Attachment must be under about 1.5 MB. Email a larger file to Aaron instead.");
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
        setError(err?.message || "Could not read attachment.");
        return;
      }
    }

    const fields = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      location: String(data.get("location") || "").trim(),
      interest: String(data.get("interest") || "").trim(),
      background: String(data.get("background") || "").trim(),
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
        body: JSON.stringify({ form: "board", fields }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || "Could not submit your application.");
      setStatus("success");
      formEl.reset();
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
            Thank you — your board interest form was sent to Executive Director Aaron Simms. You should
            also receive a confirmation email.
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
                City / Town <span className="sots-apprentice-form__optional">(optional)</span>
                <input
                  id={`${formId}-location`}
                  name="location"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="e.g. Rowayton, Darien"
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Tell us about yourself</legend>
            <label htmlFor={`${formId}-interest`}>
              Why are you interested in joining the Board of Directors?
              <textarea id={`${formId}-interest`} name="interest" rows={4} required minLength={40} />
            </label>
            <label htmlFor={`${formId}-background`}>
              Relevant experience, skills, or community involvement{" "}
              <span className="sots-apprentice-form__optional">(optional)</span>
              <textarea id={`${formId}-background`} name="background" rows={4} />
            </label>
          </fieldset>

          <fieldset>
            <legend>Resume or bio</legend>
            <label htmlFor={`${formId}-resume`}>
              Upload a resume or short bio (PDF or Word, max 1.5 MB){" "}
              <span className="sots-apprentice-form__optional">(optional)</span>
              <input
                id={`${formId}-resume`}
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
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
              Applications go to Aaron Simms, Executive Director (
              <a href="mailto:aaron@shakespeareonthesound.org">aaron@shakespeareonthesound.org</a>
              ).
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
