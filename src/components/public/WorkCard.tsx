import Link from "next/link";

interface WorkCardProps {
  work: {
    id?: string;
    slug: string;
    title: string;
    year?: number | null;
    role: string;
    genre?: string | null;
    poster?: string | null;
    logline?: string | null;
  };
}

export default function WorkCard({ work }: WorkCardProps) {
  const { slug, title, year, role, genre, poster, logline } = work;
  return (
    <Link href={`/works/${slug}`} className="group block">
      <div className="card-hover rounded-lg overflow-hidden bg-charcoal-900 border border-charcoal-800 hover:border-gold-400/30 transition-colors duration-500">
        {/* Poster */}
        <div className="aspect-[2/3] relative overflow-hidden bg-charcoal-800">
          {poster ? (
            <img
              src={poster}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-charcoal-600">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          {/* Gold overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent opacity-60" />
          <div className="absolute inset-0 bg-gold-400/0 group-hover:bg-gold-400/5 transition-colors duration-500" />

          {/* Role badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-[10px] uppercase tracking-widest bg-charcoal-950/80 backdrop-blur-sm text-gold-400 rounded border border-gold-400/20">
              {role}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h3 className="font-display text-lg text-white group-hover:text-gold-400 transition-colors line-clamp-1">
              {title}
            </h3>
            {year && (
              <span className="text-xs text-charcoal-400 shrink-0">{year}</span>
            )}
          </div>
          {genre && (
            <p className="text-xs text-charcoal-400 uppercase tracking-wider mb-2">
              {genre}
            </p>
          )}
          {logline && (
            <p className="text-sm text-charcoal-300 line-clamp-2 leading-relaxed">
              {logline}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
