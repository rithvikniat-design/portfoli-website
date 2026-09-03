import Link from "next/link";
import { Film, BookOpen, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-charcoal-800/50 bg-charcoal-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="gold-divider mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl text-white mb-3">
              A<span className="text-gold-400">.</span> Menon
            </h3>
            <p className="text-charcoal-400 text-sm leading-relaxed">
              Filmmaker · Novelist · Storyteller
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-400 mb-4">
              Explore
            </h4>
            <div className="space-y-2">
              <Link
                href="/works"
                className="flex items-center gap-2 text-sm text-charcoal-300 hover:text-white transition-colors"
              >
                <Film size={14} />
                Filmography
              </Link>
              <Link
                href="/writing"
                className="flex items-center gap-2 text-sm text-charcoal-300 hover:text-white transition-colors"
              >
                <BookOpen size={14} />
                Writing
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 text-sm text-charcoal-300 hover:text-white transition-colors"
              >
                <Mail size={14} />
                Contact
              </Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-400 mb-4">
              Connect
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-charcoal-400 hover:text-gold-400 transition-colors text-sm"
              >
                IMDb
              </a>
              <a
                href="#"
                className="text-charcoal-400 hover:text-gold-400 transition-colors text-sm"
              >
                Letterboxd
              </a>
              <a
                href="#"
                className="text-charcoal-400 hover:text-gold-400 transition-colors text-sm"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-charcoal-800/30 text-center">
          <p className="text-charcoal-500 text-xs tracking-wide">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
