"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { QuoteAndNewsletter } from "../components/QuoteAndNewsletter";

type InquiryType = "reader" | "press" | "publishers" | "events";

const INQUIRIES: {
  value: InquiryType;
  label: string;
  description: string;
  icon: ReactNode;
  fields: { organization?: string; schedule?: string };
}[] = [
  {
    value: "reader",
    label: "Reader",
    description: "Fans and readers who want to say hello or ask a question",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 17 17 7" />
        <path d="M8 7h9v9" />
      </svg>
    ),
    fields: {},
  },
  {
    value: "press",
    label: "Press",
    description: "Journalists, media outlets, interview requests",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="3" width="6" height="12" rx="3" />
        <path d="M6 11a6 6 0 0 0 12 0" />
        <path d="M12 17v4" />
        <path d="M9 21h6" />
      </svg>
    ),
    fields: { organization: "Publication / Outlet" },
  },
  {
    value: "publishers",
    label: "Publishers",
    description: "Publishing houses, literary agents, rights enquiries",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6" />
        <path d="M9 17h6" />
      </svg>
    ),
    fields: { organization: "Publishing House / Agency" },
  },
  {
    value: "events",
    label: "Events",
    description: "Festival organizers, speaking engagements, panels",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 4h8l-1 5H9z" />
        <path d="M12 9v7" />
        <path d="M6 20h12" />
        <path d="M9 20l1-4h4l1 4" />
      </svg>
    ),
    fields: { organization: "Organization / Festival", schedule: "Event Date / Location" },
  },
];

function Hero() {
  return (
    <section className="bg-dark-green text-white">
      <div className="px-6 md:px-8 lg:px-16 py-16 md:py-24 lg:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gold text-xs md:text-sm uppercase tracking-[0.25em] font-semibold mb-6">
            Get in Touch
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
            Let&apos;s Talk
          </h1>
          <p className="text-sm md:text-base text-white/75 leading-relaxed max-w-2xl mx-auto">
            Whether it&apos;s for a literary inquiry, media request, or a simple greeting from
            a reader, my door is always open to meaningful conversation.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mt-12 md:mt-14 pt-10 md:pt-12 border-t border-white/15">
          <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
            <div>
              <p className="font-serif text-3xl md:text-4xl text-white">6</p>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/60 mt-2">
                Published Works
              </p>
            </div>
            <div>
              <p className="font-serif text-3xl md:text-4xl text-white">5</p>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/60 mt-2">
                Awards Won
              </p>
            </div>
            <div>
              <p className="font-serif italic text-2xl md:text-3xl text-white">Abakaliki</p>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/60 mt-2">
                Based in Nigeria
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InquiryCard({
  data,
  active,
  onSelect,
}: {
  data: (typeof INQUIRIES)[number];
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`group relative rounded-2xl p-6 md:p-7 text-left transition-all duration-300 min-h-[160px] md:min-h-[180px] flex flex-col ${
        active
          ? "text-white shadow-lg"
          : "bg-dark-green text-white hover:bg-dark-green/90 hover:-translate-y-0.5"
      }`}
      style={active ? { backgroundColor: "#7E5700" } : undefined}
    >
      <div className={`transition-colors ${active ? "text-white" : "text-white/85 group-hover:text-gold"}`}>
        {data.icon}
      </div>
      <p className="font-serif text-xl md:text-2xl mt-4">{data.label}</p>
      <p
        className={`text-xs leading-relaxed mt-2 transition-[opacity,max-height] duration-300 ${
          active
            ? "opacity-90 max-h-24"
            : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        {data.description}
      </p>
    </button>
  );
}

type SubmitStatus = "idle" | "sending" | "sent" | "error";

type Confirmation = {
  reference: string;
  inquiry: InquiryType;
  name: string;
  email: string;
  subject: string;
};

function generateReference() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `OBU-${stamp}-${rand}`;
}

function ContactForm() {
  const [selected, setSelected] = useState<InquiryType>("reader");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const current = INQUIRIES.find((i) => i.value === selected)!;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("sending");

    // Simulated backend round-trip — swap for fetch("/api/contact", ...) once wired up.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setConfirmation({
      reference: generateReference(),
      inquiry: selected,
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      subject: String(data.get("subject") ?? ""),
    });
    setStatus("sent");
    form.reset();
  };

  const reset = () => {
    setStatus("idle");
    setConfirmation(null);
  };

  return (
    <section className="bg-cream">
      <div className="px-6 md:px-8 lg:px-16 py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto">
          {status === "sent" && confirmation ? (
            <ConfirmationCard data={confirmation} onReset={reset} />
          ) : (
            <>
              <h2 className="font-serif text-2xl md:text-3xl text-dark-green text-center mb-10 md:mb-12">
                What is the nature of your inquiry?
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                {INQUIRIES.map((inq) => (
                  <InquiryCard
                    key={inq.value}
                    data={inq}
                    active={selected === inq.value}
                    onSelect={() => setSelected(inq.value)}
                  />
                ))}
              </div>

              <form onSubmit={handleSubmit} className="mt-14 md:mt-16 space-y-8">
                <fieldset
                  disabled={status === "sending"}
                  className="space-y-8 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FormField label="Full Name" name="name" required />
                  <FormField label="Email Address" name="email" type="email" required />
                  <FormField label="Subject" name="subject" required />

                  {(current.fields.organization || current.fields.schedule) && (
                    <div className="grid md:grid-cols-2 gap-8">
                      {current.fields.organization && (
                        <FormField
                          label={current.fields.organization}
                          name="organization"
                        />
                      )}
                      {current.fields.schedule && (
                        <FormField
                          label={current.fields.schedule}
                          name="schedule"
                        />
                      )}
                    </div>
                  )}

                  <FormField label="Your Message" name="message" textarea required />
                </fieldset>

                {status === "error" && (
                  <p
                    role="alert"
                    className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-4 py-3"
                  >
                    Something went wrong sending your inquiry. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-gold hover:bg-gold/90 disabled:bg-gold/70 disabled:cursor-wait text-white text-xs md:text-sm font-semibold uppercase tracking-[0.25em] py-5 md:py-6 rounded-sm transition-colors flex items-center justify-center gap-3"
                >
                  {status === "sending" ? (
                    <>
                      <Spinner />
                      <span>Sending Inquiry…</span>
                    </>
                  ) : (
                    "Send Inquiry"
                  )}
                </button>

                <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-dark-green/50 text-center">
                  Replies typically within 2–3 business days
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin"
    />
  );
}

function ConfirmationCard({
  data,
  onReset,
}: {
  data: Confirmation;
  onReset: () => void;
}) {
  const inquiry = INQUIRIES.find((i) => i.value === data.inquiry)!;
  return (
    <div className="bg-white border border-dark-green/15 rounded-sm shadow-sm overflow-hidden">
      <div className="bg-dark-green text-white px-6 md:px-10 py-8 md:py-10">
        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-center justify-center w-11 h-11 rounded-full bg-gold/20 text-gold">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gold font-semibold">
            Inquiry received
          </p>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl leading-tight">
          Thank you, {data.name.split(" ")[0] || "friend"}.
        </h2>
        <p className="text-sm md:text-base text-white/75 mt-3 max-w-lg leading-relaxed">
          Your {inquiry.label.toLowerCase()} inquiry has been queued. A confirmation
          has been sent to <span className="text-white">{data.email}</span> and we&apos;ll
          be in touch within 2–3 business days.
        </p>
      </div>
      <div className="px-6 md:px-10 py-8 md:py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 text-dark-green">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-dark-green/55 mb-2">
            Reference
          </p>
          <p className="font-mono text-sm md:text-base text-dark-green tracking-wider">
            {data.reference}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-dark-green/55 mb-2">
            Category
          </p>
          <p className="font-serif text-base md:text-lg">{inquiry.label}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-dark-green/55 mb-2">
            Subject
          </p>
          <p className="font-serif text-base md:text-lg break-words">
            {data.subject || "—"}
          </p>
        </div>
      </div>
      <div className="px-6 md:px-10 pb-8 md:pb-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onReset}
          className="bg-gold hover:bg-gold/90 text-white text-xs font-semibold uppercase tracking-[0.25em] px-6 py-3.5 rounded-sm transition-colors"
        >
          Send another inquiry
        </button>
        <a
          href={`mailto:hello@obinnaudenwe.com?subject=${encodeURIComponent(
            `Re: ${data.reference}`,
          )}`}
          className="border border-dark-green/30 hover:border-dark-green text-dark-green text-xs font-semibold uppercase tracking-[0.25em] px-6 py-3.5 rounded-sm transition-colors text-center"
        >
          Email us directly
        </a>
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
  required,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const common =
    "w-full bg-transparent border-b border-dark-green/25 focus:border-gold outline-none pt-2 pb-2 text-dark-green placeholder-dark-green/40 text-sm md:text-base transition-colors";
  return (
    <label className="block">
      <span className="block text-[10px] md:text-xs uppercase tracking-[0.25em] text-dark-green/55 mb-2">
        {label}
      </span>
      {textarea ? (
        <textarea name={name} required={required} rows={3} className={`${common} resize-none`} />
      ) : (
        <input name={name} type={type} required={required} className={common} />
      )}
    </label>
  );
}

function ContactInfo() {
  const items = [
    {
      label: "Email",
      value: "hello@obinnaudenwe.com",
      href: "mailto:hello@obinnaudenwe.com",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      ),
    },
    {
      label: "Twitter / X",
      value: "@ObinnaUdenwe",
      href: "https://x.com/ObinnaUdenwe",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M8 8l8 8M16 8l-8 8" />
        </svg>
      ),
    },
    {
      label: "Based In",
      value: "Abakaliki, Nigeria",
      href: null,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-cream border-t border-dark-green/10">
      <div className="px-6 md:px-8 lg:px-16 py-10 md:py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 text-center">
          {items.map((it) => (
            <div key={it.label} className="flex flex-col items-center gap-2">
              <span className="text-gold">{it.icon}</span>
              <p className="text-[10px] uppercase tracking-[0.25em] text-dark-green/55">
                {it.label}
              </p>
              {it.href ? (
                <a
                  href={it.href}
                  className="font-serif text-base md:text-lg text-dark-green hover:text-gold transition-colors"
                >
                  {it.value}
                </a>
              ) : (
                <p className="font-serif text-base md:text-lg text-dark-green">
                  {it.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BulkOrders() {
  return (
    <section className="bg-[#ede7dd]">
      <div className="px-6 md:px-8 lg:px-16 py-10 md:py-12">
        <div className="max-w-4xl mx-auto border-l-2 border-gold pl-6">
          <h3 className="font-serif text-xl md:text-2xl text-dark-green mb-2">
            Bulk Orders &amp; School Adoptions
          </h3>
          <p className="text-sm text-dark-green/70 leading-relaxed max-w-2xl">
            For institutional purchases, university library acquisitions, or mass adoptions for
            educational programs, please indicate &ldquo;Bulk Order&rdquo; in your subject line for
            expedited processing.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <ContactForm />
      <ContactInfo />
      <BulkOrders />
      <QuoteAndNewsletter />
      <Footer />
    </>
  );
}
