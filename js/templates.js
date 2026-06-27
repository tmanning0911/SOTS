/**
 * HTML template utilities — Microsoft Web Dev for Beginners (Banking App pattern)
 * https://github.com/microsoft/Web-Dev-For-Beginners/tree/main/7-bank-project
 */

export function cloneTemplate(templateId) {
  const template = document.getElementById(templateId);
  if (!template) return null;
  return template.content.cloneNode(true);
}

export function fillText(root, selector, value) {
  const el = root.querySelector(selector);
  if (el && value != null) el.textContent = value;
}

export function fillAttr(root, selector, attr, value) {
  const el = root.querySelector(selector);
  if (el && value != null) el.setAttribute(attr, value);
}

export function mountTemplate(templateId, target, configure) {
  const fragment = cloneTemplate(templateId);
  if (!fragment) return null;
  if (configure) configure(fragment);
  target.appendChild(fragment);
  return target.lastElementChild;
}

export function renderInto(targetId, templateId, items, configure) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.replaceChildren();
  for (const item of items) {
    mountTemplate(templateId, target, (frag) => configure(frag, item));
  }
}
