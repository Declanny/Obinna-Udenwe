import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "./lib/seo";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Obinna Udenwe — Award-winning Nigerian Novelist & Storyteller",
    template: "%s — Obinna Udenwe",
  },
  description:
    "Official site of Obinna Udenwe, award-winning Nigerian author of literary thrillers exploring power, faith, and consequence. Read his novels, short stories, essays, and news.",
  applicationName: "Obinna Udenwe",
  authors: [{ name: "Obinna Udenwe", url: SITE_URL }],
  creator: "Obinna Udenwe",
  publisher: "Obinna Udenwe",
  keywords: [
    "Obinna Udenwe",
    "Nigerian author",
    "African literature",
    "literary thrillers",
    "Satans and Shaitans",
    "Colours of Hatred",
    "Years of Shame",
    "Chinua Achebe Prize",
    "ANA Prize",
    "Prairie Schooner Prize",
    "African novels",
    "Nigerian writer",
    "contemporary African fiction",
    "short stories",
  ],
  category: "Literature",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Obinna Udenwe",
    title: "Obinna Udenwe — Award-winning Nigerian Novelist & Storyteller",
    description:
      "Official site of Obinna Udenwe, award-winning Nigerian author of literary thrillers exploring power, faith, and consequence.",
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: "/Obinna Udenwe Portrait.png",
        width: 1200,
        height: 630,
        alt: "Obinna Udenwe, Nigerian author",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Obinna Udenwe — Award-winning Nigerian Novelist & Storyteller",
    description:
      "Official site of Obinna Udenwe, award-winning Nigerian author of literary thrillers exploring power, faith, and consequence.",
    images: ["/Obinna Udenwe Portrait.png"],
    creator: "@obinnaudenwe",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  verification: {
    // Replace with real tokens once Search Console / Bing Webmaster are set up.
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b3a2e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
