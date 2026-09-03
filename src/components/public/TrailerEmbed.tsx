import { getYouTubeEmbedUrl } from "@/lib/utils";

interface TrailerEmbedProps {
  url: string;
  title?: string;
}

export default function TrailerEmbed({ url, title = "Trailer" }: TrailerEmbedProps) {
  const embedUrl = getYouTubeEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-charcoal-900 border border-charcoal-800">
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        loading="lazy"
      />
    </div>
  );
}
