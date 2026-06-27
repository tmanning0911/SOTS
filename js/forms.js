/**
 * Accessible form handling — Microsoft Web Dev for Beginners (Forms lesson)
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setFieldError(field, message) {
  const group = field.closest(".form-group");
  if (!group) return;

  let error = group.querySelector(".form-error");
  if (!error) {
    error = document.createElement("p");
    error.className = "form-error";
    error.id = `${field.id}-error`;
    group.appendChild(error);
  }

  if (message) {
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", error.id);
    error.textContent = message;
    error.hidden = false;
  } else {
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");
    error.textContent = "";
    error.hidden = true;
  }
}

function validateField(field) {
  const value = field.value.trim();

  if (field.required && !value) {
    setFieldError(field, "This field is required.");
    return false;
  }

  if (field.type === "email" && value && !EMAIL_RE.test(value)) {
    setFieldError(field, "Enter a valid email address.");
    return false;
  }

  if (field.name === "name" && value.length < 2) {
    setFieldError(field, "Please enter your full name.");
    return false;
  }

  if (field.name === "message" && value.length < 10) {
    setFieldError(field, "Message must be at least 10 characters.");
    return false;
  }

  setFieldError(field, null);
  return true;
}

export function initAccessibleForm(formId, { storageKey, onSuccess } = {}) {
  const form = document.getElementById(formId);
  if (!form) return;

  const fields = [...form.querySelectorAll("input, textarea")];

  if (storageKey) {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        fields.forEach((f) => {
          if (data[f.name]) f.value = data[f.name];
        });
      } catch {
        /* ignore corrupt draft */
      }
    }

    form.addEventListener("input", () => {
      const draft = Object.fromEntries(fields.map((f) => [f.name, f.value]));
      localStorage.setItem(storageKey, JSON.stringify(draft));
    });
  }

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const valid = fields.every(validateField);
    if (!valid) {
      const firstInvalid = fields.find((f) => f.getAttribute("aria-invalid") === "true");
      firstInvalid?.focus();
      return;
    }

    const msg = form.querySelector("[data-form-message]");
    if (msg) {
      msg.hidden = false;
      msg.setAttribute("role", "status");
      msg.textContent = onSuccess?.() ?? "Thanks for contacting us!";
    }

    if (storageKey) localStorage.removeItem(storageKey);
    form.reset();
    fields.forEach((f) => setFieldError(f, null));
  });
}
