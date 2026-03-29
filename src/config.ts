import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://randiantech.com/",
  author: "Randiantech",
  profile: "https://randiantech.com",
  desc: "Randiantech — AI consulting, enterprise AI training, and staff augmentation for companies building the future.",
  title: "Randiantech",
  ogImage: "og.png",
  lightAndDarkMode: true,
};

export const LOCALE = {
  lang: "en",
  langTag: ["en-EN"],
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/randiantech",
    linkTitle: `${SITE.title} on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/randiantech",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:hello@randiantech.com",
    linkTitle: `Contact ${SITE.title}`,
    active: true,
  },
  {
    name: "X",
    href: "https://x.com/randiantech",
    linkTitle: `${SITE.title} on X`,
    active: false,
  },
];
