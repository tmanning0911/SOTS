import { site } from './site';

export const cookieCategories = [
  {
    id: 'essential',
    title: 'Essential',
    description: 'Required for basic site features such as remembering your cookie choices and keeping forms secure.',
    required: true,
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Help us understand how visitors use the site so we can improve pages and content. No advertising cookies.',
    required: false,
  },
];

export const cookiePolicySections = [
  {
    title: 'What are cookies?',
    body:
      'Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and understand how it is used.',
  },
  {
    title: 'How we use cookies',
    body: `${site.name} uses cookies to keep the site working properly, remember your cookie choices, and — only if you accept analytics cookies — understand general traffic patterns so we can improve the experience.`,
  },
  {
    title: 'Essential cookies',
    body:
      'These cookies are necessary for the website to function. They include your saved cookie preferences. You cannot opt out of essential cookies while using the site.',
  },
  {
    title: 'Analytics cookies',
    body:
      'If you choose to accept analytics cookies, we may use privacy-focused measurement tools to see which pages are visited and how people move through the site. We do not sell your data.',
  },
  {
    title: 'Managing your choices',
    body:
      'You can change your preferences at any time using the Cookie settings link in the footer. You can also clear cookies through your browser settings.',
  },
  {
    title: 'Contact',
    body: `Questions about this policy? Email us at ${site.email}.`,
  },
];
