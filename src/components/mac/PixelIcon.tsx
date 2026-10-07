export type IconName =
  | "person"
  | "code"
  | "brain"
  | "heart"
  | "sparkles"
  | "emblem"
  | "happy"
  | "disk"
  | "folder"
  | "note"
  | "mail"
  | "trash"
  | "bot"
  | "star";
const shapes: Record<IconName, string> = {
  person: "M12 3h8v2h2v8h-2v2h-8v-2h-2V5h2z M10 19h12v2h4v8H6v-8h4z",
  code: "M10 8H7v3H4v3H1v4h3v3h3v3h3 M22 8h3v3h3v3h3v4h-3v3h-3v3h-3 M19 4h-3v8h-2v8h-2v8",
  brain:
    "M16 7V4h-4v2H8v4H5v5H3v7h3v5h6v2h4V7h4V4h-4 M20 7h4v3h3v5h2v7h-3v5h-6v2h-4 M8 13h4v5H8 M24 13h-4v5h4 M10 23h6m6 0h-6",
  heart:
    "M16 9V6h-3V4H7v2H4v3H2v8h3v4h4v4h4v3h6v-3h4v-4h4v-4h3V9h-2V6h-3V4h-6v2h-3z",
  sparkles:
    "M14 4h4v7h3v3h7v4h-7v3h-3v7h-4v-7h-3v-3H4v-4h7v-3h3z M25 2v6m-3-3h6 M5 24v6m-3-3h6",
  emblem:
    "M16 2h2v3h2v3h2v4h2v4h2v5h2v7h-2v-4h-2v-3h-3v-2h-3v1h-3v3h-3v3H8v3H4v-5h2v-5h2v-5h2v-4h2V9h2V5h2z M16 9h1v5h3v1h2v1h-4v3h1v3h-2v-2h-2v2h-1v-5h-3v-1h-1v-1h4v-1h1z",
  happy:
    "M5 2h22v25H5z M3 27h26v3H3z M9 6h14v13H9z M12 9v3m8-3v3 M12 15h2v2h4v-2h2 M9 23h3m6 0h5",
  disk: "M5 2h20l3 3v25H4V2z M9 2v10h14V2 M19 4v6 M8 18h16v12H8z M11 22h10m-10 4h10",
  folder: "M2 9V5h11l3 4h14v19H2z M2 12h28",
  note: "M7 2h14l5 5v23H7z M21 2v6h5 M11 13h11m-11 4h11m-11 4h11m-11 4h7",
  mail: "M2 8h28v19H2z M2 8l14 11L30 8 M2 27l10-11m8 0 10 11",
  trash: "M7 8h18l-2 22H9z M5 5h22 M12 5V2h8v3 M12 12v13m4-13v13m4-13v13",
  bot: "M5 7h22v21H5z M16 3v4 M14 2h4 M9 12h3v4H9z M20 12h3v4h-3z M10 22h12 M2 13v9m28-9v9",
  star: "M16 2l3 10h11l-9 6 4 12-9-7-9 7 4-12-9-6h11z",
};
export function PixelIcon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      className={`pixel-icon ${className}`}
      viewBox="0 0 32 32"
      fill={name === "emblem" ? "currentColor" : "none"}
      fillRule="evenodd"
      stroke="currentColor"
      strokeWidth={name === "emblem" ? 0 : 2}
      strokeLinejoin="miter"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path d={shapes[name]} />
    </svg>
  );
}
