import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: { absolute: "Contact Obinna Udenwe — Press, Publishers & Readers" },
  description:
    "Get in touch with Obinna Udenwe for press inquiries, publisher requests, bulk book orders, speaking engagements, and reader correspondence.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    title: "Contact Obinna Udenwe",
    description:
      "Press, publisher, and reader inquiries for Nigerian novelist Obinna Udenwe.",
    url: "/contact",
    images: ["/Obinna Udenwe Portrait.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Obinna Udenwe",
    description:
      "Press, publisher, and reader inquiries for Nigerian novelist Obinna Udenwe.",
    images: ["/Obinna Udenwe Portrait.png"],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
