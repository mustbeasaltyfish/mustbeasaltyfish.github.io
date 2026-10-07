export type IconName =
  | "happy"
  | "disk"
  | "folder"
  | "note"
  | "mail"
  | "trash"
  | "bot"
  | "star";
const shapes: Record<IconName, string> = {
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
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="miter"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path d={shapes[name]} />
    </svg>
  );
}
