// Real cover photos, keyed by the exact book title from the /mutoon feed.
// Add a new entry here (and drop the file in public/images/books/) to give
// any other book its own real cover. Per explicit direction, every other
// title uses the Bukhari cover as a placeholder for now, until real covers
// exist for them — swap DEFAULT_BOOK_COVER_IMAGE out per-title as they
// arrive, the same way the Bukhari entry works.
export const DEFAULT_BOOK_COVER_IMAGE = '/images/books/sahih-bukhari.png';
export const bookCoverImages: Record<string, string> = {
  'صحيح البخاري': DEFAULT_BOOK_COVER_IMAGE,
};

export function coverImageForTitle(title: string): string {
  return bookCoverImages[title] ?? DEFAULT_BOOK_COVER_IMAGE;
}

// An original, drawn book-plate — a decorative frame and the title set in
// place of the title's letters, not a photographed or scanned cover — so
// each book card reads as a book rather than a text-only tile. Bukhari has
// a real cover (the app's own licensed asset, see
// public/images/books/sahih-bukhari.png). Every other book gets a drawn
// plate in the same black/red/gold language as that real cover — an
// original design, not a copy of any other publisher's specific artwork —
// so any row or grid of these reads as one consistent shelf rather than one
// photo among generic tiles.
export function BookCoverArt({
  title,
  author,
  imageSrc,
  className,
}: {
  title: string;
  author: string;
  imageSrc?: string;
  className?: string;
}) {
  const base = 'relative aspect-[3/4] w-full overflow-hidden bg-black';
  const wrapperClass = className ? `${base} ${className}` : `${base} rounded-t-[calc(var(--radius-lg)-1px)]`;

  if (imageSrc) {
    return (
      <div className={wrapperClass}>
        <img src={imageSrc} alt={title} className="h-full w-full object-cover object-top" />
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <svg viewBox="0 0 100 133" className="absolute inset-2.5 h-[calc(100%-1.25rem)] w-[calc(100%-1.25rem)]" fill="none" aria-hidden="true">
        <rect x="1.5" y="1.5" width="97" height="130" rx="1.5" stroke="#c9a24b" strokeOpacity="0.85" strokeWidth="1.1" />
        <rect x="5.5" y="5.5" width="89" height="122" rx="1" stroke="#c9a24b" strokeOpacity="0.55" strokeWidth="0.6" />
        <g stroke="#c9a24b" strokeOpacity="0.9" strokeWidth="0.9" strokeLinecap="round">
          <path d="M1.5 15 L1.5 1.5 L15 1.5" />
          <path d="M85 1.5 L98.5 1.5 L98.5 15" />
          <path d="M98.5 118 L98.5 131.5 L85 131.5" />
          <path d="M15 131.5 L1.5 131.5 L1.5 118" />
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-5">
        <span className="text-[9px] font-medium tracking-[0.2em] text-[#c9a24b]/80">دواوين السنة</span>
        <div className="w-full max-w-[85%] rounded-md border border-[#c9a24b]/70 bg-gradient-to-b from-[#7d2323] to-[#551515] px-3 py-4 text-center shadow-inner">
          <span className="line-clamp-4 text-balance font-display text-base font-bold leading-snug text-[#f4e2b0] md:text-lg">
            {title}
          </span>
        </div>
        <span className="h-px w-10 bg-[#c9a24b]/60" aria-hidden="true" />
        <span className="rounded-full border border-[#c9a24b]/60 px-3 py-1 text-xs text-[#e7d9ab]">{author}</span>
      </div>
      <div className="absolute bottom-3 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-[#c9a24b]/70" aria-hidden="true" />
    </div>
  );
}
