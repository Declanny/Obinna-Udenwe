export type Milestone = { year: string; text: string };

export type BookDetail = {
  slug: string;
  title: string;
  listLabel: string;
  listTagline: string;
  listDescription: string;
  cover: string;

  heroLabel: string;
  genre: string;
  synopsis: string;

  milestones: Milestone[];
  quote: string;

  launchPhotos: string[];
};

export const BOOKS: BookDetail[] = [
  {
    slug: "years-of-shame",
    title: "Years of Shame",
    listLabel: "Bestseller",
    listTagline:
      "A sweeping saga of legacy and redemption in the heart of the savannah.",
    listDescription:
      "In his most ambitious work to date, Udenwe weaves a tapestry of political intrigue and personal sacrifice that redefines the modern West African epic.",
    cover: "/bookpageimages/WhatsApp Image 2026-03-22 at 14.10.51 1 (3).png",

    heroLabel: "New — 2025",
    genre: "Fiction — African Political Fiction — Epic",
    synopsis:
      "Set in southern Nigeria, Years of Shame tells the haunting tale of Patrice Nebe, a man whose defiance and misplaced pride lead him to take the oath of Oji — a feared ritual with a toll of wealth and children. The novel unravels the devastating ripple effects of this decision; spanning generations and culminating in a heart-wrenching reckoning for his descendants. With brilliant storytelling and unforgettable characters, Udenwe crafts a moving exploration of shame, loss, and the unrelenting grip of tradition.",

    milestones: [
      { year: "2025", text: "Over 1,000 copies sold on launch day across major markets." },
      { year: "2025", text: "Themes sparked national commentary and debate on ancestral heritage." },
    ],
    quote:
      "With this work, I wanted to confront the ghosts we inherit. It is not just a story of a family, but a meditation on how history breathes down our necks, demanding to be acknowledged before it can ever be truly laid to rest.",

    launchPhotos: [
      "/books/IMG_0294 1.png",
      "/books/IMG_0552 1.png",
      "/books/IMG_3219 1.png",
    ],
  },
  {
    slug: "satans-and-shaitans-anniversary",
    title: "Satans & Shaitans",
    listLabel: "Jacaranda 10th Anniversary Edition",
    listTagline: "Reissued for the anniversary edition.",
    listDescription:
      "Determined to overrule the Nigerian President, members of five powerful secret cartels, The Sea and Order of the Universal Forces, orchestrate a chain of murders that shake the nation.",
    cover: "/bookpageimages/WhatsApp Image 2026-03-22 at 14.10.51 1.png",

    heroLabel: "Anniversary Edition — 2024",
    genre: "Crime Fiction — Thriller — Political",
    synopsis:
      "A decade after its original publication, Jacaranda presents the anniversary edition of Satans & Shaitans with a new introduction by the author. Five secret cartels, bound by ancient oaths and modern ambitions, plot against the Nigerian President. Udenwe's intricate storytelling remains as urgent and riveting as it was at first print — a thriller that maps the hidden geometry of power.",

    milestones: [
      { year: "2024", text: "Reissued in a special anniversary edition by Jacaranda Books, London." },
      { year: "2024", text: "New introduction exploring a decade of political shifts in Nigeria." },
    ],
    quote:
      "Ten years on, the secret rooms still whisper. This reissue is not a nostalgia trip — it is a reminder that the cartels never left.",

    launchPhotos: [
      "/books/IMG_0294 1.png",
      "/books/IMG_0552 1.png",
      "/books/IMG_3219 1.png",
    ],
  },
  {
    slug: "satans-and-shaitans",
    title: "Satans & Shaitans",
    listLabel: "ANA Prize — Prose Fiction, 2015",
    listTagline: "A thriller set against Nigeria's terrorism tension.",
    listDescription:
      "A powerful saga of love and betrayal set against the backdrop of political unrest. This award-winning novel cements Udenwe's position as a master of the modern African epic.",
    cover: "/bookpageimages/WhatsApp Image 2026-03-22 at 14.10.51 1 (1).png",

    heroLabel: "ANA Prize — 2015",
    genre: "Thriller — Crime Fiction",
    synopsis:
      "Satans & Shaitans is an explosive debut set against the backdrop of Nigeria's terrorism tension. Five shadowy cartels, bound by blood pacts and hungry for control, unleash a chain of assassinations that reach into the highest offices of the land. What begins as a love story between Ebube and Chinwe turns into a reckoning with faith, loyalty, and the invisible architectures of power.",

    milestones: [
      { year: "2015", text: "Winner of the ANA Prize for Prose Fiction." },
      { year: "2014", text: "Debut novel released to critical acclaim in Nigeria and abroad." },
    ],
    quote:
      "This was the book where I learned that the only way to describe Nigeria is to describe its ghosts — the ones at the dining table and the ones behind the curtain.",

    launchPhotos: [
      "/books/IMG_0294 1.png",
      "/books/IMG_0552 1.png",
      "/books/IMG_3219 1.png",
    ],
  },
  {
    slug: "colours-of-hatred",
    title: "Colours of Hatred",
    listLabel: "Chinua Achebe Prize for Literature, 2021",
    listTagline: "A gripping tale of love, loss, and the price of ambition.",
    listDescription:
      "A powerful saga of love and betrayal set against the backdrop of political unrest. This award-winning novel cements Udenwe's position as a master of the modern African epic.",
    cover: "/bookpageimages/WhatsApp Image 2026-03-22 at 14.10.51 1 (2).png",

    heroLabel: "Chinua Achebe Prize — 2021",
    genre: "Literary Fiction — Political Drama",
    synopsis:
      "Colours of Hatred follows a love that tries to hold its shape inside the hard machinery of Nigerian politics. Udenwe draws two unforgettable protagonists into a slow-burning storm of ambition, family loyalty, and violence — writing with the clarity of a journalist and the tenderness of a poet. The novel won the first edition of the Chinua Achebe Prize for Literature and was a finalist for the NLNG Nigeria Prize.",

    milestones: [
      { year: "2021", text: "Winner of the inaugural Chinua Achebe Prize for Literature." },
      { year: "2021", text: "Finalist, NLNG Nigeria Prize for Literature." },
    ],
    quote:
      "Love is always political in this country. I wanted to write a novel that refuses to pretend otherwise.",

    launchPhotos: [
      "/books/IMG_0294 1.png",
      "/books/IMG_0552 1.png",
      "/books/IMG_3219 1.png",
    ],
  },
];

export function getBook(slug: string): BookDetail | undefined {
  return BOOKS.find((b) => b.slug === slug);
}

export function getOtherBooks(slug: string): BookDetail[] {
  return BOOKS.filter((b) => b.slug !== slug);
}
