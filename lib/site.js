// Practice details. Anything the practice has not confirmed stays a visible
// TODO(copy) marker: render these through <Todo>, never as real-looking text.
export const site = {
  name: "Traverso Hand Institute",
  short: "THInc",
  surgeon: "Dr. Purnell Traverso",
  role: "Hand and wrist surgeon",
  city: "Coral Springs, Florida",
  url: "https://traversohand.com",
  placeholders: {
    phone: "Practice phone number",
    fax: "Referral fax number",
    address: "Street address, Coral Springs, FL",
    hours: "Office hours",
    callback: "Typical call-back time",
    insurance: "Accepted insurance plans",
    referralEmail: "Secure referral channel",
  },
};

// Labels live in lib/copy under ui.nav
export const nav = [
  { href: "/#symptoms", key: "symptoms" },
  { href: "/#anatomy", key: "anatomy" },
  { href: "/#visit", key: "visit" },
  { href: "/about", key: "about" },
  { href: "/physicians", key: "physicians" },
];
