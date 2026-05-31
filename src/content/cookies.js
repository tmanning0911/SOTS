import { site } from './site';

export const cookieCategories = [
  {
    id: 'essential',
    title: 'Essential',
    description:
      'Required for basic site features such as remembering your cookie choices and keeping forms secure.',
    required: true,
  },
];

export const cookiePolicySections = [
  {
    title: 'What are cookies?',
    body:
      'Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences.',
  },
  {
    title: 'How we use cookies',
    body: `${site.name} uses essential cookies to keep the site working properly and to remember your cookie preferences. We do not use advertising cookies.`,
  },
  {
    title: 'Essential cookies',
    body:
      'These cookies are necessary for the website to function. They include your saved cookie preferences. You cannot opt out of essential cookies while using the site.',
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
