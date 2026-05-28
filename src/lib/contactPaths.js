/** In-app contact routes — avoid exposing raw addresses in the UI */

export const contactPaths = {
  general: '/contact',
  education: '/contact?topic=education',
  tickets: '/contact?topic=tickets',
  sponsorship: '/contact?topic=sponsorship',
  volunteer: '/contact?topic=volunteer',
  gala: '/contact?topic=sponsorship',
};

/** Map mailto hrefs from legacy content to contact routes */
export function mailtoToContactPath(href) {
  if (!href?.startsWith('mailto:')) return href;
  const addr = href.replace(/^mailto:/i, '').split('?')[0].toLowerCase();
  if (addr.includes('stephanie') || addr.includes('nick@')) return contactPaths.education;
  if (addr.includes('contactus')) return contactPaths.general;
  return contactPaths.general;
}
