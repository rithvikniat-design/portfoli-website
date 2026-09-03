import slugify from "slugify";

export function generateSlug(title: string): string {
  return slugify(title, { lower: true, strict: true, trim: true });
}

export function parseJsonField<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function formatRuntime(minutes: string | null | undefined): string {
  if (!minutes) return "";
  const mins = parseInt(minutes, 10);
  if (isNaN(mins)) return minutes;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}min`;
  return `${h}h ${m}min`;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  // Handle youtube.com/watch?v=ID
  const watchMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
  );
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }
  // Handle vimeo.com/ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  // Already an embed URL
  if (url.includes("/embed/") || url.includes("player.vimeo.com")) {
    return url;
  }
  return url;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "…";
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
