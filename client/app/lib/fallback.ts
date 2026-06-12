// Original-design content used as fallback when the backend returns nothing.
// Keep entries shaped exactly like the API types so pages can swap in/out without branching.

import {
  Blog,
  Book,
  GalleryItemApi,
  SiteContent,
  Story,
} from "./api";

export type Prize = {
  label: string;
  title: string;
  year?: number;
  work?: string;
  items?: string[];
  detail: string;
};

export const FALLBACK_PRIZES: Prize[] = [
  {
    label: "Chinua Achebe Prize 2021",
    title: "The Chinua Achebe Prize for Literature",
    year: 2021,
    work: "Colours of Hatred",
    items: [
      "Inaugural edition of the prize",
      "Cited by the judges as a masterpiece of contemporary African literature",
      "Award ceremony held in Lagos, Nigeria",
    ],
    detail:
      "Udenwe won the inaugural edition of The Chinua Achebe Prize for Literature for his novel Colours of Hatred. The judging panel cited the novel as a masterpiece of contemporary African literature during the ceremony in Lagos. The prize is awarded annually to a single work that reshapes the imaginative terrain of the continent, and is named in honour of the late Chinua Achebe.",
  },
  {
    label: "ANA Prize 2019",
    title: "ANA Prize for Prose Fiction",
    year: 2019,
    work: "Satans & Shaitans",
    items: [
      "Awarded by the Association of Nigerian Authors",
      "Recognized in the prose fiction category",
    ],
    detail:
      "Satans & Shaitans, Udenwe's explosive debut set against the backdrop of Nigeria's terrorism tension, won the ANA Prize for Prose Fiction. The novel follows five shadowy cartels, bound by blood pacts and hungry for control, as they unleash a chain of assassinations that reach into the highest offices of the land.",
  },
  {
    label: "Prairie Schooner Prize 2020",
    title: "Prairie Schooner — Glenna Luschei Prize",
    year: 2020,
    work: "Prairie Schooner Prize Story",
    items: [
      "Awarded by the University of Nebraska Press",
      "Recognizes outstanding work published in Prairie Schooner magazine",
      "Also shortlisted for the Prairie Schooner — Raz Shumaker Book Prize",
    ],
    detail:
      "Udenwe was awarded the Prairie Schooner — Glenna Luschei Prize of the University of Nebraska Press in 2020 for his short fiction. He was also a finalist for the Prairie Schooner — Raz Shumaker Book Prize the same year, marking a defining international moment for his short-story work.",
  },
  {
    label: "NLNG Finalist",
    title: "The NLNG Nigeria Prize for Literature",
    year: 2023,
    work: "Colours of Hatred",
    items: [
      "Shortlisted in 2023",
      "One of the most prestigious literary prizes on the African continent",
    ],
    detail:
      "Colours of Hatred was a finalist for The NLNG Nigeria Prize for Literature, widely regarded as one of the most prestigious literary awards on the African continent. The shortlist recognition followed the novel's win at the Chinua Achebe Prize the year prior.",
  },
];

export const FALLBACK_SITE: SiteContent = {
  id: 0,
  hero_kicker: "Novelist. Story-teller. Civil engineer.",
  hero_title: "Obinna Udenwe",
  hero_subtitle:
    "Award-winning Nigerian author of power, faith, and consequence.",
  hero_cta_label: "Explore Bibliography",
  hero_image: "/obinna.jpg",
  awards: [
    "Chinua Achebe Prize 2021",
    "ANA Prize 2019",
    "Prairie Schooner Prize 2020",
    "NLNG Finalist",
  ],
  featured_kicker: "New Release 2025",
  featured_title: "Years of Shame",
  featured_tagline:
    "A sweeping saga of legacy and redemption in the heart of the savannah.",
  featured_description:
    "In his most ambitious work to date, Udenwe weaves a tapestry of political intrigue and personal sacrifice that redefines the modern West African epic.",
  featured_image: "/book1.png",
  newsletter_headline: "",
  newsletter_body: "",
  contact_email: "hello@obinnaudenwe.com",
  updated_at: "",
};

export const FALLBACK_GALLERY: GalleryItemApi[] = [
  {
    id: -1,
    title: "Gallery photo 1",
    image: "/books/IMG_0552 1.png",
    created_at: "",
    updated_at: "",
  },
  {
    id: -2,
    title: "Gallery photo 2",
    image: "/books/IMG_0294 1.png",
    created_at: "",
    updated_at: "",
  },
  {
    id: -3,
    title: "Gallery photo 3",
    image: "/books/IMG_3219 1.png",
    created_at: "",
    updated_at: "",
  },
  {
    id: -4,
    title: "Gallery photo 4",
    image: "/books/IMG_3219 1 (1).png",
    created_at: "",
    updated_at: "",
  },
];

export const FALLBACK_BOOKS: Book[] = [
  {
    id: -1,
    title: "Years of Shame",
    year: 2025,
    image: "/bookpageimages/WhatsApp Image 2026-03-22 at 14.10.51 1 (3).png",
    tagline:
      "A sweeping saga of legacy and redemption in the heart of the savannah.",
    description:
      "Set in southern Nigeria, Years of Shame tells the haunting tale of Patrice Nebe, a man whose defiance and misplaced pride lead him to take the oath of Oji — a feared ritual with a toll of wealth and children. The novel unravels the devastating ripple effects of this decision; spanning generations and culminating in a heart-wrenching reckoning for his descendants.",
    status: "published",
    created_at: "",
    updated_at: "",
  },
  {
    id: -2,
    title: "Satans and Shaitans",
    year: 2024,
    image: "/bookpageimages/WhatsApp Image 2026-03-22 at 14.10.51 1.png",
    tagline: "Reissued for the anniversary edition.",
    description:
      "A decade after its original publication, Jacaranda presents the anniversary edition of Satans & Shaitans with a new introduction by the author. Five secret cartels, bound by ancient oaths and modern ambitions, plot against the Nigerian President.",
    status: "published",
    created_at: "",
    updated_at: "",
  },
  {
    id: -3,
    title: "Colours of Hatred",
    year: 2021,
    image: "/bookpageimages/WhatsApp Image 2026-03-22 at 14.10.51 1 (2).png",
    tagline: "A gripping tale of love, loss, and the price of ambition.",
    description:
      "Colours of Hatred follows a love that tries to hold its shape inside the hard machinery of Nigerian politics. Udenwe draws two unforgettable protagonists into a slow-burning storm of ambition, family loyalty, and violence. Winner of the inaugural Chinua Achebe Prize for Literature.",
    status: "published",
    created_at: "",
    updated_at: "",
  },
  {
    id: -4,
    title: "Satans & Shaitans (2nd Ed.)",
    year: 2015,
    image: "/bookpageimages/WhatsApp Image 2026-03-22 at 14.10.51 1 (1).png",
    tagline: "A thriller set against Nigeria's terrorism tension.",
    description:
      "Satans & Shaitans is an explosive debut set against the backdrop of Nigeria's terrorism tension. Five shadowy cartels, bound by blood pacts and hungry for control, unleash a chain of assassinations that reach into the highest offices of the land. Winner of the ANA Prize for Prose Fiction.",
    status: "published",
    created_at: "",
    updated_at: "",
  },
];

export const FALLBACK_BLOGS: Blog[] = [
  {
    id: -7,
    title: "AI Enabled Writing vs Traditional Writing: A Necessary & Disrupting Argument",
    category: "blog",
    published_on: "May 20, 2026",
    excerpt:
      "Following the debate around AI and creative writing — now reignited by Jamir Nazir winning the Caribbean Regional Commonwealth Short Story Prize for The Serpent in the Grove — here is why AI-enabled work and traditional writing should not be judged on the same stage.",
    body: "Following the debate around AI and creative writing which has been recurrent the past two years, more or less and which has now resurfaced since one Jamir Nazir was announced the Caribbean Regional Winner of the Commonwealth Short Story Prize for his story, The Serpent in the Grove, here is what I think.\n\nCreative writing and writing in general is one of the most intellectually demanding endeavors in the world. To the reader, it might appear easy but to produce a good piece of literature that transports the reader from the known to the unknown world and vice-versa and make them fall in love with nonexistent characters and places, using seductive creative voice, unique and distinct, the writer must employ great focus, devote incredible amount of solitary time and research and read widely. If he keeps at this, he develops his craft over time, to the level his works are widely admired, then he is rewarded. It has been so since the existence of written words. Even in oral storytelling, the sage does not mature overnight, it takes years of telling and re-telling stories, traveling from one territory to another, exploring cultures and traditions and folklores, to develop to the level their stories are widely regarded and retold for generations.\n\nNow, what AI does is to eliminate this process. The writer who uses AI no longer concerns himself (at least to my understanding) with in-depth study, research, does not devote as much time to solitude as is required to concentrate to write and does not engage the machines of the mind to craft words in ways that they please the reader's senses. He does not rely on using perhaps his cultural and historic knowledge and experiences to build stories that are accepted to meet traditional standards of storytelling. Rather, works produced appear superficial or high-end or shiny or incredibly classic or ridiculously polished or a mix of two or all of these features. The reader is left with the feeling akin to eating say a plate of ice cream that has salt in it or palm wine with some saccharine, which insults the pallet.\n\nNow, we have come to a crossroads, where we have to accept that AI has come to stay. But as much as AI is important to our daily lives, we should make a distinction in its application. Do we need it in machine learning, economics and data generation, high-end technology, medical research and practice, engineering and technology? Yes. Definitely. Do we need it in creative practice such as in writing, painting, crafts etc? This is hard to answer. My take is that saying that a writer who engages his craft with the aid of AI tools should be taken as much seriously as the traditional writer, and the AI artist allowed to compete alongside traditional artists is like allowing a transgender compete in same sports event with traditional male or female athletes. That would be unfair and disturbing.\n\nAs a writer of short stories and novels, it takes me a minimum of two weeks to craft and finish a short story. Another week or so to sit on it and revisit with fresh eyes, before the editor picks it up and I go back to implement the editor's suggestions. For novels, it takes me a minimum of 4 - 6 months (sometimes a year or more) to finish a first draft and another 4 months to research and re-write before they go to the editor. I presume that a writer using AI tools would knock off a short story in a day or two and a novel in days or weeks (I don't know). To award a prize to this AI enabled author against traditional writers in the same competition is not only disappointing but disrupting of the traditional storytelling ideas as we know it and a shame, to say the least.\n\nPerhaps what can be done is to have two classes of writers. The AI enabled writers should not be ashamed or afraid to identify as such and their works graded differently from traditional writers and those to whom these kind of writing appeal to, allowed to savor them.\n\nObinna Udenwe\n20/05/2026",
    cover: "/obinnablog.jpeg",
    status: "published",
    created_at: "",
    updated_at: "",
  },
  {
    id: -1,
    title: "The Satirist's Burden: A New Chapter in Nigerian Political Fiction",
    category: "news",
    published_on: "October 12, 2024",
    excerpt:
      "In his recent dispatch, Udenwe explores the delicate balance between satirical license and the contemporary pulse of Nigerian governance, marking a pivotal shift in his upcoming anthology.",
    body: "In his recent dispatch, Udenwe explores the delicate balance between satirical license and the contemporary pulse of Nigerian governance. Across two essays and a forthcoming novella, the writer maps a pivotal shift in his thinking about humor as a political instrument — and the costs of wielding it from inside the country he writes about.",
    cover: "/Obinna Udenwe Portrait.png",
    status: "published",
    created_at: "",
    updated_at: "",
  },
  {
    id: -2,
    title: "The Silence of the Archives: Why We Must Write What We Forget",
    category: "blog",
    published_on: "September 5, 2024",
    excerpt:
      "History is often a collection of what was convenient to record. For the Nigerian writer, the archive is not just a place of discovery but a site of excavation and reconstruction of the suppressed voice.",
    body: "History is often a collection of what was convenient to record. For the Nigerian writer, the archive is not just a place of discovery but a site of excavation — the reconstruction of voices the official record never wanted preserved. The essay traces how Udenwe's recent fiction has drawn from oral histories, court ledgers, and family letters to surface what was meant to disappear.",
    cover: "",
    status: "published",
    created_at: "",
    updated_at: "",
  },
  {
    id: -3,
    title: "Obinna Udenwe Wins the Prestigious Heritage Lit Prize",
    category: "news",
    published_on: "August 30, 2024",
    excerpt:
      "The judging panel cited The Colors of Hatred as a masterpiece of contemporary African literature during the ceremony in Lagos.",
    body: "The judging panel cited Colours of Hatred as a masterpiece of contemporary African literature during the ceremony in Lagos. The prize, awarded annually to a single work that 'reshapes the imaginative terrain of the continent,' comes a year after the novel was shortlisted for the NLNG Nigeria Prize for Literature.",
    cover: "/books/IMG_0552 1.png",
    status: "published",
    created_at: "",
    updated_at: "",
  },
  {
    id: -4,
    title: "Morning Tea in Abakaliki",
    category: "blog",
    published_on: "August 30, 2024",
    excerpt:
      "Finding the rhythm of prose outside the bustle of Lagos at Mount Sinai.",
    body: "Finding the rhythm of prose outside the bustle of Lagos at Mount Sinai — a short reflection on writing routines, light, and the kind of quiet that only comes before a city wakes.",
    cover: "",
    status: "published",
    created_at: "",
    updated_at: "",
  },
  {
    id: -5,
    title: "Reflections on Chinua Achebe",
    category: "blog",
    published_on: "July 22, 2024",
    excerpt:
      "Rereading Arrow of God in the 21st century and finding new echoes of power and age.",
    body: "Rereading Arrow of God in the twenty-first century, the novel's quiet meditations on power and age land with new force. This piece is part personal recollection, part close reading, and part argument for why each generation of Nigerian writers must encounter Achebe on their own terms.",
    cover: "",
    status: "published",
    created_at: "",
    updated_at: "",
  },
  {
    id: -6,
    title: "Upcoming Workshop: The Art of Suspense",
    category: "blog",
    published_on: "August 10, 2024",
    excerpt:
      "Join Obinna for an intensive 5-day digital masterclass on crafting political thrillers.",
    body: "Join Obinna for an intensive 5-day digital masterclass on crafting political thrillers. The workshop covers pacing, the architecture of conspiracy, and the discipline of writing menace without resorting to spectacle.",
    cover: "",
    status: "published",
    created_at: "",
    updated_at: "",
  },
];

export const FALLBACK_STORIES: Story[] = [
  {
    id: -1,
    title: "It Has to Do with Emilia",
    read_time: "8 Min",
    excerpt:
      "The complexities of memory and betrayal unfold in a small town — adapted into a film in 2022 by Bump Films, South Africa.",
    body: "I remember the way the heat clung to the corridors of the Enugu library, a thick, stagnant air that tasted of dust and old bindings. Emilia sat three tables away, her presence a quiet weight on the room.\n\nWeeks passed before we spoke. The rain had finally broken the heat, a sudden tropical downpour that turned the red earth into a slick, treacherous canvas. We stood under the concrete overhang of the library entrance, watching the world turn grey. She asked for a light, though she had no cigarette. It was an opening, a bridge built of thin air and shared proximity.",
    cover: "/Cinematic frame.png",
    status: "published",
    created_at: "",
    updated_at: "",
  },
  {
    id: -2,
    title: "Prairie Schooner Prize Story",
    read_time: "12 Min",
    excerpt:
      "An odyssey of spirits and shadows across the Nigerian landscape — winner of the Prairie Schooner — Glenna Luschei Prize, 2020.",
    body: "An odyssey of spirits and shadows across the Nigerian landscape. A profound exploration of identity and heritage, recognized for its exceptional narrative depth.",
    cover: "",
    status: "published",
    created_at: "",
    updated_at: "",
  },
  {
    id: -3,
    title: "Crossover Mexico-Nigeria Stories",
    read_time: "10 Min",
    excerpt:
      "Reflections on the cultural bridges between two disparate yet connected worlds.",
    body: "Reflections on the cultural bridges between two disparate yet connected worlds. Produced in partnership with Nora Vasconselos as part of the Crossover Mexico–Nigeria project.",
    cover: "",
    status: "published",
    created_at: "",
    updated_at: "",
  },
  {
    id: -4,
    title: "Holy Sex (Series)",
    read_time: "15 Min",
    excerpt:
      "A provocative exploration of the sacred and the profane in modern Lagos.",
    body: "A provocative exploration of the sacred and the profane in modern Lagos. A daring series that navigates the intersections of faith, desire, and the human condition. Originally serialized on Brittle Paper from 2014.",
    cover: "",
    status: "published",
    created_at: "",
    updated_at: "",
  },
  {
    id: -5,
    title: "The Short Story is Dead Prize Story",
    read_time: "9 Min",
    excerpt:
      "The final moments of a dying tradition told through multiple perspectives — winner of the Short Story is Dead Prize, 2015.",
    body: "The final moments of a dying tradition told through multiple perspectives. Challenging the boundaries of the form, this piece captured the spirit of contemporary African fiction.",
    cover: "",
    status: "published",
    created_at: "",
    updated_at: "",
  },
];
