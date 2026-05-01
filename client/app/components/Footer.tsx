import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-dark-green text-white/60 border-t border-white/10">
      <div className="px-6 md:px-8 lg:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <p className="font-serif text-white text-lg italic">Obinna Udenwe</p>
        <p className="text-xs">
          © {new Date().getFullYear()} Obinna Udenwe. All rights reserved.
        </p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs uppercase tracking-widest">
          <Link href="#" className="hover:text-gold transition-colors">
            Disclaimer
          </Link>
          <Link href="#" className="hover:text-gold transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-gold transition-colors">
            Contact
          </Link>
          <Link
            href="/admin/login"
            aria-label="Admin login"
            className="opacity-25 hover:opacity-100 transition-opacity text-[10px]"
          >
            •
          </Link>
        </div>
      </div>
    </footer>
  );
}
